import { useQuery } from '@tanstack/react-query';
import { fetchBlogArticles, fetchArticleByHandle, ShopifyArticle } from '@/lib/shopify';

export interface BlogPost {
  id: string;
  slug: string;
  blogHandle: string;
  date: string;
  title: string;
  image: string;
  category: string;
  excerpt: string;
  readTime: string;
  content: string;
  contentHtml: string;
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function articleToBlogPost(article: ShopifyArticle): BlogPost {
  return {
    id: article.id,
    slug: `${article.blog.handle}/${article.handle}`,
    blogHandle: article.blog.handle,
    date: formatDate(article.publishedAt),
    title: article.title,
    image: article.image?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80',
    category: article.tags?.[0] || 'Blog',
    excerpt: article.excerpt || article.content.substring(0, 160) + '...',
    readTime: estimateReadTime(article.content),
    content: article.content,
    contentHtml: article.contentHtml,
  };
}

export function useBlogArticles(count: number = 20) {
  return useQuery({
    queryKey: ['blog-articles', count],
    queryFn: () => fetchBlogArticles(count),
    select: (articles) => articles.map(articleToBlogPost),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogArticle(blogHandle: string, articleHandle: string) {
  return useQuery({
    queryKey: ['blog-article', blogHandle, articleHandle],
    queryFn: () => fetchArticleByHandle(blogHandle, articleHandle),
    select: (article) => (article ? articleToBlogPost(article) : null),
    enabled: !!blogHandle && !!articleHandle,
    staleTime: 5 * 60 * 1000,
  });
}
