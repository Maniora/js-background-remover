# ⚡ JavaScript AI Background Remover (100% Free & Local)

[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local%20%26%20Offline-success.svg)](#)
[![No API Keys](https://img.shields.io/badge/API%20Keys-None%20Required-orange.svg)](#)

> **No Subscriptions. No Paid APIs. No Cloud Uploads.**  
> Remove image backgrounds locally on your own computer with **JavaScript**, **ONNX Machine Learning**, and **WebAssembly**.

---

## 🌟 Why This Project?

Most background removal services (Canva Pro, remove.bg) charge monthly subscriptions or expensive per-image API credits. Furthermore, uploading sensitive user or client photos to third-party servers poses privacy risks.

This project runs **100% offline inside your machine**:
- **Zero API Keys & Zero Costs**: Completely free and open-source.
- **Privacy-First**: No images ever leave your laptop or server.
- **Smart Edge Defringer**: Custom algorithm that eliminates the dreaded white/gray "halo" border around hair and shoulders.
- **Interactive Web App**: Built-in split comparison slider (Before vs After) with instant drag-and-drop.
- **Node.js CLI**: Scriptable backend mode for automation and bulk workflows.

---

## 🖥️ Live Web Interface Preview

The included web app provides:
- **Interactive Before/After Slider**: Inspect cutout accuracy in real time.
- **Edge Clean Controls**: Choose between `Crisp (No White Halo)`, `Tight Trim`, or `Soft Feather`.
- **Background Switcher**: Test your cutout against Dark Checkerboard, Pure White, Solid Black, or Green Screen.
- **Instant Download**: One-click download of transparent `.png` cutouts.

---

## 📋 Prerequisites

Before starting, ensure you have **Node.js** installed on your machine:
- **Node.js** `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm** (comes bundled with Node.js)

To verify your installation:
```bash
node -v
npm -v
```

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/Maniora/js-background-remover.git
cd js-background-remover
```

### Step 2: Install Dependencies
Install the required packages (`@imgly/background-removal-node` and `sharp`):
```bash
npm install
```

> **Note**: On the very first run, the local ONNX machine learning model weights (~40MB) will download and cache automatically. Subsequent runs are **100% offline** and take just ~1 to 2 seconds.

---

### Step 3: Run the Project

You can run the project in **two modes**:

#### Option A: Web App with Interactive Slider (Recommended)
Launch the local web server:
```bash
npm run serve
```
Open your browser and navigate to:
```
http://localhost:3000
```
- Drag and drop any image or click **Upload Photo**.
- Drag the slider to inspect the cutout quality.
- Click **Download Cutout** to save your transparent PNG!

---

#### Option B: Command Line (CLI Mode)
Place any image named `input.jpg` into the project root directory, then run:
```bash
npm start
```
The clean cutout will be processed and saved as `output.png`!

---

## 📁 Project Structure

```text
js-background-remover/
├── index.html        # Interactive Before/After Web App UI
├── server.js         # Local HTTP server & background removal API
├── cleaner.js        # Smart Edge Defringer (eliminates white halos)
├── index.js          # CLI script for direct image processing
├── input.jpg         # Sample original image
├── output.png        # Generated transparent PNG cutout
├── package.json      # Dependencies and execution scripts
├── .gitignore        # Git ignore rules for node_modules
└── README.md         # Documentation and setup instructions
```

---

## ⚙️ How Edge Cleaning Works (`cleaner.js`)

When removing bright backgrounds (such as studio white), boundary pixels around hair and shoulders often retain semi-transparent white color contamination (`rgb(255, 255, 255)` at 20-40% alpha). When placed over dark surfaces, this creates an ugly white "halo".

Our `cleaner.js` engine fixes this automatically:
1. **Alpha Thresholding**: Trims faint, contaminated outer haze below the threshold.
2. **Contrast Normalization**: Sharpened S-curve for crisp, natural hair contours.
3. **Color Defringing**: Neutralizes background bleed on edge pixels while preserving subject colors.

---

## ❓ Frequently Asked Questions (FAQ)

<details>
<summary><b>1. Can I use this in production or commercial apps?</b></summary>
Yes! The packages used are open-source. You can embed this into Node.js backend services, Electron desktop tools, or web applications with zero per-image API costs.
</details>

<details>
<summary><b>2. Does it work on Windows, macOS, and Linux?</b></summary>
Yes. The codebase uses standard cross-platform paths (`pathToFileURL`) and WebAssembly/ONNX runtimes that work seamlessly across all major operating systems.
</details>

<details>
<summary><b>3. Why did my first execution take a few seconds?</b></summary>
During the initial execution, the model weights (~40MB) are downloaded and cached locally on disk. All future executions run directly from your local cache offline.
</details>

---

## 🤝 Community & Support

Created with ❤️ by **[TechTalksByMani](https://instagram.com/techtalksbymani)**.

- **Instagram**: [@techtalksbymani](https://instagram.com/techtalksbymani)
- Follow for daily developer tutorials, system design breakdowns, and open-source projects!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
