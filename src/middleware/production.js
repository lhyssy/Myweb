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
                imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
                connectSrc: ["'self'", 'https://api.github.com', process.env.API_URL],
                fontSrc: ["'self'", 'https:', 'data:'],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'", 'https:'],
                frameSrc: ["'none'"]
            }
        },
        crossOriginEmbedderPolicy: false
    }));

    // 配置 CORS
    app.use(cors({
        origin: process.env.CORS_ORIGIN || process.env.API_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // 添加安全响应头
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });

    // 生产环境错误处理
    app.use((err, req, res, next) => {
        console.error('生产环境错误:', err);
        res.status(500).json({
            status: 'error',
            message: '服务器内部错误'
        });
    });
}; 