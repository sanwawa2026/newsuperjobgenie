/**
 * SuperJobGenie — Universal Client-Side Resume Parser
 * Supports: .txt, .md, .json, .docx (Word XML decompression), .pdf (FlateDecode & text operators)
 * 100% Client-Side. No external server, zero tracking, runs in browser sandbox.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SuperJobResumeParser = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Helper: Decompress raw deflate (used in .docx ZIP entries)
   */
  async function decompressDeflateRaw(bytes) {
    try {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      const buffer = await new Response(stream).arrayBuffer();
      return new Uint8Array(buffer);
    } catch (e) {
      console.warn('[ResumeParser] DecompressionStream deflate-raw failed:', e);
      return null;
    }
  }

  /**
   * Helper: Decompress zlib deflate (used in PDF /FlateDecode streams)
   */
  async function decompressZlib(bytes) {
    try {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
      const buffer = await new Response(stream).arrayBuffer();
      return new Uint8Array(buffer);
    } catch (e) {
      // Sometimes PDF streams omit the 2-byte zlib header or have slight offset
      try {
        const streamRaw = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        const bufferRaw = await new Response(streamRaw).arrayBuffer();
        return new Uint8Array(bufferRaw);
      } catch (err2) {
        return null;
      }
    }
  }

  /**
   * 1. PARSE WORD (.docx)
   * A .docx file is a ZIP archive containing word/document.xml.
   */
  async function parseDocx(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    const bytes = new Uint8Array(arrayBuffer);
    let offset = 0;
    let documentXmlBytes = null;

    // Iterate through ZIP Local File Headers (Signature: 0x04034b50 -> 'PK\x03\x04')
    while (offset < bytes.length - 30) {
      if (
        bytes[offset] === 0x50 &&
        bytes[offset + 1] === 0x4b &&
        bytes[offset + 2] === 0x03 &&
        bytes[offset + 3] === 0x04
      ) {
        const compression = view.getUint16(offset + 8, true);
        const compSize = view.getUint32(offset + 18, true);
        const uncompSize = view.getUint32(offset + 22, true);
        const nameLen = view.getUint16(offset + 26, true);
        const extraLen = view.getUint16(offset + 28, true);

        const nameBytes = bytes.subarray(offset + 30, offset + 30 + nameLen);
        const fileName = new TextDecoder('utf-8').decode(nameBytes);
        const dataStart = offset + 30 + nameLen + extraLen;

        if (fileName === 'word/document.xml') {
          const compData = bytes.subarray(dataStart, dataStart + compSize);
          if (compression === 0) {
            documentXmlBytes = compData;
          } else if (compression === 8) {
            documentXmlBytes = await decompressDeflateRaw(compData);
          }
          break;
        }

        offset = dataStart + compSize;
      } else {
        offset++;
      }
    }

    if (!documentXmlBytes) {
      throw new Error('word/document.xml not found or decompression failed in .docx');
    }

    const xmlText = new TextDecoder('utf-8').decode(documentXmlBytes);

    // Extract text from word XML:
    // Split into paragraphs <w:p>, extract all <w:t> tags
    const paragraphs = xmlText.split(/<\/w:p>/gi);
    const lines = [];

    for (const para of paragraphs) {
      const textMatches = para.match(/<w:t[^>]*>(.*?)<\/w:t>/gi);
      if (textMatches && textMatches.length > 0) {
        const paraText = textMatches
          .map((m) => m.replace(/<[^>]+>/g, ''))
          .join('')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .trim();
        if (paraText) {
          lines.push(paraText);
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * 2. PARSE PDF (.pdf)
   * Extracts text streams, decompresses /FlateDecode, and decodes Tj/TJ strings.
   */
  async function parsePdf(arrayBuffer) {
    const rawBytes = new Uint8Array(arrayBuffer);
    const rawStr = new TextDecoder('latin1').decode(rawBytes);

    // Find all stream ... endstream positions
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;
    const extractedBlocks = [];

    while ((match = streamRegex.exec(rawStr)) !== null) {
      const streamStart = match.index + match[0].indexOf('\n') + 1;
      const streamEnd = match.index + match[0].lastIndexOf('endstream');
      
      // Look back for stream dictionary to see if FlateDecode was used
      const dictPrefix = rawStr.slice(Math.max(0, match.index - 500), match.index);
      const isFlate = /\/Filter\s*(\/FlateDecode|\[\s*\/FlateDecode\s*\])/i.test(dictPrefix);

      const streamBytes = rawBytes.subarray(streamStart, streamEnd);

      let textStream = '';
      if (isFlate) {
        const decompressed = await decompressZlib(streamBytes);
        if (decompressed) {
          textStream = new TextDecoder('latin1').decode(decompressed);
        }
      } else {
        textStream = new TextDecoder('latin1').decode(streamBytes);
      }

      if (textStream && (textStream.includes('BT') || textStream.includes('Tj') || textStream.includes('TJ'))) {
        const parsedText = extractTextFromPdfStream(textStream);
        if (parsedText && parsedText.trim().length > 0) {
          extractedBlocks.push(parsedText);
        }
      }
    }

    // Fallback: If streams didn't yield enough, search for uncompressed text blocks in raw string
    if (extractedBlocks.join(' ').length < 100) {
      const fallbackText = extractTextFromPdfStream(rawStr);
      if (fallbackText && fallbackText.trim().length > 100) {
        extractedBlocks.push(fallbackText);
      }
    }

    const fullText = extractedBlocks.join('\n\n').trim();
    if (!fullText || fullText.length < 50) {
      throw new Error('PDF contains scanned images or protected encoding without extractable text');
    }

    return fullText;
  }

  /**
   * Helper: Extract strings from a PDF content stream (BT ... ET, Tj, TJ)
   */
  function extractTextFromPdfStream(stream) {
    const lines = [];
    
    // Match TJ array operators: [(Part1) 120 (Part2) -15 (Part3)] TJ
    const tjArrayRegex = /\[((?:(?:\(.*?\))|(?:\<[0-9a-fA-F]+\>)|[^\]])+)\]\s*TJ/g;
    let tjMatch;
    while ((tjMatch = tjArrayRegex.exec(stream)) !== null) {
      const arrayContent = tjMatch[1];
      const stringParts = [];
      const itemRegex = /\((.*?)(?<!\\)\)/g;
      let item;
      while ((item = itemRegex.exec(arrayContent)) !== null) {
        stringParts.push(decodePdfString(item[1]));
      }
      if (stringParts.length > 0) {
        lines.push(stringParts.join(''));
      }
    }

    // Match standard string operators: (Text string) Tj or ' or "
    const tjSingleRegex = /\((.*?)(?<!\\)\)\s*(?:Tj|'|")/g;
    let singleMatch;
    while ((singleMatch = tjSingleRegex.exec(stream)) !== null) {
      const decoded = decodePdfString(singleMatch[1]);
      if (decoded && decoded.trim()) {
        lines.push(decoded);
      }
    }

    // Match hex strings: <48656c6c6f20576f726c64> Tj
    const hexRegex = /<([0-9a-fA-F\s]+)>\s*(?:Tj|TJ)/g;
    let hexMatch;
    while ((hexMatch = hexRegex.exec(stream)) !== null) {
      const hexClean = hexMatch[1].replace(/\s+/g, '');
      if (hexClean.length % 2 === 0) {
        let str = '';
        for (let i = 0; i < hexClean.length; i += 2) {
          const code = parseInt(hexClean.substr(i, 2), 16);
          if (code >= 32 && code <= 126) {
            str += String.fromCharCode(code);
          }
        }
        if (str.trim()) {
          lines.push(str);
        }
      }
    }

    // Clean up lines and reconstruct paragraphs
    return lines
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/([.!?])\s+/g, '$1\n');
  }

  /**
   * Helper: Decode escaped characters in PDF string literals
   */
  function decodePdfString(str) {
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
      .replace(/\\(\d{1,3})/g, (m, oct) => String.fromCharCode(parseInt(oct, 8)));
  }

  /**
   * 3. PARSE PLAIN TEXT (.txt, .md, .json, .csv, .rtf)
   */
  async function parsePlainText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let text = e.target?.result || '';
        // If RTF, strip control symbols
        if (text.startsWith('{\\rtf')) {
          text = text
            .replace(/\\par[d]?/g, '\n')
            .replace(/\\tab/g, '\t')
            .replace(/\\[a-zA-Z0-9\-]+/g, '')
            .replace(/[{}]/g, '')
            .trim();
        }
        resolve(text);
      };
      reader.onerror = () => reject(new Error('Failed to read plain text file'));
      reader.readAsText(file, 'utf-8');
    });
  }

  /**
   * MAIN UNIVERSAL DISPATCHER
   * @param {File} file - File object from <input type="file">
   * @returns {Promise<{ text: string, format: string, characterCount: number }>}
   */
  async function parseResumeFile(file) {
    if (!file) throw new Error('No file provided');

    const fileName = file.name.toLowerCase();
    const fileExt = fileName.substring(fileName.lastIndexOf('.'));

    let text = '';
    let format = 'unknown';

    // 1. DOCX (.docx)
    if (fileExt === '.docx') {
      format = 'Word (.docx)';
      const buffer = await file.arrayBuffer();
      text = await parseDocx(buffer);
    }
    // 2. PDF (.pdf)
    else if (fileExt === '.pdf') {
      format = 'PDF (.pdf)';
      const buffer = await file.arrayBuffer();
      text = await parsePdf(buffer);
    }
    // 3. Plain Text / Markdown / JSON / RTF (.txt, .md, .json, .rtf, .csv)
    else {
      format = fileExt ? fileExt.toUpperCase() : 'Plain Text';
      text = await parsePlainText(file);
    }

    // Clean whitespace and normalize line breaks
    text = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove ASCII control characters
      .trim();

    return {
      text,
      format,
      characterCount: text.length
    };
  }

  return {
    parseResumeFile,
    parseDocx,
    parsePdf,
    parsePlainText
  };
});
