const fs = require('fs');
const zlib = require('zlib');

function makeCRCTable() {
    let c;
    let crcTable = [];
    for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

const crcTable = makeCRCTable();

function calcCRC(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return ~c >>> 0;
}

function createPNG(width, height, colorFn) {
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;
    ihdr[9] = 2;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    
    const ihdrChunk = Buffer.concat([
        Buffer.from([0, 0, 0, 13]),
        Buffer.from('IHDR'),
        ihdr,
        Buffer.alloc(4)
    ]);
    ihdrChunk.writeUInt32BE(calcCRC(ihdrChunk.slice(4, ihdrChunk.length - 4)), ihdrChunk.length - 4);

    let rawData = Buffer.alloc(height * (1 + width * 3));
    let pos = 0;
    for (let y = 0; y < height; y++) {
        rawData[pos++] = 0;
        for (let x = 0; x < width; x++) {
            const rgb = colorFn(x, y, width, height);
            rawData[pos++] = rgb[0];
            rawData[pos++] = rgb[1];
            rawData[pos++] = rgb[2];
        }
    }

    const compressed = zlib.deflateSync(rawData);
    const idatChunk = Buffer.concat([
        Buffer.alloc(4),
        Buffer.from('IDAT'),
        compressed,
        Buffer.alloc(4)
    ]);
    idatChunk.writeUInt32BE(compressed.length, 0);
    idatChunk.writeUInt32BE(calcCRC(idatChunk.slice(4, idatChunk.length - 4)), idatChunk.length - 4);

    const iendChunk = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function iconColor(x, y, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const radius = w * 0.46;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= radius) {
        const relX = (x - cx) / (w / 2);
        const relY = (y - cy) / (h / 2);
        
        // Upward arrow shape
        if (Math.abs(relX) < 0.22 && relY > -0.35 && relY < 0.35) {
            return [255, 255, 255];
        }
        if (relY > -0.35 && relY < 0.05 && Math.abs(relX) < (0.55 - Math.abs(relY + 0.35))) {
            return [255, 255, 255];
        }
        
        return [79, 70, 229]; // Indigo #4f46e5
    }
    
    return [255, 255, 255];
}

[16, 48, 128].forEach(size => {
    const png = createPNG(size, size, iconColor);
    fs.writeFileSync(`extension/icons/icon${size}.png`, png);
    console.log(`Generated extension/icons/icon${size}.png`);
});
