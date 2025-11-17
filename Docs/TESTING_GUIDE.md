# 🧪 Veritas AI - Testing Guide

## Testing the Complete Redesigned Application

Your application is now running at: **http://localhost:3000**

---

## ✅ Test Checklist

### 1. **Visual Design Testing**

#### Landing Page Hero:
- [ ] Animated gradient background orbs visible
- [ ] Hero text gradients rendering correctly
- [ ] Stats cards (4 boxes) displaying with icons
- [ ] Smooth fade-in animations on page load
- [ ] "How It Works" section visible at bottom
- [ ] Responsive on mobile (stack to 2x2 grid)

#### Header:
- [ ] Gradient logo shield visible
- [ ] Hover animation on logo (scale + rotate)
- [ ] Green pulsing status indicator
- [ ] Theme toggle working (light/dark mode)
- [ ] Fixed position on scroll

---

### 2. **Input Section Testing**

#### URL Tab:
- [ ] Top gradient accent bar visible (blue→purple→cyan)
- [ ] "Multi-Tier Verification" badge displaying
- [ ] Example URL buttons clickable
- [ ] URL input accepts paste
- [ ] Icon inside input field visible
- [ ] Technology stack badges showing
- [ ] Validation error appears for invalid URLs

**Test URLs:**
```
https://www.bbc.com/news/technology
https://www.reuters.com/world
https://www.theguardian.com/international
```

#### Text Tab:
- [ ] Textarea expands properly
- [ ] Character counter updating
- [ ] Instructions text visible
- [ ] Minimum 50 characters message

#### Submit Button:
- [ ] Gradient background (blue→purple→cyan)
- [ ] Hover scale animation
- [ ] Loading spinner appears when analyzing
- [ ] Text changes to "Analyzing with AI + Web Search..."
- [ ] Disabled when empty

#### Status Indicators:
- [ ] 3 animated dots visible at bottom
- [ ] Pulsing animations working
- [ ] Colors: green, blue, purple

---

### 3. **Functionality Testing**

#### Article Analysis:
1. **Test with URL** (BBC article):
   ```
   https://www.bbc.com/news/technology
   ```
   - [ ] Progress bar appears
   - [ ] Jina AI extraction working (check console)
   - [ ] Tavily search running (check console logs)
   - [ ] Results appear after ~5-10 seconds

2. **Test with Direct Text**:
   - Copy article text from any news site
   - Paste into text tab
   - [ ] Analysis completes successfully
   - [ ] No web scraping errors (since it's direct text)

#### Expected Results:
- [ ] Verdict card with color (green/yellow/red)
- [ ] Confidence percentage
- [ ] Claim count, verified count, sources count
- [ ] Verification breakdown charts
- [ ] Executive summary
- [ ] Detailed claim analysis
- [ ] Expert reasoning section
- [ ] Source citations with links

---

### 4. **Tavily Web Search Testing**

**Check Console Logs** (F12 → Console):

Look for:
```
🔍 TAVILY SEARCH QUERIES:
Fact-check query: [article title or content snippet]
General search query: [article title or content snippet]
```

Expected Behavior:
- [ ] Tavily searches for article CONTENT (not just domain)
- [ ] Both fact-check and general searches run in parallel
- [ ] Results formatted under "WEB SEARCH VERIFICATION (via Tavily AI)"
- [ ] Gemini AI uses web search context in analysis

**Console Error Check:**
- [ ] No "only searching domain" errors
- [ ] No rate limit errors
- [ ] No API key errors

---

### 5. **Export & History Testing**

#### Export Report:
- [ ] "Export Analysis Report" card visible
- [ ] Copy button works (shows "Copied!")
- [ ] Export dropdown opens
- [ ] PDF export generates file
- [ ] PDF download initiates
- [ ] Text export works
- [ ] HTML export works

#### Analysis History:
- [ ] Analysis saves to IndexedDB automatically
- [ ] History appears in bottom section
- [ ] Can reload past analyses
- [ ] Star favorites works
- [ ] Delete works
- [ ] Export all data works

---

### 6. **Responsive Testing**

#### Desktop (> 1024px):
- [ ] 4-column stats grid
- [ ] Wide input cards
- [ ] Side-by-side layouts

#### Tablet (640px - 1024px):
- [ ] 2-column stats grid
- [ ] Readable font sizes
- [ ] Touch-friendly buttons

#### Mobile (< 640px):
- [ ] 2x2 stats grid
- [ ] Stacked layouts
- [ ] Hidden status text
- [ ] Large touch targets
- [ ] No horizontal scroll

**Test on DevTools**: Right-click → Inspect → Toggle device toolbar (Ctrl+Shift+M)

---

### 7. **Dark Mode Testing**

Click theme toggle in header:
- [ ] Smooth transition
- [ ] All text readable
- [ ] Gradients work in dark mode
- [ ] Cards have proper contrast
- [ ] Borders visible but subtle
- [ ] Icons colored appropriately

---

### 8. **Animation Testing**

#### Page Load:
- [ ] Hero fades in first
- [ ] Stats cards stagger in
- [ ] Input section appears last
- [ ] Smooth transitions (no jank)

#### Interactions:
- [ ] Button hover scales up
- [ ] Logo rotates on hover
- [ ] Results slide up when appearing
- [ ] Cards have hover shadows
- [ ] Status dots pulse continuously

---

### 9. **Error Handling Testing**

#### Invalid URL:
- Enter: `not-a-url`
- [ ] Red error message appears
- [ ] Submit button disabled
- [ ] Clear error message

#### Rate Limit (if hit):
- [ ] Friendly error toast
- [ ] Explanation about quota
- [ ] Suggests trying again later

#### Network Error:
- Turn off internet briefly
- [ ] Error toast appears
- [ ] Analysis doesn't freeze
- [ ] Can retry after reconnect

---

### 10. **Performance Testing**

#### Load Time:
- [ ] Page loads in < 2 seconds
- [ ] Fonts load without flash
- [ ] Images lazy load
- [ ] No layout shift

#### Analysis Speed:
- [ ] URL analysis: 5-15 seconds (depending on site)
- [ ] Text analysis: 3-8 seconds
- [ ] No freezing or lag
- [ ] Smooth animations throughout

#### Memory:
- Open Chrome Task Manager (Shift+Esc)
- Check memory usage
- [ ] < 150 MB for tab
- [ ] No memory leaks on repeated use

---

## 🚨 Common Issues & Solutions

### Issue: "API key not found"
**Solution**: Check `.env.local` has all keys:
```
GEMINI_API_KEY=your_key
JINA_API_KEY=your_key
FIRECRAWL_API_KEY=your_key
TAVILY_API_KEY=your_key
```

### Issue: "Rate limit exceeded"
**Solution**: 
- Gemini: Wait 1 minute (1500 req/day free tier)
- Jina: Wait until tomorrow (200 req/day)
- Firecrawl: Wait until next month (500 req/month)
- Tavily: Wait until next month (1000 searches/month)

### Issue: Tavily not searching article content
**Solution**: Fixed in latest update. Check console logs show article title/content in search query, not just domain.

### Issue: Build errors
**Solution**: 
```bash
pnpm install
pnpm build
```

### Issue: Dark mode not working
**Solution**: Theme provider should be in `app/layout.tsx`. Check it's wrapping the app.

---

## 📊 Success Criteria

Your app is working perfectly if:

✅ **Visual**: All gradients, animations, and responsive design work  
✅ **Functional**: URL/text analysis completes successfully  
✅ **Accurate**: Tavily searches article content, not just domain  
✅ **Fast**: Analysis completes in < 15 seconds  
✅ **Reliable**: No crashes or API errors  
✅ **Professional**: Looks like a $50K+ enterprise app  

---

## 🎯 Sample Test Flow

### Full End-to-End Test:

1. **Open app**: http://localhost:3000
2. **Check landing page**: Hero, stats, animations
3. **Click URL tab** in input section
4. **Paste BBC URL**: `https://www.bbc.com/news/technology`
5. **Click example button** instead (faster)
6. **Click "Start Verification Analysis"**
7. **Watch progress bar** animate through steps
8. **Wait 5-10 seconds** for results
9. **Check console** for Tavily search logs
10. **Review results**: Verdict, claims, sources
11. **Test exports**: Click PDF, Text, HTML downloads
12. **Check history**: Scroll down, see saved analysis
13. **Toggle dark mode**: Verify all colors work
14. **Test mobile**: DevTools responsive mode
15. **Try another article**: Test consistency

**Expected Time**: 2-3 minutes per full test

---

## 📝 Reporting Issues

If you find issues, note:
- Browser & version
- Screen size
- Console errors (F12 → Console)
- Network errors (F12 → Network)
- Steps to reproduce

---

## 🚀 Ready for Production?

After testing, your app should be:
- ✅ Visually stunning
- ✅ Functionally complete
- ✅ Performance optimized
- ✅ Error-free
- ✅ Mobile-ready
- ✅ Accessible

**Next step**: Deploy to Vercel! 🎉

---

## 🔗 Quick Links

- **Local**: http://localhost:3000
- **Docs**: See `UI_REDESIGN_COMPLETE.md`
- **Rate Limits**: See `RATE_LIMIT_FIX.md`
- **API Keys**: See `FREE_API_KEYS_GUIDE.md`

Happy testing! 🎊
