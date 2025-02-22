import app from './app.js';

const PORT = process.env.PORT || 3000;
let server;

// 优雅关闭函数
const gracefulShutdown = () => {
    console.log('开始优雅关闭...');
    if (server) {
        server.close((err) => {
            if (err) {
                console.error('关闭服务器时发生错误:', err);
                process.exit(1);
            }
            console.log('服务器已关闭');
            process.exit(0);
        });

        // 设置超时强制关闭
        setTimeout(() => {
            console.error('强制关闭服务器');
            process.exit(1);
        }, 30000);
    }
};

// 错误处理
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
    gracefulShutdown();
});

process.on('unhandledRejection', (err) => {
    console.error('未处理的Promise拒绝:', err);
    gracefulShutdown();
});

// 启动服务器
try {
    server = app.listen(PORT, () => {
        console.log(`服务器运行在端口 ${PORT}`);
        console.log('环境:', process.env.NODE_ENV);
    });

    // 处理服务器错误
    server.on('error', (err) => {
        console.error('服务器错误:', err);
        gracefulShutdown();
    });
} catch (err) {
    console.error('启动服务器时发生错误:', err);
    process.exit(1);
}

// 监听终止信号
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default server; 