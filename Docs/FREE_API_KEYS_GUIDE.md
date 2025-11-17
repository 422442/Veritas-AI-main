# 🔑 FREE API KEYS SETUP GUIDE

## Complete list of free services and how to get API keys

---

## 1️⃣ Google Gemini AI ⭐ **REQUIRED**

**Free Tier**: 1M tokens/day, 15 requests/min, 1500 requests/day

### Steps:
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Add to `.env.local`:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```

**Cost**: $0 (Free tier is generous)

---

## 2️⃣ Jina AI Reader ⭐ **HIGHLY RECOMMENDED**

**Free Tier**: 200 requests/day

### Steps:
1. Visit: https://jina.ai/reader
2. Sign up with GitHub or Google
3. Go to Dashboard
4. Click "API Keys"
5. Create new API key
6. Copy the key
7. Add to `.env.local`:
   ```
   JINA_AI_API_KEY=your_key_here
   ```

**Cost**: $0 for 200 requests/day

**Alternative**: Can use without API key (limited to 20/day)

---

## 3️⃣ Firecrawl 🔥 **RECOMMENDED**

**Free Tier**: 500 credits/month (1 credit = 1 page scrape)

### Steps:
1. Visit: https://firecrawl.dev
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Copy your API key
5. Add to `.env.local`:
   ```
   FIRECRAWL_API_KEY=fc-your_key_here
   ```

**Cost**: $0 for 500 pages/month

---

## 3️⃣.1 Brave Search API 🔍 **HIGHLY RECOMMENDED FOR WEB SEARCH**

**Free Tier**: 2,000 queries/month (completely free!)

### Steps:
1. Visit: https://brave.com/search/api/
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Create new API key
5. Add to `.env.local`:
   ```
   BRAVE_SEARCH_API_KEY=your_brave_key_here
   ```

**Features**:
- Web search results
- News search
- No Google/Bing dependency
- Privacy-focused
- Fast response times

**Cost**: $0 for 2,000 queries/month (perfect for fact-checking!)

---

## 3️⃣.2 Tavily AI Search API 🤖 **BEST FOR AI-POWERED SEARCH**

**Free Tier**: 1,000 requests/month

### Steps:
1. Visit: https://tavily.com
2. Sign up for free
3. Get API key from dashboard
4. Add to `.env.local`:
   ```
   TAVILY_API_KEY=tvly-your_key_here
   ```

**Features**:
- AI-optimized search results
- Summarized content
- Source extraction
- Perfect for fact-checking
- Real-time web data

**Cost**: $0 for 1,000 searches/month

---

## 3️⃣.3 SerpAPI (Google Search) 🌐 **OPTIONAL**

**Free Tier**: 100 searches/month

### Steps:
1. Visit: https://serpapi.com
2. Sign up for free account
3. Get API key
4. Add to `.env.local`:
   ```
   SERPAPI_KEY=your_serpapi_key_here
   ```

**Cost**: $0 for 100 searches/month

---

## 4️⃣ Google Fact Check Tools API 📊 **OPTIONAL**

**Free Tier**: No documented limit

### Steps:
1. Visit: https://console.cloud.google.com/
2. Create new project or select existing
3. Enable "Fact Check Tools API"
4. Go to Credentials → Create Credentials → API Key
5. Restrict key to Fact Check Tools API only
6. Copy the key
7. Add to `.env.local`:
   ```
   GOOGLE_FACT_CHECK_API_KEY=your_key_here
   ```

**Cost**: $0 (completely free)

---

## 5️⃣ ClaimBuster API 🔍 **OPTIONAL**

**Free Tier**: 1000 requests/month

### Steps:
1. Visit: https://idir.uta.edu/claimbuster/api/
2. Fill out request form
3. Wait for email with API key (usually 24-48 hours)
4. Add to `.env.local`:
   ```
   CLAIMBUSTER_API_KEY=your_key_here
   ```

**Cost**: $0 for research/non-commercial

---

## 6️⃣ Full Fact API ✅ **OPTIONAL**

**Free Tier**: For non-commercial use

### Steps:
1. Visit: https://fullfact.org/about/automated/
2. Contact them for API access: automated@fullfact.org
3. Explain your use case (news verification tool)
4. Wait for API key
5. Add to `.env.local`:
   ```
   FULLFACT_API_KEY=your_key_here
   ```

**Cost**: $0 for non-commercial

---

## 7️⃣ Vercel (Hosting) 🚀 **REQUIRED**

**Free Tier**: 
- 100GB bandwidth/month
- 100 deployments/day
- Unlimited projects

### Steps:
1. Visit: https://vercel.com
2. Sign up with GitHub
3. Connect your repository
4. Deploy automatically
5. Add environment variables in Vercel dashboard

**Cost**: $0 for hobby projects

---

## 8️⃣ Upstash Redis 💾 **OPTIONAL** (for advanced caching)

**Free Tier**: 
- 10,000 requests/day
- 256MB storage

### Steps:
1. Visit: https://upstash.com
2. Sign up
3. Create Redis database
4. Copy connection URL
5. Add to `.env.local`:
   ```
   UPSTASH_REDIS_URL=your_url_here
   UPSTASH_REDIS_TOKEN=your_token_here
   ```

**Cost**: $0 for free tier

---

## 9️⃣ PostHog Analytics 📈 **OPTIONAL**

**Free Tier**: 1M events/month

### Steps:
1. Visit: https://posthog.com
2. Sign up for free
3. Create new project
4. Copy API key and host
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=your_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

**Cost**: $0 for 1M events/month

---

## 🔟 Google Vision API 👁️ **OPTIONAL** (for image analysis)

**Free Tier**: 1000 requests/month

### Steps:
1. Visit: https://console.cloud.google.com/
2. Enable "Cloud Vision API"
3. Create service account
4. Download JSON key file
5. Add to `.env.local`:
   ```
   GOOGLE_VISION_API_KEY=your_key_here
   ```

**Cost**: $0 for first 1000 requests

---

## 1️⃣1️⃣ MCP (Model Context Protocol) Servers 🔌 **FREE & POWERFUL**

### What is MCP?
MCP servers provide structured access to external data sources. They're completely FREE and can be integrated into your app!

### Available FREE MCP Servers:

#### **Brave Search MCP Server** ⭐ RECOMMENDED
```bash
# Installation
npx -y @modelcontextprotocol/server-brave-search

# Features:
- Web search
- News search  
- Local search
- No API limits through MCP!
```

#### **Fetch MCP Server** (Built-in web fetching)
```bash
# Installation
npx -y @modelcontextprotocol/server-fetch

# Features:
- Fetch any URL
- Extract HTML content
- Built-in rate limiting
- 100% FREE
```

#### **Puppeteer MCP Server** (Advanced scraping)
```bash
# Installation
npx -y @modelcontextprotocol/server-puppeteer

# Features:
- JavaScript rendering
- Screenshot capture
- PDF generation
- Form submission
- 100% FREE (runs locally)
```

#### **GitHub MCP Server** (Access repositories)
```bash
# Installation
npx -y @modelcontextprotocol/server-github

# Features:
- Search repositories
- Read files
- Access issues/PRs
- FREE with GitHub account
```

### How to Use MCP in Veritas AI:

**Option 1: Direct Integration**
```typescript
// lib/mcp-client.ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export async function searchWithBrave(query: string) {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    env: {
      BRAVE_API_KEY: process.env.BRAVE_SEARCH_API_KEY,
    },
  });

  const client = new Client({
    name: 'veritas-ai',
    version: '1.0.0',
  }, {
    capabilities: {},
  });

  await client.connect(transport);
  
  // Use the search tool
  const result = await client.callTool({
    name: 'brave_web_search',
    arguments: { query },
  });
  
  return result;
}
```

**Option 2: Use via AI SDK (Recommended)**
```typescript
// Gemini can use MCP servers directly!
import { google } from '@ai-sdk/google';

const result = await generateText({
  model: google('gemini-2.0-flash'),
  prompt: 'Search for recent fact-checks about...',
  tools: {
    brave_search: {
      description: 'Search the web using Brave',
      parameters: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => {
        // Call Brave Search API
        const response = await fetch(
          `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY!,
            },
          }
        );
        return response.json();
      },
    },
  },
});
```

**Cost**: $0 (MCP servers run locally)

---

## 1️⃣2️⃣ Exa AI (Semantic Web Search) 🧠 **OPTIONAL**

**Free Tier**: 1,000 searches/month

### Steps:
1. Visit: https://exa.ai
2. Sign up for free
3. Get API key
4. Add to `.env.local`:
   ```
   EXA_API_KEY=your_exa_key_here
   ```

**Features**:
- AI-powered semantic search
- Find similar content
- Time-based filtering
- Content extraction

**Cost**: $0 for 1,000 searches/month

---

## 📝 COMPLETE .env.local TEMPLATE

```env
# ========================================
# REQUIRED - Get these first!
# ========================================

# Google Gemini AI (REQUIRED)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ========================================
# RECOMMENDED - For better extraction
# ========================================

# Jina AI Reader (200 requests/day free)
JINA_AI_API_KEY=your_jina_key_here

# Firecrawl (500 credits/month free)
FIRECRAWL_API_KEY=fc-your_firecrawl_key_here

# Brave Search API (2000 searches/month free) - RECOMMENDED!
BRAVE_SEARCH_API_KEY=your_brave_key_here

# Tavily AI Search (1000 searches/month free)
TAVILY_API_KEY=tvly-your_key_here

# SerpAPI Google Search (100 searches/month free)
SERPAPI_KEY=your_serpapi_key_here

# ========================================
# OPTIONAL - Enhanced fact-checking
# ========================================

# Google Fact Check Tools (Free)
GOOGLE_FACT_CHECK_API_KEY=your_factcheck_key_here

# ClaimBuster (1000/month free)
CLAIMBUSTER_API_KEY=your_claimbuster_key_here

# Full Fact (Free for non-commercial)
FULLFACT_API_KEY=your_fullfact_key_here

# ========================================
# OPTIONAL - Analytics & Monitoring
# ========================================

# PostHog (1M events/month free)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Vercel Analytics (automatically added)
# No key needed

# ========================================
# OPTIONAL - Advanced features
# ========================================

# Upstash Redis (10K requests/day free)
UPSTASH_REDIS_URL=your_upstash_url_here
UPSTASH_REDIS_TOKEN=your_upstash_token_here

# Google Vision (1000/month free)
GOOGLE_VISION_API_KEY=your_vision_key_here
```

---

## 🚀 PRIORITY ORDER

### Start with these (Required):
1. ✅ **Google Gemini AI** - Core AI functionality (HAS FREE WEB SEARCH!)
2. ✅ **Vercel** - Hosting and deployment

### Add these next (Highly Recommended):
3. ⭐ **Brave Search API** - 2000 free searches/month for fact-checking
4. ⭐ **Jina AI Reader** - 200 free extractions/day for articles
5. ⭐ **Firecrawl** - 500 free extractions/month for complex sites

### Optional but powerful:
6. 📊 **Tavily AI** - 1000 AI-optimized searches/month
7. 📊 **Google Fact Check API** - Cross-reference with known fact-checks
8. 📈 **PostHog** - Understand user behavior
9. 💾 **Upstash Redis** - Cache results for faster responses

### Advanced (for power users):
10. 🔌 **MCP Servers** - Local execution, unlimited usage
11. 🔍 **Exa AI** - Semantic search capabilities

---

## 💰 TOTAL COST

**Minimum setup**: $0/month
- Google Gemini (free tier)
- Vercel (free tier)
- Browser storage (free)

**Recommended setup**: $0/month
- All of above +
- Jina AI (free 200/day)
- Firecrawl (free 500/month)

**Full setup**: $0/month
- All free tiers cover normal usage
- Upgrade only if exceeding free limits

---

## 📊 USAGE ESTIMATES

For **500 analyses/day**:
- Gemini: 500 requests = ~100K tokens ✅ FREE (1M/day limit)
- Jina AI: 500 extractions ❌ Need paid (200/day free)
  - Alternative: Use Firecrawl as primary
- Firecrawl: 500/day ❌ Need paid (500/month free)
  - Alternative: Mix with article-extractor fallback
- Vercel: ~5GB bandwidth ✅ FREE (100GB/month)

**Recommended for 500/day**:
- Use Jina (200) + Article-Extractor (300) = FREE
- Or upgrade Jina AI to $29/month for unlimited

---

## 🔒 SECURITY BEST PRACTICES

1. **Never commit `.env.local`** to Git
   - Add to `.gitignore`
   
2. **Rotate keys regularly**
   - Every 3-6 months
   
3. **Use Vercel environment variables**
   - Safer than local files
   
4. **Restrict API keys**
   - Limit to specific domains/IPs when possible
   
5. **Monitor usage**
   - Set up alerts for unusual activity

---

## 🆘 TROUBLESHOOTING

### "API key not working"
- Check for typos
- Verify key is active in dashboard
- Check if API is enabled in Google Cloud Console
- Ensure no extra spaces in .env.local

### "Rate limit exceeded"
- Check your usage in provider dashboard
- Implement caching to reduce requests
- Add rate limiting on your end
- Consider upgrading to paid tier

### "CORS errors"
- API keys should be in server-side env vars only
- Never use API keys in client-side code
- Use Next.js API routes as proxy

---

## 📚 DOCUMENTATION LINKS

- **Gemini**: https://ai.google.dev/docs
- **Jina AI**: https://docs.jina.ai/
- **Firecrawl**: https://docs.firecrawl.dev/
- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs

---

## ✅ QUICK START CHECKLIST

- [ ] Create Google account (if don't have)
- [ ] Get Gemini API key
- [ ] Sign up for Vercel
- [ ] Get Jina AI key
- [ ] Get Firecrawl key
- [ ] Create `.env.local` file
- [ ] Add all keys to `.env.local`
- [ ] Test locally (`pnpm dev`)
- [ ] Add env vars to Vercel dashboard
- [ ] Deploy to Vercel
- [ ] Test production deployment

**Time required**: ~30 minutes for all setups

---

**Questions? Each service has detailed documentation and support!**
