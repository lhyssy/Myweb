import fetch from 'node-fetch';
import cheerio from 'cheerio';

export const proxyCSDN = async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url || !url.includes('blog.csdn.net')) {
            return res.status(400).json({ message: '无效的CSDN文章链接' });
        }

        // 发送请求获取文章页面
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Referer': 'https://blog.csdn.net/',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // 更新选择器以匹配CSDN最新的DOM结构
        const article = {
            title: $('h1.title-article').text().trim(),
            author: $('.profile-intro-name-boxTop a.username').text().trim(),
            publishTime: $('.time').text().trim() || new Date().toISOString(),
            content: $('#article_content').html() || $('.article_content').html(),
            tags: $('.tags-box .tag-link').map((_, el) => $(el).text().trim()).get(),
            views: $('.read-count').text().replace(/[^0-9]/g, '') || '0',
            likes: $('.tool-item-vote .count').text().trim() || '0',
            collections: $('.tool-item-collect .count').text().trim() || '0'
        };

        // 如果没有找到标签，尝试其他可能的标签选择器
        if (article.tags.length === 0) {
            article.tags = $('.artic-tag-box .tag-link').map((_, el) => $(el).text().trim()).get();
        }

        // 确保至少有一个标签
        if (article.tags.length === 0) {
            article.tags = ['CSDN', '技术'];
        }

        // 清理HTML内容并生成摘要
        const textContent = article.content ? $(article.content).text().trim() : '';
        article.content = textContent;
        article.summary = textContent.substring(0, 200).trim() + '...';

        // 验证必要字段
        if (!article.title || !article.content) {
            throw new Error('无法解析文章内容');
        }

        res.json(article);
    } catch (error) {
        console.error('CSDN代理错误:', error);
        res.status(500).json({ 
            message: '获取CSDN文章失败',
            error: error.message 
        });
    }
}; 