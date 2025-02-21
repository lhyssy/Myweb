export async function parseCSDN(url) {
    try {
        // 由于CSDN的限制，我们需要使用后端代理来获取文章内容
        const response = await fetch('/api/proxy/csdn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error('获取CSDN文章失败');
        }

        const data = await response.json();

        // 计算阅读时间
        const wordCount = data.content.length;
        const readTime = Math.ceil(wordCount / 500) + ' min'; // 假设阅读速度为500字/分钟

        return {
            title: data.title,
            date: data.publishTime || new Date().toISOString(),
            summary: data.summary || data.content.substring(0, 200) + '...',
            content: data.content,
            tags: data.tags || ['CSDN', '技术'],
            url: url,
            readTime: readTime,
            author: data.author,
            platform: 'CSDN',
            stats: {
                views: parseInt(data.views) || 0,
                likes: parseInt(data.likes) || 0,
                collections: parseInt(data.collections) || 0
            }
        };
    } catch (error) {
        console.error('解析CSDN文章失败:', error);
        throw error;
    }
} 