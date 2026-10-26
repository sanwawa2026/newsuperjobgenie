import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('\n🛡️  [军师防御系统] 启动工业硬件设计与复古电视机完整性校验 (Design Integrity Check)...');

const CHECKS = [
  {
    name: '核心舞台组件 IndustrialHero.tsx 存在',
    run: () => fs.existsSync(path.join(ROOT, 'src/components/IndustrialHero.tsx'))
  },
  {
    name: '复古显示屏人 8s 循环视频 (___8s_d10be03c.mp4) 存在于 public',
    run: () => {
      const p = path.join(ROOT, 'public/assets/aistudio/___8s_d10be03c.mp4');
      return fs.existsSync(p) && fs.statSync(p).size > 100000;
    }
  },
  {
    name: 'IndustrialHero.tsx 正确引用原生 8s 循环视频',
    run: () => {
      const content = fs.readFileSync(path.join(ROOT, 'src/components/IndustrialHero.tsx'), 'utf-8');
      return content.includes('/assets/aistudio/___8s_d10be03c.mp4');
    }
  },
  {
    name: '主容器锁定 md:grid-cols-12 (防止右侧电视与控制台下坠丢失)',
    run: () => {
      const content = fs.readFileSync(path.join(ROOT, 'src/components/IndustrialHero.tsx'), 'utf-8');
      return content.includes('md:grid-cols-12') && content.includes('md:col-span-7') && content.includes('md:col-span-5');
    }
  },
  {
    name: '禁止载入录屏/截图 (绝不允许网页套网页)',
    run: () => {
      const content = fs.readFileSync(path.join(ROOT, 'src/components/IndustrialHero.tsx'), 'utf-8');
      const badPatterns = ['1024_b2e6a274.mp4', 'image_da002281.png', 'image_8272a58e.png'];
      return !badPatterns.some(bp => content.includes(bp));
    }
  },
  {
    name: 'GoldStar 显像管彩色监视器与扫描线 (Scanlines) 开关保留',
    run: () => {
      const content = fs.readFileSync(path.join(ROOT, 'src/components/IndustrialHero.tsx'), 'utf-8');
      return content.includes('GoldStar') && content.includes('SCANLINES');
    }
  },
  {
    name: '48 刻度工业物理旋钮 (48-tick Rotary Dial) 逻辑完好',
    run: () => {
      const content = fs.readFileSync(path.join(ROOT, 'src/components/IndustrialHero.tsx'), 'utf-8');
      return content.includes('length: 49') && content.includes('needleRotation');
    }
  },
  {
    name: '黄金版本保全镜像 (.golden_v1) 处于待命状态',
    run: () => {
      return fs.existsSync(path.join(ROOT, '.golden_v1/src/components/IndustrialHero.tsx')) &&
             fs.existsSync(path.join(ROOT, '.golden_v1/public/assets/aistudio/___8s_d10be03c.mp4'));
    }
  }
];

let hasError = false;
CHECKS.forEach((check, i) => {
  try {
    const passed = check.run();
    if (passed) {
      console.log(`  ✓ [${i + 1}/${CHECKS.length}] 坚固: ${check.name}`);
    } else {
      console.error(`  ❌ [${i + 1}/${CHECKS.length}] 破坏告警: ${check.name}`);
      hasError = true;
    }
  } catch (err) {
    console.error(`  ❌ [${i + 1}/${CHECKS.length}] 异常: ${check.name} - ${err.message}`);
    hasError = true;
  }
});

if (hasError) {
  console.error('\n🚨 [严重警告] 监测到军师的高级设计遭恶意篡改或损坏！');
  console.error('👉 请立即执行紧急恢复指令：npm run restore:golden');
  process.exit(1);
} else {
  console.log('\n✨ [坚不可摧] 军师顶级设计系统与防御网全部在位，小鬼退散，万无一失！\n');
  process.exit(0);
}
