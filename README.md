# Zek Card Note Assistant (Obsidian Plugin)

A card-note plugin for Obsidian that lets you quickly create cards from selected text and view a visual dashboard with statistics and domain distribution.

## Features

- Editor context menu to create cards
  - Create 💡 Idea card
  - Create 📖 Literature card
  - Create 🎯 Topic card
  - Uses the current selection as the card content; opens the file if it already exists
- Ribbon icon to open the dashboard
  - Left sidebar icon: `boom-box`, title: `zek-card`
  - Opens the “Dashboard” view in the right sidebar
- Dashboard
  - Stats overview: idea, literature, topic, total cards, unknown, domain count
  - Domain list: see counts per domain
  - Scene tabs: browse cards by type (Literature/Idea/Topic)
  - Refresh button: manually refresh; auto-refresh is also supported
- Auto refresh
  - When files are created/modified/deleted in your vault, the dashboard refreshes automatically (500ms debounce)

## Installation & Setup

1. Install the plugin
   - Option A: Build from source
     - In the plugin folder: `npm install`, then `npm run build`
     - After build, the plugin files (including `main.js` and styles) are copied into the current directory
   - Option B: Place prebuilt files into your vault
     - Copy the plugin folder into `<your-vault>/.obsidian/plugins/obsidian-zek-card-plugin`

2. Enable the plugin
   - Open Obsidian Settings → Community Plugins → enable “Zek Card”

3. Create cards (Editor context menu)
   - Select text in a Markdown file
   - Open the editor context menu and choose:
     - “创建💡闪念卡片” (Create 💡 Idea card)
     - “创建📖文献卡片” (Create 📖 Literature card)
     - “创建🎯观点卡片” (Create 🎯 Topic card)
   - The plugin creates a new card file from the selection; if a file with the same name exists, it opens it

4. Open the Dashboard
   - Click the `zek-card` icon (`boom-box`) in the left sidebar
   - The dashboard shows stats, domain list, and per-type card lists

## File Naming & Frontmatter

- File name prefixes (auto-added based on card type)
  - Idea: `💡idea_...`
  - Literature: `📖literature_...`
  - Topic: `🎯topic_...`
- YAML frontmatter fields
  - `type: card`
  - `scene: idea | literature | topic`
  - `domain: [ ... ]`, `source: [ ... ]` are stored as Obsidian inner links `[[...]]`

## FAQ

- Context menu does not appear?
  - Ensure you are editing a Markdown file (`.md`) and have selected some text
- Dashboard not updating?
  - Click the refresh button on the dashboard, or wait for auto-refresh (file events trigger refresh with debounce)
- Where to place the plugin folder?
  - Put it in `<your-vault>/.obsidian/plugins/obsidian-zek-card-plugin`

## Development & Preview

- Build the plugin: `npm run build`
- Development mode: `npm run dev`
- Web dashboard local preview:
  - Dev server: `npm run dev:web` (default port 3000)
  - Build: `npm run build:web`
  - Note: The web preview is for UI development only and does not affect plugin behavior inside Obsidian

## License

MIT License

