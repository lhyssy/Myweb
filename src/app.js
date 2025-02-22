import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { configureProductionMiddleware } from './middleware/production.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import tagRoutes from './routes/tagRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB 连接成功'))
    .catch((err) => console.error('MongoDB 连接失败:', err));

// 在生产环境中使用额外的中间件
if (process.env.NODE_ENV === 'production') {
    configureProductionMiddleware(app);
}

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

// 全局错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || '服务器内部错误'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});

export default app; 