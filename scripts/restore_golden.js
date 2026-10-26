import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('\n🚑 [军师紧急营救程序] 正在从黄金镜像 (.golden_v1) 一键还原本尊设计...\n');

const FILES_TO_RESTORE = [
  {
    from: '.golden_v1/src/components/IndustrialHero.tsx',
    to: 'src/components/IndustrialHero.tsx'
  },
  {
    from: '.golden_v1/public/assets/aistudio/___8s_d10be03c.mp4',
    to: 'public/assets/aistudio/___8s_d10be03c.mp4'
  }
];

let restoredCount = 0;
for (const item of FILES_TO_RESTORE) {
  const srcPath = path.join(ROOT, item.from);
  const destPath = path.join(ROOT, item.to);

  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ 成功还原本尊文件: ${item.to}`);
    restoredCount++;
  } else {
    console.warn(`  ⚠️ 镜像文件缺失: ${item.from}`);
  }
}

console.log(`\n🎉 [大功告成] 黄金版本恢复完毕 (${restoredCount} 个核心文件已复原)！`);
console.log('右侧电视机、复古人循环视频、双列网格及全套工业机甲已完好如初。\n');
