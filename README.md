# Vyom Prompt Library

A high-performance, visually striking prompt library built with a **Technical Brutalist** aesthetic. Designed for AI engineers and prompt enthusiasts who demand speed, density, and a professional edge.

## 🚀 Features

- **Brutalist UI**: Bold "Signal Yellow" and "Matte Black" theme with strict 0px border-radius.
- **High Density Feed**: Quickly scan through thousands of prompts with optimized layouts.
- **Smart Filtering**: Real-time search and category filtering.
- **Copy-to-Clipboard**: One-click prompt copying.
- **Image Lightbox**: Detailed view of AI-generated results for each prompt.
- **Geist Typography**: Modern, readable font optimized for technical content.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev)
- **Fonts**: Geist Sans & Mono

## 🏃 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Project Structure

- `src/app`: Next.js App Router and page layouts.
- `src/components`: Reusable UI components (Sidebar, PromptCard, PromptModal).
- `src/data`: JSON indices for prompt data.
- `public/`: Static assets and icons.

## 📊 Data & Credits

The prompt data in this library is sourced from the [Awesome-Nano-Banana-Pro-Prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts) repository by **YouMind-OpenLab**.

This data is used under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license. 
- **Changes made**: The raw data was transformed into a structured JSON format, categories were inferred based on metadata and content, and a custom glassmorphic UI was developed for an enhanced browsing experience.

## 📄 License

- **Software Code**: [MIT License](https://opensource.org/licenses/MIT) - Copyright (c) 2024 Vyom.
- **Prompt Data**: Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (Attribution 4.0 International).
