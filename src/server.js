import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，准备关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('未处理的Promise拒绝:', err);
    process.exit(1);
}); 