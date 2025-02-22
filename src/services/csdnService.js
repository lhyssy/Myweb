import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

class CSDNService {
    async parseArticle(url) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Referer': 'https://blog.csdn.net/'
                }
            });

            if (!response.ok) {
                throw new Error('无法获取CSDN文章');
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            // 提取文章信息
            const title = $('h1.title-article').text().trim();
            const content = $('#article_content').html();
            const author = $('.follow-nickName').text().trim() || $('.user-name').text().trim();
            const publishTime = $('.time').text().trim() || $('.date-box').text().trim();
            const tags = $('.tag-link')
                .map((_, el) => $(el).text().trim())
                .get()
                .filter(tag => tag.length > 0);
            
            // 提取统计信息
            const views = $('.read-count').text().replace(/[^0-9]/g, '') || '0';
            const likes = $('.tool-item-vote .count').text().trim() || '0';
            const collections = $('.tool-item-collect .count').text().trim() || '0';

            // 生成摘要
            const plainText = $(content).text().trim();
            const summary = plainText.substring(0, 200) + '...';

            // 计算阅读时间（假设平均阅读速度为300字/分钟）
            const wordCount = plainText.length;
            const readTime = Math.max(1, Math.ceil(wordCount / 300));

            return {
                title,
                content,
                summary,
                author,
                publishTime: new Date(publishTime),
                tags: tags.length > 0 ? tags : ['CSDN', '技术'],
                url,
                readTime: `${readTime} min`,
                platform: 'CSDN',
                stats: {
                    views: parseInt(views) || 0,
                    likes: parseInt(likes) || 0,
                    collections: parseInt(collections) || 0
                }
            };
        } catch (error) {
            console.error('解析CSDN文章失败:', error);
            throw new Error('解析CSDN文章失败');
        }
    }
}

export default new CSDNService(); 