# SuperJobGenie Maintenance & Long-Term Memory (v4.0.7+)

## Current Stable State (v4.0.7)
The extension is currently stable with robust ingestion for LinkedIn and Indeed. All critical bugs related to job lead overwriting, non-job text scraping, and incorrect company name formatting have been resolved.

## Maintenance Rules & Anti-Regression ("Little Ghosts" Prevention)

### 1. Ingestion Integrity
- **Unique ID Enforcement**: Never use simple `title::company` strings as keys. Always derive unique IDs (`jk` from Indeed, `currentJobId` from LinkedIn, etc.).
- **Selector Strictness**: When scanning lists, always apply explicit CSS exclusion rules to filter out details panes, description containers, or sidebar content that might masquerade as a job card.
- **Immediate Registration**: Always register a job lead in the `scannedLeadsRegistry` at the exact moment of interaction (click or view), not during a batch export.

### 2. Data Sanitization
- **Company Name Scrubbing**: Always use `cleanCompanyName` to strip metadata (locations, rating stars, "Posted X days ago", etc.). Never trust raw DOM text content.
- **Header/Footer Filtering**: During CSV/Markdown export, explicitly filter out rows that contain non-job header content (e.g., "About X", "Your skills").

### 3. Verification Protocol
- **Post-Change**: After any modification, ensure:
    - [ ] `npm run lint` passes.
    - [ ] Extension manifest version is bumped in `manifest.json`.
    - [ ] LinkedIn job list scan correctly ignores details pane content.
    - [ ] CSV output contains no junk metadata rows.

## Future-Proofing
If performance degrades or new job boards are integrated, prioritize implementing the same unique ID/sanitization patterns established in v4.0.7 before adding new features.

---

## 2026-11-04 · v4.0.9 LinkedIn 页面乱弹彻底修复
- **现象**: 切换职位时页面不断跳动跳转。
- **根因**: `expandAllButtons` 误触发了含 "See more" 或 "See jobs" 的 `<a>` 链接。
- **修复**: 严禁模拟点击任何 `<a>` 标签及链接；对 LinkedIn 仅使用纯 CSS unclamp。

## 2026-11-04 · v4.1.0 Glassdoor 资格弹窗彻底消除 ("Füge deine Qualifikationen")
- **现象**: 用户在 Glassdoor（如德语区 glassdoor.de）浏览职位时，右侧详情刚渲染，页面中央即弹出 "Füge deine Qualifikationen für diesen Job hinzu"（为该职位添加你的资格）的全屏弹窗。
- **根因**: Glassdoor 在详情面板中自带技能匹配组件，当职位资格较多时会有 `data-test="show-more-button"` 或文字 `mehr anzeigen`。插件的 `expandAllButtons` 搜索到该按钮并触发了模拟点击，导致 Glassdoor 弹出资格勾选对话框。
- **修复**:
  1. **零点击禁令 (Zero-Click Prohibition)**：Glassdoor 与 LinkedIn 一样，整个岗位 JD 已经在 DOM 中完整加载，纯依靠注入的 CSS 强力取消截断（`sjg-unclamp-style`），完全禁止在 Glassdoor 和 LinkedIn 触发任何模拟点击。
  2. **严格黑名单过滤**：对其他平台，严格限定点击范围仅在 JD 描述区内，严禁点击任何包含 `qualif`、`skill`、`modal`、`dialog`、`salary`、`review`、`fertig`、`schließen` 的按钮。
  3. **弹窗自消解**：若 Glassdoor 页面触发了该资格弹窗，插件静默自消解。
  4. 版本提升至 `4.1.0`。

## 2026-11-04 · 复古人电视机与 Edge TTS 配音深度武装
- **工作台电视机复古人修复**:
  1. 修复了浏览器中 React `<video muted autoPlay>` DOM 属性未显式注入 `el.muted = true` 导致部分环境偶发静止拦截的问题，添加了 programmatic ref 强制就位与 autoplay promise 护航。
  2. 在求职工作台（`ResumeJobIngestionView`）与首屏控制台（`IndustrialHero`）双重部署复古人 GoldStar CRT 电视监视器组件。
- **Edge TTS 配音矩阵装配**:
  1. 成功录制并合成 Edge TTS 纽约数据工程师 8s 黄金爆款 Hook 音频（原声与带 Cyberpunk BGM 混音版）。
  2. 装配进 `VoiceoverStudioModal` 及 `ShortsStudioModal`，提供一键试听、波形同步及 MP3 下载。
  3. 首屏电视机新增 `EDGE TTS (8S NYC)` / `GEMINI MIX (38S)` 双引擎一键切换。

