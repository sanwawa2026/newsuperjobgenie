import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function packZip() {
  const zip = new JSZip();
  const bundleDir = '/tmp/desktop_bundle';

  function addDir(dirPath, zipFolder) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const subFolder = zipFolder ? zipFolder.folder(entry.name) : zip.folder(entry.name);
        addDir(fullPath, subFolder);
      } else {
        const content = fs.readFileSync(fullPath);
        if (zipFolder) {
          zipFolder.file(entry.name, content);
        } else {
          zip.file(entry.name, content);
        }
      }
    }
  }

  addDir(bundleDir, null);

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const outPath = path.join(rootDir, 'public', 'SuperJobGenie_Cool_Webpage_Desktop.zip');
  fs.writeFileSync(outPath, zipBuffer);

  const stats = fs.statSync(outPath);
  console.log(`[ZIP SUCCESS] Created ${outPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB, ${stats.size} bytes)`);
}

packZip().catch(console.error);
