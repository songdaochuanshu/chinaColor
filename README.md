# 颜色选择器 - 颜色管理与分类工具

![Vite](https://img.shields.io/badge/Vite-6.0.5-blue)
![Vue](https://img.shields.io/badge/Vue-3.5.13-green)

颜色选择器是一个基于 Vue 3 和 Vite 构建的 Web 应用，用于管理和分类颜色。支持 Hex、RGB、CMYK 格式的颜色复制，并提供颜色分类、候选区域管理等功能。

## 功能特性

- **颜色展示**：显示当前选中颜色的名称、Hex、RGB、CMYK 值。
- **颜色复制**：一键复制 Hex、RGB、CMYK 格式的颜色值。
- **颜色分类**：按颜色类别（如红、绿、蓝等）分类展示颜色。
- **候选区域**：将常用颜色添加到候选区域，支持复制和清空。
- **响应式设计**：适配桌面和移动端设备。

## 在线演示

[点击这里查看在线演示](https://zhongguose.pages.dev/)  

## 技术栈

- **前端框架**：Vue 3
- **构建工具**：Vite
- **样式**：CSS + Flexbox
- **字体**：思源宋体（Source Han Serif CN）
- **动画**：CSS 动画

## 项目结构
/
├── public/ # 静态资源
├── src/
│ ├── assets/ # 图片、字体等资源
│ ├── components/ # Vue 组件
│ ├── App.vue # 根组件
│ └── main.js # 项目入口
├── index.html # 入口 HTML 文件
├── vite.config.js # Vite 配置文件
└── README.md # 项目说明文档


## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/color-picker.git
cd color-picker
```
### 2. 安装依赖

```bash
pnpm install
```

### 3. 运行项目

```bash
pnpm dev
```

### 4. 构建项目

```bash
pnpm build
```

### 5.预览生产环境

```bash
pnpm preview
```
