import React, { useState, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TranslationButton, TranslationStatus } from '@/components/ui/translation-button';
import { useTranslation } from '@/hooks/useTranslation';

// Lazy load heavy TipTap editor to reduce main bundle size
const RichTextEditor = lazy(() => 
  import('@/components/admin/RichTextEditor').then(module => ({ 
    default: module.RichTextEditor 
  }))
);
const AIBlogAssistantPanel = lazy(() => 
  import('@/components/admin/AIBlogAssistantPanel').then(module => ({ 
    default: module.AIBlogAssistantPanel 
  }))
);
import { Save, Eye, Languages } from 'lucide-react';
import { toast } from 'sonner';

interface BlogFormData {
  title: string;
  title_fr: string;
  excerpt: string;
  excerpt_fr: string;
  content: string;
  content_fr: string;
  slug: string;
  author: string;
  category_id: string;
  featured_image_url: string;
  status: 'draft' | 'published';
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  onPreview?: (data: BlogFormData) => void;
  isLoading?: boolean;
  userType?: string;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSubmit,
  onPreview,
  isLoading = false,
  userType = 'blogger'
}) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    title_fr: '',
    excerpt: '',
    excerpt_fr: '',
    content: '',
    content_fr: '',
    slug: '',
    author: '',
    category_id: '',
    featured_image_url: '',
    status: 'draft',
    ...initialData
  });

  const [seoKeywords, setSeoKeywords] = useState<string>('');

  const {
    translateText,
    translateBlogPost,
    isTranslating,
    translationError,
    clearError
  } = useTranslation();

  const updateField = (field: keyof BlogFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title' && !initialData?.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleTranslateField = async (
    sourceField: keyof BlogFormData,
    targetField: keyof BlogFormData,
    targetLang: 'en' | 'fr',
    contentType: 'title' | 'excerpt' | 'content'
  ) => {
    const sourceText = formData[sourceField] as string;
    if (!sourceText.trim()) {
      toast.error(`Please enter ${contentType} before translating`);
      return;
    }

    try {
      clearError();
      const translated = await translateText(sourceText, targetLang, contentType);
      updateField(targetField, translated);
      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} translated successfully!`);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(error instanceof Error ? error.message : 'Translation failed');
    }
  };

  const handleTranslateAll = async (targetLang: 'en' | 'fr') => {
    const sourceFields = targetLang === 'fr' 
      ? { title: formData.title, excerpt: formData.excerpt, content: formData.content }
      : { title: formData.title_fr, excerpt: formData.excerpt_fr, content: formData.content_fr };

    if (!sourceFields.title.trim() || !sourceFields.excerpt.trim() || !sourceFields.content.trim()) {
      toast.error('Please fill in all fields before translating');
      return;
    }

    try {
      clearError();
      const translated = await translateBlogPost(sourceFields, targetLang);
      
      if (targetLang === 'fr') {
        setFormData(prev => ({
          ...prev,
          title_fr: translated.title,
          excerpt_fr: translated.excerpt,
          content_fr: translated.content
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          title: translated.title,
          excerpt: translated.excerpt,
          content: translated.content
        }));
      }
      
      toast.success('All content translated successfully!');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(error instanceof Error ? error.message : 'Translation failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      toast.success('Blog post saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save blog post');
    }
  };

  const handleAIGenerated = (aiData: {
    title?: string;
    title_fr?: string;
    excerpt?: string;
    excerpt_fr?: string;
    content?: string;
    content_fr?: string;
    featured_image_url?: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...(aiData.title && { title: aiData.title }),
      ...(aiData.title_fr && { title_fr: aiData.title_fr }),
      ...(aiData.excerpt && { excerpt: aiData.excerpt }),
      ...(aiData.excerpt_fr && { excerpt_fr: aiData.excerpt_fr }),
      ...(aiData.content && { content: aiData.content }),
      ...(aiData.content_fr && { content_fr: aiData.content_fr }),
      ...(aiData.featured_image_url && { featured_image_url: aiData.featured_image_url })
    }));
    
    // Auto-generate slug if title was updated
    if (aiData.title && !initialData?.slug) {
      const slug = aiData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Translation Status */}
      <TranslationStatus
        isTranslating={isTranslating}
        error={translationError}
        onRetry={() => clearError()}
        className="mb-4"
      />

      {/* AI Blog Assistant Panel */}
      <Suspense fallback={
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-64 w-full mb-6">
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      }>
        <AIBlogAssistantPanel
          userType={userType}
          onUseGenerated={handleAIGenerated}
          currentContent={{
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content
          }}
          className="mb-6"
        />
      </Suspense>

      {/* Bulk Translation */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Quick Translation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => handleTranslateAll('fr')}
              disabled={isTranslating}
              variant="outline"
              className="flex items-center gap-2"
            >
              🇫🇷 Translate All to French
            </Button>
            <Button
              type="button"
              onClick={() => handleTranslateAll('en')}
              disabled={isTranslating}
              variant="outline"
              className="flex items-center gap-2"
            >
              🇺🇸 Translate All to English
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="Author name"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="url-friendly-slug"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="featured_image_url">Featured Image URL</Label>
            <Input
              id="featured_image_url"
              value={formData.featured_image_url}
              onChange={(e) => updateField('featured_image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="seo_keywords">SEO Keywords (comma-separated)</Label>
            <Input
              id="seo_keywords"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="belize travel, adventure tours, caribbean"
            />
          </div>
        </CardContent>
      </Card>

      {/* English Content */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🇺🇸 English Content
            <TranslationButton
              onClick={() => handleTranslateAll('en')}
              isLoading={isTranslating}
              targetLanguage="en"
              variant="ghost"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="title">Title</Label>
              <TranslationButton
                onClick={() => handleTranslateField('title_fr', 'title', 'en', 'title')}
                isLoading={isTranslating}
                targetLanguage="en"
                size="sm"
              />
            </div>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Blog post title"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <TranslationButton
                onClick={() => handleTranslateField('excerpt_fr', 'excerpt', 'en', 'excerpt')}
                isLoading={isTranslating}
                targetLanguage="en"
                size="sm"
              />
            </div>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => updateField('excerpt', e.target.value)}
              placeholder="Brief description of the blog post"
              rows={3}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content">Content</Label>
              <TranslationButton
                onClick={() => handleTranslateField('content_fr', 'content', 'en', 'content')}
                isLoading={isTranslating}
                targetLanguage="en"
                size="sm"
              />
            </div>
            <Suspense fallback={
              <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-48 w-full">
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            }>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => updateField('content', value)}
                placeholder="Write your blog post content here..."
                seoKeywords={seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)}
                title={formData.title}
                excerpt={formData.excerpt}
                showSEOPanel={true}
              />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* French Content */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🇫🇷 French Content (Contenu Français)
            <TranslationButton
              onClick={() => handleTranslateAll('fr')}
              isLoading={isTranslating}
              targetLanguage="fr"
              variant="ghost"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="title_fr">Title (Titre)</Label>
              <TranslationButton
                onClick={() => handleTranslateField('title', 'title_fr', 'fr', 'title')}
                isLoading={isTranslating}
                targetLanguage="fr"
                size="sm"
              />
            </div>
            <Input
              id="title_fr"
              value={formData.title_fr}
              onChange={(e) => updateField('title_fr', e.target.value)}
              placeholder="Titre du blog en français"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="excerpt_fr">Excerpt (Extrait)</Label>
              <TranslationButton
                onClick={() => handleTranslateField('excerpt', 'excerpt_fr', 'fr', 'excerpt')}
                isLoading={isTranslating}
                targetLanguage="fr"
                size="sm"
              />
            </div>
            <Textarea
              id="excerpt_fr"
              value={formData.excerpt_fr}
              onChange={(e) => updateField('excerpt_fr', e.target.value)}
              placeholder="Brève description du blog en français"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content_fr">Content (Contenu)</Label>
              <TranslationButton
                onClick={() => handleTranslateField('content', 'content_fr', 'fr', 'content')}
                isLoading={isTranslating}
                targetLanguage="fr"
                size="sm"
              />
            </div>
            <Suspense fallback={
              <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-48 w-full">
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            }>
              <RichTextEditor
                value={formData.content_fr}
                onChange={(value) => updateField('content_fr', value)}
                placeholder="Écrivez le contenu de votre blog en français ici..."
                seoKeywords={seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)}
                title={formData.title_fr}
                excerpt={formData.excerpt_fr}
                showSEOPanel={false}
              />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => updateField('status', formData.status === 'draft' ? 'published' : 'draft')}
          >
            {formData.status === 'draft' ? 'Mark as Published' : 'Mark as Draft'}
          </Button>
          {onPreview && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onPreview(formData)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
        </div>

        <Button type="submit" disabled={isLoading || isTranslating}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Blog Post'}
        </Button>
      </div>
    </form>
  );
};