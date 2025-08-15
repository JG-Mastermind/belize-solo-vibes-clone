# Performance Monitoring Runbook

## Overview

This runbook outlines the comprehensive performance monitoring system for BelizeVibes, including automated CI/CD performance audits, bundle size tracking, and Core Web Vitals monitoring.

## Performance Budgets

### Bundle Size Limits
- **Main Bundle**: 800KB (784KB current)
- **CSS Bundle**: 100KB (98KB current)
- **Individual Chunks**: 500KB warning threshold
- **Total Assets**: ~1.5MB compressed

### Core Web Vitals Thresholds
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Contentful Paint (FCP)**: < 1.8s

### Lighthouse Score Targets
- **Performance**: ≥ 90%
- **Accessibility**: ≥ 95%
- **SEO**: ≥ 95%
- **Best Practices**: ≥ 90%

## CI/CD Performance Monitoring

### Automated Workflows

The performance monitoring system runs automatically on:
- Pull requests affecting source code
- Push to main branch
- Manual workflow dispatch

### Key Performance Checks

1. **Bundle Analysis**
   - Tracks main bundle size against 800KB limit
   - Monitors CSS bundle size against 100KB limit
   - Counts total JavaScript chunks
   - Fails CI if limits exceeded

2. **Lighthouse Audits**
   - Tests 5 critical pages (landing, adventures, French adventures, about, blog)
   - Runs 3 times per page for consistency
   - Enforces performance score thresholds
   - Measures Core Web Vitals

3. **Regression Detection**
   - Compares performance metrics against thresholds
   - Blocks PRs with performance regressions
   - Comments results on pull requests

## Local Performance Testing

### Quick Performance Check
```bash
# Build and analyze bundle
npm run analyze-bundle

# Run Lighthouse audit locally
npm run performance:ci
```

### Manual Bundle Analysis
```bash
# Build production bundle
npm run build

# Check bundle sizes
ls -lh dist/assets/

# Largest files
ls -lahS dist/assets/ | head -10
```

### Development Performance Profiling

1. **Chrome DevTools**
   - Performance tab for runtime analysis
   - Network tab for loading performance
   - Lighthouse tab for comprehensive audits

2. **React Developer Tools**
   - Profiler for component render performance
   - Identify unnecessary re-renders

## Performance Issues Identified

### Critical Issues (Immediate Action Required)

1. **Large Bundle Chunks**
   - `BlogForm-7CDn4STJ.js`: 357KB (TipTap rich text editor)
   - `DashboardCharts-B4owdKzA.js`: 384KB (Recharts library)
   - `index-BGojPc_D.js`: 783KB main bundle

2. **Missing Optimization**
   - No React.memo usage found in codebase
   - Limited useCallback/useMemo implementation
   - No image lazy loading

3. **Heavy Dependencies**
   - Multiple Radix UI components (good for accessibility, heavy for bundle)
   - TipTap editor loading on every admin page
   - Recharts loading for all dashboard users

### Optimization Opportunities

#### High Impact (Immediate)

1. **Code Splitting by Route**
   ```typescript
   // Already implemented - good!
   const BlogForm = lazy(() => import('./components/admin/BlogForm'))
   ```

2. **Component-Level Code Splitting**
   ```typescript
   // Split heavy components
   const DashboardCharts = lazy(() => import('./DashboardCharts'))
   const RichTextEditor = lazy(() => import('./RichTextEditor'))
   ```

3. **Dynamic Imports for Libraries**
   ```typescript
   // Load Recharts only when needed
   const loadCharts = () => import('recharts')
   ```

#### Medium Impact

4. **Image Optimization**
   - Implement lazy loading: `loading="lazy"`
   - Add responsive images with srcSet
   - Convert to WebP format where possible
   - Implement blur-up loading placeholders

5. **React Performance**
   ```typescript
   // Add React.memo for expensive components
   export default React.memo(ExpensiveComponent)
   
   // Memoize expensive calculations
   const expensiveValue = useMemo(() => heavyCalculation(data), [data])
   ```

6. **Bundle Optimization**
   - Tree shaking unused Radix components
   - Replace moment.js with date-fns (already done!)
   - Consider replacing Recharts with lighter alternative

#### Low Impact (Nice to Have)

7. **CSS Optimization**
   - Purge unused Tailwind classes
   - Critical CSS extraction
   - Font preloading

8. **Network Optimizations**
   - Enable compression (gzip/brotli)
   - Add resource hints (preload, prefetch)
   - Implement service worker caching

## Performance Regression Prevention

### Pre-commit Checks
```bash
# Add to git hooks
npm run build
npm run type-check
```

### PR Review Guidelines
- Check bundle size impact in CI comments
- Review new dependencies for size impact
- Ensure images are optimized
- Verify lazy loading for new components

### Monitoring Alerts
- Bundle size increases >10%
- Performance score drops >5 points
- LCP increases >200ms
- CLS increases >0.02

## Troubleshooting Performance Issues

### Bundle Size Exceeded
1. Check largest chunks: `ls -lahS dist/assets/`
2. Use bundle analyzer to identify heavy imports
3. Consider dynamic imports for large libraries
4. Review if new dependencies are necessary

### Low Lighthouse Scores
1. **Performance**: Check LCP, FID, CLS metrics
2. **Accessibility**: Review semantic HTML, ARIA labels
3. **SEO**: Verify meta tags, structured data
4. **Best Practices**: Check HTTPS, CSP headers

### High LCP (>2.5s)
1. Optimize largest image/element above fold
2. Preload critical resources
3. Reduce server response times
4. Eliminate render-blocking resources

### High CLS (>0.1)
1. Set explicit dimensions for images/videos
2. Avoid injecting content above existing content
3. Use transform animations instead of layout properties

### High FID (>100ms)
1. Reduce JavaScript execution time
2. Code split large bundles
3. Use web workers for heavy computations
4. Optimize third-party scripts

## Performance Baseline Metrics

### Current Production Status
- **Bundle Size**: 783KB (within 800KB limit)
- **CSS Size**: 98KB (within 100KB limit)
- **Total Chunks**: ~40 JavaScript files
- **Build Time**: ~36 seconds
- **Dev Server Start**: ~1.3 seconds

### Target Improvements
- Reduce main bundle to <600KB
- Implement lazy loading for images
- Achieve 95+ Lighthouse performance score
- Reduce LCP to <2 seconds
- Maintain build time <30 seconds

## Emergency Performance Response

### Immediate Actions for Performance Crisis
1. **Identify Impact**: Which pages/users affected?
2. **Quick Fixes**: 
   - Enable/verify compression
   - Add critical resource preloading
   - Quick image optimizations
3. **Rollback**: If severe, consider reverting recent changes
4. **Monitor**: Watch real user metrics during fixes

### Escalation Path
1. **Level 1**: Development team optimization
2. **Level 2**: Infrastructure/CDN optimization
3. **Level 3**: Architecture review for major refactoring

## Resources

- [Web.dev Performance Guidelines](https://web.dev/performance/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html#build-optimizations)
- [Lighthouse Performance Scoring](https://web.dev/performance-scoring/)

---

**Last Updated**: August 2025  
**Owner**: Development Team  
**Review Frequency**: Monthly