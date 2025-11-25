# Zek 卡片笔记助手（Obsidian 插件）

一个面向 Obsidian 的卡片笔记插件，支持从选中文本一键生成不同类型的卡片，并在侧边栏打开可视化仪表盘查看统计和领域分布。

## 提供的功能

- 编辑器右键菜单创建卡片
  - 创建💡闪念卡片（Idea）
  - 创建📖文献卡片（Literature）
  - 创建🎯观点卡片（Topic）
  - 基于当前选中的文本生成新卡片；若同名文件已存在则直接打开
- 侧边栏 Ribbon 图标打开仪表盘
  - 左侧栏图标：`boom-box`，标题：`zek-card`
  - 点击后在右侧边栏打开“Dashboard”视图
- 仪表盘（Dashboard）
  - 统计概览：闪念、文献、观点、总卡片数、未知卡、领域数量
  - 领域分布列表：查看各领域卡片数量
  - 场景标签切换：按类型浏览卡片列表（文献/闪念/观点）
  - 刷新按钮：手动刷新数据；也支持文件事件自动刷新
- 自动刷新
  - 当库内文件创建/修改/删除时，仪表盘数据自动刷新（防抖 500ms）

## 在 Obsidian 中使用

1. 安装插件
   - 方式 A：从源码构建
     - 在插件目录执行：`npm install`、`npm run build`
     - 构建完成后，插件会复制生成的文件到当前目录（包含 `main.js`、样式等）
   - 方式 B：将打包后的插件文件放入你的库：`<你的库>/.obsidian/plugins/obsidian-zek-card-plugin`

2. 启用插件
   - 打开 Obsidian 设置 → 第三方插件（Community Plugins）→ 找到并启用 “Zek Card” 插件

3. 创建卡片（编辑器右键菜单）
   - 在 Markdown 文件中选中一段文本
   - 打开编辑器右键菜单，选择：
     - “创建💡闪念卡片” 或
     - “创建📖文献卡片” 或
     - “创建🎯观点卡片”
   - 插件会基于所选文本创建新卡片文件；如果同名卡片已存在则直接打开

4. 打开仪表盘（Dashboard）
   - 点击左侧栏的 `zek-card` 图标（`boom-box`）
   - 仪表盘显示统计概览、领域列表和各类型卡片的列表

## 文件命名与内容说明

- 文件名前缀：根据卡片类型自动添加前缀
  - 闪念：`💡idea_...`
  - 文献：`📖literature_...`
  - 观点：`🎯topic_...`
- Frontmatter（YAML 头部）
  - `type: card`
  - `scene: idea | literature | topic`
  - `domain: [ ... ]`、`source: [ ... ]` 等字段以 Obsidian 内部链接格式 `[[...]]` 存储

## 常见问题（FAQ）

- 右键菜单不显示？
  - 请确认当前正在编辑的是 Markdown 文件（扩展名 `.md`），并且有选中文本
- 仪表盘未更新？
  - 可点击仪表盘右上角“刷新”按钮，或等待自动刷新（文件事件触发，防抖 500ms）
- 插件安装目录在哪里？
  - 将插件放入你的库目录下：`<你的库>/.obsidian/plugins/obsidian-zek-card-plugin`

## 开发与预览（可选）

- 插件构建：`npm run build`
- 持续开发：`npm run dev`（开发模式构建与监听）
- Web 仪表盘本地预览：
  - 开发：`npm run dev:web`（默认端口 3000）
  - 构建：`npm run build:web`
  - 说明：Web 预览用于开发 UI，不影响插件在 Obsidian 中的运行

## 许可

MIT License

