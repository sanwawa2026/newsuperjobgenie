# 军师终极设计宪法与长期记忆指南 (Design System Constitution)
> **最高安全级别：永久神圣不可侵犯 (SACROSANCT DESIGN SYSTEM)**
> **适用对象**：所有后续接入的模型 (Gemini, Claude, GPT 等)、子代理 (Sub-agents) 及协作者。
> **违背本宪法的任何修改将被自动化守护工作流 (`npm run verify:design`) 立即阻断并驳回。**

---

## 1. 核心设计灵魂 (The Core Design Philosophy)
本项目前端设计并非平庸、廉价、千篇一律的现代黑白 SaaS 模板，而是由**军师**倾力打造的**顶级工业复古硬件美学 (Dieter Rams × Teenage Engineering 80s Hardware Aesthetic)**：
- **机身底盘 (Industrial Chassis)**：高质感亚光冷灰金属仪器面板 (`#d3d8da`)，配四角 45° 螺丝钉 (`border-[#7a8286]`) 与微金属反光边框。
- **右上角复古显示屏人 (Retro Computer-Head Avatar)**：
  - 必须搭载真实 8.13s 原生 60FPS 循环视频：`/assets/aistudio/___8s_d10be03c.mp4`。
  - 外壳必须为 **GoldStar 显像管彩色监视器 (GoldStar COLOR MONITOR)** 倒角外框。
  - 拥有可切换的 **CRT 扫描线 (Scanlines ON/OFF)**、绿色锁定指示灯 (`#00ff66 LOCK`)、以及高对比度橙色 `FIT: 97%` 状态指示。
- **仪表切换系统 (Dual Console Hardware Toggle)**：
  - **View 1 (CRT AVATAR)**：播放复古显示屏人视频与一键 Gemini 真实语音解说。
  - **View 2 (ROTARY DIAL)**：48 刻度高精工业物理仪表盘，带有阻尼旋转、97 分精密指针及橙色状态点。

---

## 2. 绝对禁止清单 (Absolute Prohibitions / Anti-Patterns)
以下 4 种行为均被列为“毁灭性破坏行为”，后续任何修改一律禁止：

1. ❌ **严禁将用户反馈的录屏/截图当作视频放入电视机！**
   - **历史惨痛教训**：曾有后续模型误将用户上传的网页操作录屏或截图塞入 CRT 屏幕，导致出现荒谬可笑的“网页套网页 (Nested Webpage)”与白底播放按钮。
   - **铁律**：CRT 电视机内的视频源必须且仅能为官方精修无瑕疵的复古人循环视频：`/assets/aistudio/___8s_d10be03c.mp4`。
2. ❌ **严禁采用多帧图片切换模拟飞行动作！**
   - **历史惨痛教训**：拆解图片帧做淡入淡出或交叉飞入，会导致画面剧烈抖动、跳帧、鬼畜 (“复古人飞来飞去，恐怖的要死”)。
   - **铁律**：必须使用原生 `<video src="/assets/aistudio/___8s_d10be03c.mp4" autoPlay loop muted playsInline />`，丝滑 60 帧无缝循环。
3. ❌ **严禁破坏双列网格断点 (`md:grid-cols-12`)！**
   - **历史惨痛教训**：曾有模型将断点设置为 `lg:grid-cols-12`，导致在宽度 800px~1023px 的预览窗口或平板设备上，右侧核心电视机控制台直接被挤到屏幕下方折叠区，“右侧网页不见了”。
   - **铁律**：主容器必须锁定为 `md:grid-cols-12`（左侧文案 `md:col-span-7`，右侧复古机箱 `md:col-span-5`），在所有大于 768px 的屏幕上一律严丝合缝并排展示！
4. ❌ **严禁退化为平庸黑色卡片 (Zero AI Slop / Anti-Black-Box)**：
   - 严禁将亚光灰底盘 (`#d3d8da`) 改为 `bg-slate-900` / `bg-black` 或千篇一律的玻璃拟态黑框。工业硬件物理质感是本站最高识别标志。

---

## 3. 自动化防护工作流与急救命令 (Automated Guardrails & Workflows)

### 3.1 完整性校验工作流 (Design Integrity Verification)
在任何代码变动或打包构建前，均需执行：
```bash
npm run verify:design
```
该脚本将严格检验：
- `src/components/IndustrialHero.tsx` 存在且未丢失。
- 视频标签是否正确绑定 `/assets/aistudio/___8s_d10be03c.mp4`。
- 网格是否维持 `md:grid-cols-12` 与 `md:col-span-5`。
- GoldStar 标志、48 刻度物理旋钮、亚光灰仪器盘样式是否完整。
- 静态资产文件是否存在且无损。

### 3.2 一键恢复黄金版本 (Emergency Golden Restore)
若有未知操作打乱了设计，只需在终端运行一条指令：
```bash
npm run restore:golden
```
即可瞬间从只读保全目录 `/.golden_v1` 中还原完整神级设计，秒级复原！

---

## 4. 文件映射索引 (Sacred File Index)
- **主舞台核心组件**：`/src/components/IndustrialHero.tsx`
- **复古人高清视频资产**：`/public/assets/aistudio/___8s_d10be03c.mp4`
- **独立离线打包脚本**：`/scripts/build_cool_showcase.js`
- **黄金版本保全镜像**：`/.golden_v1/`
- **完整性检测脚本**：`/scripts/verify_design_integrity.js`
- **黄金版本还原脚本**：`/scripts/restore_golden.js`
- **设计宪法备忘录**：`/.aistudio/artifacts/brain/ec60091c-33cc-4591-b5f9-fbcdb5b064ff/retro_hardware_design_constitution.md`
