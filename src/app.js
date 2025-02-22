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
import githubRoutes from './routes/githubRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

dotenv.config();

const app = express();

// 安全中间件
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// 速率限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// 基础中间件
app.use(morgan('dev'));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true
})
.then(() => console.log('MongoDB 连接成功'))
.catch((err) => {
    console.error('MongoDB 连接失败:', {
        message: err.message,
        stack: err.stack,
        code: err.code
    });
    // 在生产环境中，我们不希望服务器因为数据库连接失败而完全停止
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});

// 监听数据库连接事件
mongoose.connection.on('error', err => {
    console.error('MongoDB 连接错误:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB 连接断开，尝试重新连接...');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB 重新连接成功');
});

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
app.use('/api/github', githubRoutes);

// 处理静态文件
app.use(express.static('public'));

// 404 处理
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            status: 'error',
            message: '请求的API端点不存在'
        });
    }
    // 对于前端路由，返回index.html
    res.sendFile('index.html', { root: 'public' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    // 详细的错误日志
    console.error('错误详情:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        headers: req.headers
    });
    
    const statusCode = err.statusCode || 500;
    const message = err.message || '服务器内部错误';
    
    // 根据环境返回不同级别的错误信息
    const errorResponse = {
        status: 'error',
        message,
        code: err.code || 'INTERNAL_SERVER_ERROR'
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.details = err.details || {};
    }

    res.status(statusCode).json(errorResponse);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});

export default app; 