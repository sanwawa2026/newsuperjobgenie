import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packageRelease() {
  const extDir = path.resolve(process.cwd(), 'extension');
  const outPath = path.resolve(process.cwd(), 'public', 'superjobgenie-v2.9.9-chrome-webstore-release.zip');
  const zip = new JSZip();

  const filesToInclude = [
    'manifest.json',
    'background.js',
    'content.js',
    'resume-parser.js',
    'popup.html',
    'popup.js',
    'styles.css'
  ];

  for (const file of filesToInclude) {
    const filePath = path.join(extDir, file);
    if (fs.existsSync(filePath)) {
      zip.file(file, fs.readFileSync(filePath));
      console.log(`Added ${file}`);
    }
  }

  const iconsDir = path.join(extDir, 'icons');
  if (fs.existsSync(iconsDir)) {
    const iconsFolder = zip.folder('icons');
    const iconFiles = fs.readdirSync(iconsDir);
    for (const icon of iconFiles) {
      iconsFolder?.file(icon, fs.readFileSync(path.join(iconsDir, icon)));
      console.log(`Added icons/${icon}`);
    }
  }

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  fs.writeFileSync(outPath, content);
  console.log(`Successfully created release zip at: ${outPath} (${(content.length / 1024).toFixed(1)} KB)`);
}

packageRelease().catch(console.error);
