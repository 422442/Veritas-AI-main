import { extract } from '@extractus/article-extractor';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import axios from 'axios';

export interface Article {
  title: string;
  content: string;
  author?: string;
  publishDate?: string;
  source?: string;
  success: boolean;
  method: string;
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Method 1: Jina AI Reader (fastest, cleanest)
async function extractWithJina(url: string): Promise<Article> {
  if (!process.env.JINA_AI_API_KEY) {
    throw new Error('Jina AI key not configured');
  }

  try {
    const response = await axios.get(`https://r.jina.ai/${url}`, {
      headers: {
        'Authorization': `Bearer ${process.env.JINA_AI_API_KEY}`,
        'X-Return-Format': 'markdown',
        'Accept': 'text/plain'
      },
      timeout: 15000
    });

    if (response.data && response.data.length > 200) {
      const title = extractTitleFromMarkdown(response.data);
      return {
        title,
        content: response.data,
        success: true,
        method: 'jina'
      };
    }

    throw new Error('Insufficient content returned');
  } catch (error) {
    throw new Error(`Jina extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Method 2: Firecrawl (good for paywalls and JavaScript-heavy sites)
async function extractWithFirecrawl(url: string): Promise<Article> {
  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error('Firecrawl key not configured');
  }

  try {
    const response = await axios.post(
      'https://api.firecrawl.dev/v0/scrape',
      { 
        url,
        formats: ['markdown', 'html']
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    if (response.data?.data?.markdown && response.data.data.markdown.length > 200) {
      return {
        title: response.data.data.metadata?.title || extractTitleFromMarkdown(response.data.data.markdown),
        content: response.data.data.markdown,
        author: response.data.data.metadata?.author,
        publishDate: response.data.data.metadata?.publishedTime,
        source: response.data.data.metadata?.sourceURL,
        success: true,
        method: 'firecrawl'
      };
    }

    throw new Error('Insufficient content returned');
  } catch (error) {
    throw new Error(`Firecrawl extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Method 3: Article Extractor (fast, offline, works for most sites)
async function extractWithArticleExtractor(url: string): Promise<Article> {
  try {
    const article = await extract(url);

    if (article && article.content && article.content.length > 200) {
      return {
        title: article.title || 'Untitled Article',
        content: article.content,
        author: article.author,
        publishDate: article.published,
        source: article.source,
        success: true,
        method: 'article-extractor'
      };
    }

    throw new Error('Insufficient content extracted');
  } catch (error) {
    throw new Error(`Article extractor failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Method 4: Cheerio + Readability (reliable fallback)
async function extractWithReadability(url: string): Promise<Article> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 15000,
      maxRedirects: 5
    });

    const dom = new JSDOM(response.data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (article && article.textContent && article.textContent.length > 200) {
      return {
        title: article.title || 'Untitled Article',
        content: article.textContent,
        success: true,
        method: 'readability'
      };
    }

    throw new Error('Failed to parse article');
  } catch (error) {
    throw new Error(`Readability extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to extract title from markdown
function extractTitleFromMarkdown(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Article';
}

// Main extraction function with automatic fallback chain
export async function extractArticle(url: string): Promise<Article> {
  // Validate URL
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format. Please provide a valid HTTP or HTTPS URL.');
  }

  const methods = [
    { name: 'Jina AI Reader', fn: extractWithJina },
    { name: 'Firecrawl', fn: extractWithFirecrawl },
    { name: 'Article Extractor', fn: extractWithArticleExtractor },
    { name: 'Readability', fn: extractWithReadability }
  ];

  const errors: string[] = [];

  for (const method of methods) {
    try {
      console.log(`[Extractor] Trying: ${method.name}`);
      const result = await method.fn(url);
      
      if (result.success && result.content.length > 200) {
        console.log(`[Extractor] ✓ Success with ${method.name} (${result.content.length} chars)`);
        return result;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${method.name}: ${errorMsg}`);
      console.warn(`[Extractor] ✗ ${method.name} failed:`, errorMsg);
      continue;
    }
  }

  throw new Error(
    `All extraction methods failed. Please check the URL and try again.\n\n` +
    `Attempted methods:\n${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`
  );
}

// Export for testing individual methods
export const extractors = {
  jina: extractWithJina,
  firecrawl: extractWithFirecrawl,
  articleExtractor: extractWithArticleExtractor,
  readability: extractWithReadability
};
