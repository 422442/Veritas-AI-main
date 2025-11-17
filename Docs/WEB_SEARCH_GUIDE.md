# 🔍 WEB SEARCH & MCP INTEGRATION GUIDE

## Complete guide to adding FREE web search capabilities to Veritas AI

---

## 🎯 WHY ADD WEB SEARCH?

**Benefits:**
- ✅ **Enhanced Fact-Checking**: Search for corroborating sources in real-time
- ✅ **Source Discovery**: Find authoritative sources automatically
- ✅ **Claim Verification**: Cross-reference claims with latest information
- ✅ **Credibility Scoring**: Assess source reliability based on web presence
- ✅ **100% FREE**: All options have generous free tiers

---

## 🚀 BEST FREE WEB SEARCH OPTIONS

### **Comparison Table**

| Service | Free Quota | Best For | Setup Time |
|---------|-----------|----------|------------|
| **Brave Search** | 2,000/month | General search, privacy | 5 min |
| **Tavily AI** | 1,000/month | AI-optimized results | 5 min |
| **Google via Gemini** | Unlimited* | Built-in grounding | 0 min |
| **SerpAPI** | 100/month | Google results | 5 min |
| **Exa AI** | 1,000/month | Semantic search | 5 min |
| **MCP Brave** | Unlimited** | Local execution | 10 min |

*Already included in Gemini with Search Grounding
**Runs locally, no API limits

---

## 🥇 RECOMMENDED APPROACH

### **Option 1: Use Gemini's Built-in Search Grounding** ⭐ EASIEST

**Already implemented in your project!**

```typescript
// This is ALREADY in your code!
const googleClient = google("gemini-2.5-flash", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  useSearchGrounding: true, // ← This enables free web search!
})
```

**Benefits:**
- ✅ Already working
- ✅ No additional API keys needed
- ✅ Automatic source citations
- ✅ Integrated fact-checking
- ✅ No setup required

**How it works:**
- Gemini automatically searches the web when needed
- Provides grounded responses with citations
- Completely free (included in Gemini quota)

---

### **Option 2: Add Brave Search API** ⭐ MOST POWERFUL

**Free Tier**: 2,000 searches/month

#### Setup (5 minutes):

1. **Get API Key**
   ```
   Visit: https://brave.com/search/api/
   Sign up → Dashboard → Create API Key
   ```

2. **Add to .env.local**
   ```env
   BRAVE_SEARCH_API_KEY=BSA_your_key_here
   ```

3. **Install Package**
   ```bash
   pnpm add axios
   ```

4. **Create Search Helper** (`lib/brave-search.ts`)
   ```typescript
   import axios from 'axios';

   interface BraveSearchResult {
     title: string;
     url: string;
     description: string;
     age?: string;
   }

   export async function searchBrave(
     query: string,
     count: number = 10
   ): Promise<BraveSearchResult[]> {
     try {
       const response = await axios.get(
         'https://api.search.brave.com/res/v1/web/search',
         {
           params: {
             q: query,
             count,
             search_lang: 'en',
             safesearch: 'moderate',
           },
           headers: {
             'Accept': 'application/json',
             'Accept-Encoding': 'gzip',
             'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY!,
           },
         }
       );

       return response.data.web?.results || [];
     } catch (error) {
       console.error('Brave search failed:', error);
       return [];
     }
   }

   // Search for fact-checks specifically
   export async function searchFactChecks(claim: string) {
     const query = `fact check ${claim}`;
     return searchBrave(query, 5);
   }

   // Search for news about a topic
   export async function searchNews(topic: string) {
     const query = `${topic} news`;
     return searchBrave(query, 10);
   }
   ```

5. **Use in Analysis** (Update `app/api/analyze/route.ts`)
   ```typescript
   import { searchFactChecks, searchNews } from '@/lib/brave-search';

   // After extracting claims:
   const factCheckResults = await Promise.all(
     claims.map(claim => searchFactChecks(claim))
   );

   // Add to prompt:
   const prompt = `
   You are analyzing this article...
   
   ARTICLE: ${articleText}
   
   FACT-CHECK REFERENCES FOUND:
   ${factCheckResults.map((results, i) => `
     Claim ${i + 1}: "${claims[i]}"
     Recent fact-checks found:
     ${results.map(r => `- ${r.title}: ${r.url}`).join('\n')}
   `).join('\n')}
   
   Analyze considering these fact-check sources...
   `;
   ```

---

### **Option 3: Use Tavily AI** ⭐ BEST FOR AI-OPTIMIZED RESULTS

**Free Tier**: 1,000 searches/month

#### Why Tavily?
- Optimized for AI/LLM use
- Returns clean, summarized content
- Includes relevant snippets
- Fast and reliable

#### Setup (5 minutes):

1. **Get API Key**
   ```
   Visit: https://tavily.com
   Sign up → Get API Key
   ```

2. **Add to .env.local**
   ```env
   TAVILY_API_KEY=tvly-your_key_here
   ```

3. **Install Package**
   ```bash
   pnpm add tavily
   ```

4. **Create Helper** (`lib/tavily-search.ts`)
   ```typescript
   import { tavily } from 'tavily';

   const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

   export async function searchTavily(query: string) {
     try {
       const response = await client.search(query, {
         searchDepth: 'advanced',
         maxResults: 5,
         includeAnswer: true,
         includeDomains: [
           'snopes.com',
           'factcheck.org',
           'politifact.com',
           'reuters.com',
           'apnews.com',
         ],
       });

       return {
         answer: response.answer,
         results: response.results,
       };
     } catch (error) {
       console.error('Tavily search failed:', error);
       return null;
     }
   }
   ```

5. **Use in Analysis**
   ```typescript
   // Search for each claim
   const verificationData = await searchTavily(
     `fact check: ${claimText}`
   );

   if (verificationData?.answer) {
     console.log('AI Summary:', verificationData.answer);
     console.log('Sources:', verificationData.results);
   }
   ```

---

## 🔌 MCP (Model Context Protocol) SERVERS

### **What is MCP?**

MCP provides a standardized way to connect AI applications to data sources. Think of it as "plugins for AI" - completely FREE and runs locally!

### **Available FREE MCP Servers:**

#### 1. **Brave Search MCP Server** ⭐

```bash
# Install globally
npm install -g @modelcontextprotocol/server-brave-search

# Or use directly with npx
npx -y @modelcontextprotocol/server-brave-search
```

**Usage:**
```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function searchWithMCP(query: string) {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    env: {
      BRAVE_API_KEY: process.env.BRAVE_SEARCH_API_KEY,
    },
  });

  const client = new Client(
    { name: 'veritas-ai', version: '1.0.0' },
    { capabilities: {} }
  );

  await client.connect(transport);

  const result = await client.callTool({
    name: 'brave_web_search',
    arguments: { query, count: 10 },
  });

  await client.close();
  return result;
}
```

#### 2. **Fetch MCP Server** (Universal web fetching)

```bash
npx -y @modelcontextprotocol/server-fetch
```

**Features:**
- Fetch any URL
- Extract content
- Handle redirects
- Rate limiting built-in

#### 3. **Puppeteer MCP Server** (Advanced scraping)

```bash
npx -y @modelcontextprotocol/server-puppeteer
```

**Features:**
- JavaScript rendering
- Screenshot capture
- Handle complex sites
- No external API needed!

### **Installing MCP SDK:**

```bash
pnpm add @modelcontextprotocol/sdk
```

---

## 💡 RECOMMENDED IMPLEMENTATION STRATEGY

### **Phase 1: Start Simple** (Use what you have)

```typescript
// Already working in your code!
const googleClient = google("gemini-2.5-flash", {
  useSearchGrounding: true, // ← Free web search!
})
```

**Result**: Basic fact-checking with web sources

---

### **Phase 2: Add Brave Search** (Enhanced verification)

```typescript
// lib/enhanced-verification.ts
import { searchFactChecks } from './brave-search';

export async function verifyClaimWithSources(claim: string) {
  // 1. Search for fact-checks
  const factChecks = await searchFactChecks(claim);
  
  // 2. Search for news articles
  const news = await searchNews(claim);
  
  // 3. Return combined results
  return {
    factCheckSources: factChecks.slice(0, 3),
    newsSources: news.slice(0, 5),
  };
}

// Use in analysis:
const sources = await verifyClaimWithSources(claimText);
```

**Result**: Real-time fact-check database lookup

---

### **Phase 3: AI-Optimized Search** (Best results)

```typescript
// Use Tavily for AI-optimized responses
const verification = await searchTavily(`fact check: ${claim}`);

// Tavily provides:
// - Direct answer
// - Relevant sources
// - Clean content for AI
```

**Result**: Best quality verification data

---

## 🎯 COMPLETE INTEGRATION EXAMPLE

### **Enhanced Analysis Route with Web Search**

```typescript
// app/api/analyze/route.ts

import { searchFactChecks } from '@/lib/brave-search';
import { searchTavily } from '@/lib/tavily-search';

export async function POST(request: NextRequest) {
  // ... existing code ...

  // Extract article
  const articleText = await extractArticle(url);

  // STEP 1: Initial analysis with Gemini (has search grounding)
  const initialAnalysis = await generateObject({
    model: google("gemini-2.5-flash", {
      useSearchGrounding: true, // ← Auto web search
    }),
    schema: analysisSchema,
    prompt: `Analyze this article: ${articleText}`,
  });

  // STEP 2: Enhanced verification with Brave Search
  const claimVerifications = await Promise.all(
    initialAnalysis.object.claims.map(async (claim) => {
      // Search for fact-checks
      const factChecks = await searchFactChecks(claim.text);
      
      // Search with Tavily for AI summary
      const tavilyResult = await searchTavily(
        `verify claim: ${claim.text}`
      );

      return {
        ...claim,
        factCheckSources: factChecks,
        aiVerification: tavilyResult?.answer,
      };
    })
  );

  // STEP 3: Final refined analysis
  const refinedAnalysis = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: analysisSchema,
    prompt: `
      Original Analysis: ${JSON.stringify(initialAnalysis.object)}
      
      Additional Fact-Check Data:
      ${JSON.stringify(claimVerifications, null, 2)}
      
      Refine the analysis considering this additional verification data.
      Update confidence scores and explanations based on fact-check sources.
    `,
  });

  return NextResponse.json(refinedAnalysis.object);
}
```

---

## 📊 SEARCH QUOTA MANAGEMENT

### **Strategy for FREE Usage:**

```typescript
// lib/search-manager.ts

class SearchManager {
  private dailyCount = 0;
  private lastReset = new Date().getDate();

  async search(query: string) {
    this.checkReset();

    // Priority cascade based on quotas
    if (this.dailyCount < 50) {
      // Use Tavily (best quality, 1000/month = ~33/day)
      return this.searchTavily(query);
    } else if (this.dailyCount < 100) {
      // Use Brave (2000/month = ~66/day)
      return this.searchBrave(query);
    } else {
      // Use Gemini grounding (unlimited)
      return this.searchWithGemini(query);
    }
  }

  private checkReset() {
    const today = new Date().getDate();
    if (today !== this.lastReset) {
      this.dailyCount = 0;
      this.lastReset = today;
    }
  }
}
```

---

## 🔒 SECURITY & BEST PRACTICES

### **API Key Protection:**

```typescript
// ❌ NEVER do this (client-side)
const apiKey = process.env.NEXT_PUBLIC_BRAVE_KEY; // WRONG!

// ✅ Always use server-side
const apiKey = process.env.BRAVE_SEARCH_API_KEY; // Correct!
```

### **Rate Limiting:**

```typescript
// lib/rate-limiter.ts
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function searchWithRateLimit(query: string, ip: string) {
  try {
    await limiter.check(ip, 10); // 10 requests per minute
    return searchBrave(query);
  } catch {
    throw new Error('Rate limit exceeded');
  }
}
```

---

## 📈 PERFORMANCE OPTIMIZATION

### **Caching Strategy:**

```typescript
// lib/search-cache.ts
const cache = new Map<string, { data: any; expires: number }>();

export async function cachedSearch(query: string) {
  const cacheKey = query.toLowerCase().trim();
  const cached = cache.get(cacheKey);

  // Return cached if not expired (1 hour)
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }

  // Fetch new data
  const data = await searchBrave(query);
  
  // Cache for 1 hour
  cache.set(cacheKey, {
    data,
    expires: Date.now() + 60 * 60 * 1000,
  });

  return data;
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### **Quick Start (5 minutes):**
- [ ] Already using Gemini Search Grounding ✅ (You have this!)
- [ ] Test it's working
- [ ] Done! You have free web search

### **Enhanced (30 minutes):**
- [ ] Sign up for Brave Search API
- [ ] Add API key to .env.local
- [ ] Create brave-search.ts helper
- [ ] Test fact-check searches
- [ ] Integrate into analysis route

### **Advanced (1 hour):**
- [ ] Sign up for Tavily AI
- [ ] Add tavily-search.ts
- [ ] Implement search manager
- [ ] Add caching
- [ ] Add rate limiting

### **MCP Integration (1-2 hours):**
- [ ] Install MCP SDK
- [ ] Set up Brave MCP server
- [ ] Create MCP client wrapper
- [ ] Test with Gemini
- [ ] Deploy

---

## 🎯 RECOMMENDED STACK

### **For Most Users:**
```
1. Gemini Search Grounding (already have) ✅
2. Brave Search API (2000/month free)
3. Local caching

Total cost: $0
Setup time: 15 minutes
```

### **For Power Users:**
```
1. Gemini Search Grounding
2. Brave Search API
3. Tavily AI (AI-optimized)
4. MCP servers (local execution)
5. Redis caching (Upstash free tier)

Total cost: $0
Setup time: 2-3 hours
```

---

## 🚀 READY TO ADD WEB SEARCH?

**Choose your path:**

1. **"Just use what I have"** → You already have Gemini grounding! ✅
2. **"Add Brave Search"** → I'll implement it for you
3. **"Full MCP integration"** → I'll set up the complete system
4. **"Show me the code"** → I'll create all the files

**What would you like to do?** 🔍
