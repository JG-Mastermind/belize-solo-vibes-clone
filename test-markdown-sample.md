# Sample Markdown Document

This is a **test markdown file** to verify the new markdown import functionality works correctly.

## Features to Test

- **Bold text** with `marked` parser
- *Italic text* rendering 
- Code blocks with syntax:

```javascript
const markdown = await marked.parse(content, {
  async: true,
  breaks: true,
  gfm: true
});
```

### Lists and Links

1. Ordered list item
2. Another ordered item
   - Nested bullet point
   - [Link to Belize](https://www.belize.com)

> This is a blockquote to test proper markdown parsing
> with the new `marked` integration in TipTap v3.

## Code Implementation

The new implementation uses:
- `marked` library for proper markdown parsing
- TipTap's native `setContent()` method
- Async processing with proper error handling
- No more flawed regex-based conversion

**Result**: Real markdown processing instead of mock functionality! 🚀