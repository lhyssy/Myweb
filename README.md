# 个人网站

## 项目介绍
这是一个使用 Node.js、Express 和 MongoDB 构建的个人网站，支持博客文章管理和项目展示功能。

## 功能特点
- 响应式设计
- 博客文章导入和管理
- 项目展示
- 暗色/亮色主题切换
- 文章搜索功能

## 技术栈
- 前端：HTML5, CSS3, JavaScript
- 后端：Node.js, Express
- 数据库：MongoDB
- 部署：Vercel

## 本地开发
1. 克隆项目
```bash
git clone <your-repo-url>
cd personal-website
```

2. 安装依赖
```bash
npm install
```

3. 创建环境变量文件
创建 `.env` 文件并添加以下内容：
```
MONGODB_URI=your_mongodb_uri
PORT=3000
```

4. 启动开发服务器
```bash
npm run dev
```

## 部署指南
1. 在 GitHub 上创建仓库并推送代码
2. 在 Vercel 上导入项目
3. 配置环境变量
4. 部署完成

## 项目结构
```
├── public/          # 静态文件
├── src/             # 后端源码
│   ├── config/      # 配置文件
│   ├── controllers/ # 控制器
│   ├── models/      # 数据模型
│   ├── routes/      # 路由
│   └── app.js       # 应用入口
├── js/              # 前端 JavaScript
├── .env             # 环境变量
├── .gitignore       # Git 忽略文件
├── package.json     # 项目配置
└── vercel.json      # Vercel 配置
``` 