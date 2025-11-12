# 📋 Kanban Board

An interactive Kanban board for managing tasks and workflows (e.g., job applications), fully supporting **RTL layout**, **dark mode**, **drag-and-drop**, and **Excel import/export**.  
Built with **React 19+**, **TypeScript**, and **Vite**, using **`@dnd-kit`** for drag-and-drop and **`xlsx`** for Excel operations.

---

## ✨ Features

- **Create / Edit / Delete Columns** (e.g., "Under Review", "Accepted", "Rejected")
- **Add / Edit / Delete Cards** within columns
- **Per-column search** (accessible via the `⋮` menu)
- **Drag-and-drop** to reorder cards within a column or move them between columns
- **Export any column to Excel** (`.xlsx`) with Arabic field support (`Title`, `Description`)
- **Import tasks from Excel** (supports bilingual headers: `title`/`العنوان`, `content`/`الوصف`)
- **Dark/Light mode** (saved in `localStorage`)
- **Full RTL & Arabic language support**
- **Type-safe** with TypeScript and ESLint type-aware linting

---

## 🚀 Local Development

### Prerequisites
- Node.js ≥ 18.x
- npm, yarn, or pnpm

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/MahmoudWebApp/kanban-board.git
   cd kanban-board

npm install
# or
yarn install
# or
pnpm install