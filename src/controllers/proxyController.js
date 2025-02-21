import fetch from 'node-fetch';
import cheerio from 'cheerio';

export const proxyCSDN = async (req, res) => {
    try {
        const { url } = req.body;
        
        // 发送请求获取文章页面
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // 解析文章内容
        const article = {
            title: $('#articleContentId').text().trim(),
            author: $('.follow-nickName').text().trim(),
            publishTime: $('.time').text().trim(),
            content: $('#article_content').text().trim(),
            tags: $('.tag-link').map((_, el) => $(el).text().trim()).get(),
            views: $('.read-count').text().replace(/[^0-9]/g, ''),
            likes: $('.tool-item-vote .count').text().trim(),
            collections: $('.tool-item-collect .count').text().trim()
        };
        
        // 生成摘要
        article.summary = article.content.substring(0, 200) + '...';
        
        res.json(article);
    } catch (error) {
        console.error('CSDN代理错误:', error);
        res.status(500).json({ message: '获取CSDN文章失败' });
    }
}; 