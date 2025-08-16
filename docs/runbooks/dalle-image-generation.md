# DALL-E Image Generation Admin Guide

## Overview
The DALL-E Image Generator is an integrated AI-powered tool for creating custom images for blog posts and adventures using OpenAI's DALL-E 3 model.

## Access Control
- **Super Admin**: Full access to all features
- **Admin**: Full access to all features
- **Blogger**: Full access to all features
- **Other roles**: No access

## Location
The DALL-E Image Generator appears as a purple-bordered section within the AI Blog Assistant Panel at:
- **Blog Creation**: `/admin/blog/new`
- **Blog Editing**: `/admin/blog/edit/:id`

## Features

### Image Generation Options
1. **Number of Images**: Generate 1-4 images per request
2. **Size Options**:
   - Landscape (16:9) - 1792x1024px - Best for featured images
   - Square (1:1) - 1024x1024px - Good for social media
   - Portrait (9:16) - 1024x1792px - Good for mobile layouts

3. **Style Options**:
   - **Photo Realistic**: Professional photography style
   - **Artistic**: Painterly, creative interpretation
   - **Landscape**: Scenic, natural composition
   - **Infographic**: Clean, informational design

4. **Mood Options**:
   - **Vibrant**: Bright, energetic colors
   - **Serene**: Peaceful, tranquil atmosphere
   - **Adventurous**: Dynamic, exciting energy
   - **Cultural**: Authentic, traditional feel

### Prompt Suggestions
The system provides intelligent prompt suggestions based on:
- Current blog title and content
- Belize-specific themes (beaches, jungle, maya ruins, diving)
- Tourism and adventure keywords

### Image Management
- **Preview**: View generated images before selection
- **Select**: Click on any image to select it
- **Regenerate**: Individual image regeneration without affecting others
- **Use Image**: Apply selected image to blog post

## Technical Details

### Backend Integration
- **Edge Function**: `generate-blog-image` (Supabase)
- **AI Model**: OpenAI DALL-E 3
- **Storage**: Supabase Storage bucket `tours/blog-images/`
- **Fallback**: High-quality Unsplash images with Belize themes

### Quality Assurance
- Automatic Belize context injection
- Content-based prompt enhancement
- Professional composition settings
- Safety filters enabled
- Optimized for tourism content

### Cost Management
- Images are only generated on explicit user request
- Maximum 4 images per generation request
- Fallback system prevents API failures from blocking workflow

## Usage Workflow

### For New Blog Posts
1. Enter blog title and excerpt in main form
2. Navigate to AI Blog Assistant Panel
3. DALL-E Image Generator will suggest prompts based on content
4. Customize style, mood, and size preferences
5. Generate 1-4 images
6. Select preferred image
7. Click "Use Selected Image" to apply to blog post

### For Existing Blog Posts
1. The generator will use existing title/content for smart suggestions
2. Can override with custom prompts
3. Images automatically optimized for blog format
4. Applied images replace current featured image

### Custom Prompts
For specific image needs:
1. Clear the auto-suggested prompt
2. Write detailed description including:
   - Setting (beach, jungle, ruins, etc.)
   - Activities (snorkeling, hiking, dining)
   - Mood and atmosphere
   - Specific Belize elements desired

## Best Practices

### Effective Prompts
- **Good**: "Crystal clear turquoise waters at a pristine Belize beach with palm trees and a traditional wooden pier"
- **Better**: "Stunning Caribbean beach in Belize showing snorkelers in crystal clear water with colorful coral reef visible below"

### Style Selection Guide
- **Blog Headers**: Use Landscape (16:9) with Photo Realistic style
- **Social Media**: Use Square (1:1) with Vibrant mood
- **Mobile Content**: Use Portrait (9:16) for vertical layouts
- **Cultural Content**: Use Cultural mood with Photo Realistic style

### Content Optimization
- Generated images include SEO-optimized alt text
- File names are automatically SEO-friendly
- Images are properly sized for web delivery
- Captions include Belize Solo Vibes branding

## Troubleshooting

### Common Issues
1. **No images generated**: Check internet connection, try simpler prompt
2. **Low quality images**: Use "Photo Realistic" style with specific descriptions
3. **Off-brand images**: Ensure Belize context is mentioned in prompt
4. **Slow generation**: Normal for high-quality AI generation (30-60 seconds)

### Error Recovery
- Automatic fallback to curated Unsplash images
- Individual image regeneration available
- No impact on blog post saving if image generation fails

### OpenAI API Issues
If DALL-E API is unavailable:
- System automatically provides fallback images
- User is notified but can continue workflow
- Fallback images are hand-curated for Belize content

## API Configuration

### Environment Variables Required
```
OPENAI_API_KEY=your_dalle_api_key_here
```

### Rate Limits
- DALL-E 3: 50 requests per minute
- Built-in rate limiting prevents API abuse
- Batch generation for multiple images

### Cost Monitoring
- DALL-E 3 costs approximately $0.04 per image (1024x1024)
- HD quality costs $0.08 per image
- Monitor usage through OpenAI dashboard
- Consider implementing usage quotas for cost control

## Security Considerations

### Content Safety
- OpenAI safety filters automatically applied
- Content reviewed for appropriateness
- Belize tourism context helps ensure appropriate content

### Access Control
- Role-based access prevents unauthorized usage
- API key securely stored in environment variables
- No direct API access from frontend

### Data Privacy
- Generated images stored in secure Supabase Storage
- No sensitive user data sent to OpenAI
- Images are public-accessible for web display

## Support and Maintenance

### Regular Maintenance
- Monitor OpenAI API usage and costs
- Review generated image quality periodically
- Update prompt templates based on user feedback
- Clean up unused generated images in storage

### Performance Monitoring
- Track generation success rates
- Monitor API response times
- Log errors for troubleshooting
- User feedback collection

For technical issues, contact the development team with specific error messages and reproduction steps.