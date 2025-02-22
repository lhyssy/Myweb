import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import githubRoutes from './routes/githubRoutes.js';

dotenv.config();

const app = express();

// 基础中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(compression());

// 安全中间件
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
})
.then(() => console.log('MongoDB 连接成功'))
.catch((err) => console.error('MongoDB 连接失败:', err.message));

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

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/github', githubRoutes);

// 健康检查路由
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: '请求的资源不存在',
        path: req.originalUrl
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('错误:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.originalUrl,
        method: req.method
    });

    // 处理MongoDB错误
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        return res.status(500).json({
            status: 'error',
            message: '数据库操作失败'
        });
    }

    // 处理验证错误
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: '数据验证失败',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // 处理JWT错误
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: '无效的认证令牌'
        });
    }

    res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
            ? '服务器内部错误' 
            : err.message
    });
});

export default app; 