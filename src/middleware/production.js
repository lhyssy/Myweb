import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

export const configureProductionMiddleware = (app) => {
    // 启用 GZIP 压缩
    app.use(compression());

    // 设置安全相关的 HTTP 头
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
                imgSrc: ["'self'", 'data:', 'https:', 'http:'],
                connectSrc: ["'self'", 'https:', 'http:'],
                fontSrc: ["'self'", 'https:', 'data:'],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'self'"]
            }
        },
        crossOriginEmbedderPolicy: false
    }));

    // 配置 CORS
    app.use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // 生产环境错误处理
    app.use((err, req, res, next) => {
        console.error('生产环境错误:', err.stack);
        res.status(500).json({
            status: 'error',
            message: '服务器内部错误'
        });
    });
}; 