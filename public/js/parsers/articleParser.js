import { parseCSDN } from './platforms/csdn.js';
import { parseGitHub } from './platforms/github.js';
import { parseJuejin } from './platforms/juejin.js';
import { parseZhihu } from './platforms/zhihu.js';

export async function parseArticle(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        // 根据域名选择对应的解析器
        if (hostname.includes('blog.csdn.net')) {
            return await parseCSDN(url);
        } else if (hostname.includes('github.com')) {
            return await parseGitHub(url);
        } else if (hostname.includes('juejin.cn')) {
            return await parseJuejin(url);
        } else if (hostname.includes('zhihu.com')) {
            return await parseZhihu(url);
        }

        // 如果是其他平台，返回基本结构
        return {
            title: '新文章',
            date: new Date().toISOString(),
            summary: '这是一篇来自未知平台的文章',
            content: '文章内容待解析',
            tags: ['未分类'],
            url: url,
            readTime: '5 min',
            author: '未知作者',
            platform: 'Other',
            stats: {
                views: 0,
                likes: 0,
                collections: 0
            }
        };
    } catch (error) {
        console.error('解析文章失败:', error);
        return null;
    }
} 