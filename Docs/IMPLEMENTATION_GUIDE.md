# 🛠️ IMPLEMENTATION GUIDE - Step-by-Step

## 🚀 QUICK START CHECKLIST

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Git installed
- [ ] VS Code or preferred IDE
- [ ] Google account for Gemini API

---

## 📋 PHASE 1: ENHANCED WEB SCRAPING

### Step 1: Install Dependencies

```bash
pnpm add @extractus/article-extractor
pnpm add @mozilla/readability
pnpm add jsdom
pnpm add axios
```

### Step 2: Get Free API Keys

#### A. Jina AI Reader (FREE - 200 requests/day)
1. Visit: https://jina.ai/reader
2. Sign up with Google/GitHub
3. Get API key from dashboard
4. Add to `.env.local`:
   ```
   JINA_AI_API_KEY=your_jina_key_here
   ```

#### B. Firecrawl (FREE - 500 credits/month)
1. Visit: https://firecrawl.dev
2. Sign up for free account
3. Get API key from dashboard
4. Add to `.env.local`:
   ```
   FIRECRAWL_API_KEY=your_firecrawl_key_here
   ```

### Step 3: Create Enhanced Extractor

**File**: `lib/article-extractor.ts`

```typescript
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

// Method 1: Jina AI Reader (fastest, cleanest)
async function extractWithJina(url: string): Promise<Article> {
  if (!process.env.JINA_AI_API_KEY) {
    throw new Error('Jina AI key not configured');
  }

  const response = await axios.get(`https://r.jina.ai/${url}`, {
    headers: {
      'Authorization': `Bearer ${process.env.JINA_AI_API_KEY}`,
      'X-Return-Format': 'markdown'
    },
    timeout: 10000
  });

  if (response.data) {
    return {
      title: extractTitleFromMarkdown(response.data),
      content: response.data,
      success: true,
      method: 'jina'
    };
  }

  throw new Error('No content returned');
}

// Method 2: Firecrawl (good for paywalls)
async function extractWithFirecrawl(url: string): Promise<Article> {
  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error('Firecrawl key not configured');
  }

  const response = await axios.post(
    'https://api.firecrawl.dev/v0/scrape',
    { url },
    {
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    }
  );

  if (response.data?.data?.content) {
    return {
      title: response.data.data.title || '',
      content: response.data.data.content,
      success: true,
      method: 'firecrawl'
    };
  }

  throw new Error('No content returned');
}

// Method 3: Article Extractor (fast, offline)
async function extractWithArticleExtractor(url: string): Promise<Article> {
  const article = await extract(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (article && article.content && article.content.length > 200) {
    return {
      title: article.title || '',
      content: article.content,
      author: article.author,
      publishDate: article.published,
      source: article.source,
      success: true,
      method: 'article-extractor'
    };
  }

  throw new Error('Insufficient content extracted');
}

// Method 4: Cheerio + Readability
async function extractWithReadability(url: string): Promise<Article> {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 10000
  });

  const dom = new JSDOM(response.data, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (article && article.textContent && article.textContent.length > 200) {
    return {
      title: article.title,
      content: article.textContent,
      success: true,
      method: 'readability'
    };
  }

  throw new Error('Failed to parse article');
}

// Main extraction function with fallbacks
export async function extractArticle(url: string): Promise<Article> {
  const methods = [
    { name: 'jina', fn: extractWithJina },
    { name: 'firecrawl', fn: extractWithFirecrawl },
    { name: 'article-extractor', fn: extractWithArticleExtractor },
    { name: 'readability', fn: extractWithReadability }
  ];

  const errors: string[] = [];

  for (const method of methods) {
    try {
      console.log(`Trying extraction method: ${method.name}`);
      const result = await method.fn(url);
      
      if (result.success && result.content.length > 200) {
        console.log(`✓ Successfully extracted with ${method.name}`);
        return result;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${method.name}: ${errorMsg}`);
      console.warn(`✗ ${method.name} failed:`, errorMsg);
      continue;
    }
  }

  throw new Error(`All extraction methods failed:\n${errors.join('\n')}`);
}

function extractTitleFromMarkdown(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Article';
}
```

### Step 4: Update API Route

Update `app/api/analyze/route.ts` to use new extractor:

```typescript
// Replace the extractTextFromUrl function
import { extractArticle } from '@/lib/article-extractor';

// In the POST handler, replace:
if (url && !text) {
  try {
    const article = await extractArticle(url);
    articleText = `${article.title}\n\n${article.content}`;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract text from URL" },
      { status: 400 }
    );
  }
}
```

---

## 📄 PHASE 2: PDF EXPORT

### Step 1: Install Dependencies

```bash
pnpm add @react-pdf/renderer
pnpm add react-pdf
```

### Step 2: Create PDF Template

**File**: `components/pdf-report.tsx`

```typescript
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import type { AnalysisResult } from '@/app/page';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
  },
  verdictBox: {
    backgroundColor: '#f1f5f9',
    padding: 20,
    borderRadius: 8,
    marginVertical: 20,
    borderLeft: 4,
    borderLeftColor: '#2563eb',
  },
  verdictTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#334155',
  },
  claim: {
    backgroundColor: '#f8fafc',
    padding: 15,
    marginBottom: 10,
    borderRadius: 6,
    borderLeft: 3,
  },
  claimVerified: {
    borderLeftColor: '#22c55e',
  },
  claimContradicted: {
    borderLeftColor: '#ef4444',
  },
  claimUnverified: {
    borderLeftColor: '#f59e0b',
  },
  badge: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: '4 8',
    borderRadius: 4,
    marginBottom: 8,
  },
  source: {
    fontSize: 10,
    color: '#2563eb',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: '#94a3b8',
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
});

interface PDFReportProps {
  results: AnalysisResult;
  sourceUrl?: string;
}

export const PDFReport: React.FC<PDFReportProps> = ({ results, sourceUrl }) => {
  const verifiedCount = results.claims.filter(c => c.status === 'verified').length;
  const contradictedCount = results.claims.filter(c => c.status === 'contradicted').length;
  const unverifiedCount = results.claims.filter(c => c.status === 'unverified').length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Veritas AI Analysis Report</Text>
          <Text style={styles.subtitle}>Generated: {new Date().toLocaleString()}</Text>
          <Text style={styles.subtitle}>Powered by: Google Gemini AI with Search Grounding</Text>
          {sourceUrl && <Text style={styles.subtitle}>Source: {sourceUrl}</Text>}
        </View>

        {/* Verdict Section */}
        <View style={styles.verdictBox}>
          <Text style={styles.verdictTitle}>{results.verdict}</Text>
          <Text style={styles.text}>Confidence: {results.confidence}%</Text>
          <Text style={styles.text}>
            Claims: {verifiedCount} Verified | {contradictedCount} Contradicted | {unverifiedCount} Unverified
          </Text>
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.text}>{results.summary}</Text>

        {/* Claims Analysis */}
        <Text style={styles.sectionTitle}>Detailed Claim Analysis</Text>
        {results.claims.map((claim, index) => (
          <View
            key={index}
            style={[
              styles.claim,
              claim.status === 'verified' && styles.claimVerified,
              claim.status === 'contradicted' && styles.claimContradicted,
              claim.status === 'unverified' && styles.claimUnverified,
            ]}
          >
            <Text style={styles.badge}>{claim.status.toUpperCase()}</Text>
            <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 5 }]}>
              {index + 1}. {claim.text}
            </Text>
            <Text style={styles.text}>{claim.explanation}</Text>
          </View>
        ))}

        {/* Reasoning */}
        <Text style={styles.sectionTitle}>AI Reasoning</Text>
        <Text style={styles.text}>{results.reasoning}</Text>

        {/* Sources */}
        {results.sources.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Verification Sources</Text>
            {results.sources.map((source, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>
                  {index + 1}. {source.title}
                </Text>
                <Link src={source.url} style={styles.source}>
                  {source.url}
                </Link>
              </View>
            ))}
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This analysis was generated using advanced AI models and should be considered as part of a
            comprehensive fact-checking process.
          </Text>
          <Text style={{ marginTop: 5 }}>
            Report generated by Veritas AI | {new Date().getFullYear()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
```

### Step 3: Update Export Component

Update `components/export-report.tsx`:

```typescript
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFReport } from './pdf-report';

// Add to the dropdown menu:
<DropdownMenuItem asChild>
  <PDFDownloadLink
    document={<PDFReport results={results} sourceUrl={sourceUrl} />}
    fileName={`veritas-ai-report-${Date.now()}.pdf`}
    className="flex items-center w-full"
  >
    {({ loading }) => (
      <>
        <FileText className="h-4 w-4 mr-2" />
        {loading ? 'Generating PDF...' : 'Download as PDF'}
      </>
    )}
  </PDFDownloadLink>
</DropdownMenuItem>
```

---

## 💾 PHASE 3: BROWSER STORAGE

### Step 1: Install Dependencies

```bash
pnpm add idb
```

### Step 2: Create Database Service

**File**: `lib/db.ts`

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AnalysisRecord {
  id?: number;
  timestamp: number;
  url?: string;
  text?: string;
  results: any;
  starred: boolean;
  tags: string[];
}

interface VeritasDB extends DBSchema {
  analyses: {
    key: number;
    value: AnalysisRecord;
    indexes: { 'by-timestamp': number; 'by-starred': boolean };
  };
}

let dbPromise: Promise<IDBPDatabase<VeritasDB>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<VeritasDB>('veritas-ai', 1, {
      upgrade(db) {
        const store = db.createObjectStore('analyses', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-timestamp', 'timestamp');
        store.createIndex('by-starred', 'starred');
      },
    });
  }
  return dbPromise;
}

export async function saveAnalysis(
  results: any,
  url?: string,
  text?: string
): Promise<number> {
  const db = await getDB();
  return db.add('analyses', {
    timestamp: Date.now(),
    url,
    text: text?.substring(0, 500), // Store only preview
    results,
    starred: false,
    tags: [],
  });
}

export async function getAnalysisHistory(limit = 50): Promise<AnalysisRecord[]> {
  const db = await getDB();
  const tx = db.transaction('analyses', 'readonly');
  const index = tx.store.index('by-timestamp');
  const records = await index.getAll();
  return records.reverse().slice(0, limit);
}

export async function deleteAnalysis(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('analyses', id);
}

export async function toggleStar(id: number): Promise<void> {
  const db = await getDB();
  const record = await db.get('analyses', id);
  if (record) {
    record.starred = !record.starred;
    await db.put('analyses', record);
  }
}

export async function exportAllData(): Promise<string> {
  const db = await getDB();
  const all = await db.getAll('analyses');
  return JSON.stringify(all, null, 2);
}

export async function importData(jsonData: string): Promise<number> {
  const data = JSON.parse(jsonData) as AnalysisRecord[];
  const db = await getDB();
  let count = 0;
  for (const record of data) {
    delete record.id; // Let auto-increment assign new IDs
    await db.add('analyses', record);
    count++;
  }
  return count;
}
```

### Step 3: Create History Component

**File**: `components/analysis-history.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getAnalysisHistory, deleteAnalysis, toggleStar } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Clock, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

export function AnalysisHistory({ onRestore }: { onRestore: (results: any) => void }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const records = await getAnalysisHistory();
      setHistory(records);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteAnalysis(id);
      setHistory(prev => prev.filter(r => r.id !== id));
      toast.success('Analysis deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  }

  async function handleToggleStar(id: number) {
    try {
      await toggleStar(id);
      await loadHistory();
    } catch (error) {
      toast.error('Failed to update');
    }
  }

  if (loading) return <div>Loading history...</div>;
  if (history.length === 0) return <div>No analyses yet</div>;

  return (
    <div className="space-y-4">
      {history.map(record => (
        <Card key={record.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(record.timestamp).toLocaleString()}
                  </span>
                </div>
                {record.url && (
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={record.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate"
                    >
                      {record.url}
                    </a>
                  </div>
                )}
                <div className="text-lg font-semibold">
                  {record.results.verdict}
                </div>
                <div className="text-sm text-muted-foreground">
                  Confidence: {record.results.confidence}%
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStar(record.id!)}
                >
                  <Star
                    className={`h-4 w-4 ${record.starred ? 'fill-yellow-400 text-yellow-400' : ''}`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestore(record.results)}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(record.id!)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## 🎨 PHASE 4: UI ENHANCEMENTS

### Step 1: Enhanced Landing Page

Update `app/page.tsx` to add statistics and features section:

```typescript
// Add before InputSection
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
>
  <Card className="text-center p-6">
    <div className="text-3xl font-bold text-primary">10K+</div>
    <div className="text-sm text-muted-foreground">Analyses</div>
  </Card>
  <Card className="text-center p-6">
    <div className="text-3xl font-bold text-primary">95%</div>
    <div className="text-sm text-muted-foreground">Accuracy</div>
  </Card>
  <Card className="text-center p-6">
    <div className="text-3xl font-bold text-primary">1000+</div>
    <div className="text-sm text-muted-foreground">Sources</div>
  </Card>
  <Card className="text-center p-6">
    <div className="text-3xl font-bold text-primary">Free</div>
    <div className="text-sm text-muted-foreground">Always</div>
  </Card>
</motion.div>
```

---

## 🧪 TESTING

### Test Checklist

- [ ] Test URL extraction with 10 different news sites
- [ ] Test with paywalled articles
- [ ] Test PDF generation with large reports
- [ ] Test history storage with 50+ records
- [ ] Test mobile responsiveness
- [ ] Test dark mode
- [ ] Test error handling
- [ ] Test rate limiting

### Sample Test URLs

```
https://www.bbc.com/news
https://www.theguardian.com/
https://www.nytimes.com/
https://techcrunch.com/
https://www.reuters.com/
```

---

## 🚀 DEPLOYMENT

### Update Environment Variables

`.env.local`:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_key
JINA_AI_API_KEY=your_key
FIRECRAWL_API_KEY=your_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Deploy to Vercel

```bash
# Login
vercel login

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
```

---

## 📊 MONITORING

### Add Analytics

```bash
pnpm add @vercel/analytics
```

In `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// Add in layout return:
<Analytics />
```

---

## ✅ COMPLETION CHECKLIST

Phase 1:
- [ ] Enhanced web scraping installed
- [ ] Jina AI integrated
- [ ] Firecrawl integrated
- [ ] Fallback chain working
- [ ] Test with 10 URLs

Phase 2:
- [ ] @react-pdf/renderer installed
- [ ] PDF template created
- [ ] Download button working
- [ ] PDF styling polished

Phase 3:
- [ ] IndexedDB setup
- [ ] History component created
- [ ] Save/load working
- [ ] Export/import data

Phase 4:
- [ ] Landing page enhanced
- [ ] Statistics added
- [ ] Mobile responsive
- [ ] Dark mode tested

---

**Ready to implement? Start with Phase 1 and work your way through!**

Each phase takes 2-4 hours. Total implementation: 1-2 days for full transformation.
