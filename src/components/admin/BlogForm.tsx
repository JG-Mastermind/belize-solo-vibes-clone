import React, { useState, Suspense, lazy, ErrorBoundary } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TranslationButton, TranslationStatus } from '@/components/ui/translation-button';
import { useTranslation } from '@/hooks/useTranslation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
import { Save, Eye, Languages, AlertCircle, ChevronDown, ChevronRight, Sparkles, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

// Simple error boundary for lazy-loaded components
class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('BlogForm component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Component failed to load. Please refresh the page.</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
  tags?: string;
  meta_description?: string;
  meta_description_fr?: string;
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
    tags: '',
    meta_description: '',
    meta_description_fr: '',
    ...initialData
  });

  const [seoKeywords, setSeoKeywords] = useState<string>('');
  const [showFrenchContent, setShowFrenchContent] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(''); // Use string for accordion value
  const [showSEOMetadata, setShowSEOMetadata] = useState(false);

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
      // Success toast and navigation handled by parent component
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

  const handleMarkdownImport = (content: string) => {
    updateField('content', content);
    toast.success('Markdown content imported successfully!');
  };

  const exportToMarkdown = () => {
    const { title, content, author, tags } = formData;
    const markdownContent = `# ${title}\n\n**Author:** ${author}\n${tags ? `**Tags:** ${tags}\n` : ''}\n${content.replace(/<[^>]*>/g, '')}\n`;
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.slug || 'blog-post'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Markdown file exported!');
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

      {/* AI Content Assistant */}
      <Card className="dashboard-card mb-6">
        <Accordion type="single" collapsible value={showAIAssistant} onValueChange={setShowAIAssistant}>
          <AccordionItem value="ai-assistant" className="border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">✨ AI Content Assistant</span>
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  Generate content, images, and SEO analysis on-demand
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6">
                <ComponentErrorBoundary>
                  <Suspense fallback={
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-64 w-full">
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading AI Content Assistant...</div>
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
                    />
                  </Suspense>
                </ComponentErrorBoundary>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
            <Label htmlFor="category_id">Category</Label>
            <Select value={formData.category_id || ''} onValueChange={(value) => updateField('category_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="wildlife">Wildlife</SelectItem>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="travel-tips">Travel Tips</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder="belize travel, adventure tours, caribbean"
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
          <CardTitle>
            🇺🇸 English Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2">
              <Label htmlFor="title">Title</Label>
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
            <div className="mb-2">
              <Label htmlFor="excerpt">Excerpt</Label>
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
            <div className="mb-2">
              <Label htmlFor="content">Content</Label>
            </div>
            <ComponentErrorBoundary>
              <Suspense fallback={
                <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-48 w-full">
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                    <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Loading rich text editor...</div>
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
                  onMarkdownImport={handleMarkdownImport}
                />
              </Suspense>
            </ComponentErrorBoundary>
          </div>
        </CardContent>
      </Card>

      {/* French Content */}
      <Card className="dashboard-card">
        <Collapsible open={showFrenchContent} onOpenChange={setShowFrenchContent}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:shadow-md transition-shadow">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showFrenchContent ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  🇫🇷 Add French Translation
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTranslateAll('fr');
                  }}
                  disabled={isTranslating}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  🇫🇷 Translate All
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="dashboard-card mt-2">
            <CardContent className="space-y-4 pt-6">
          <div>
            <div className="mb-2">
              <Label htmlFor="title_fr">Title (Titre)</Label>
            </div>
            <Input
              id="title_fr"
              value={formData.title_fr}
              onChange={(e) => updateField('title_fr', e.target.value)}
              placeholder="Titre du blog en français"
            />
          </div>

          <div>
            <div className="mb-2">
              <Label htmlFor="excerpt_fr">Excerpt (Extrait)</Label>
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
            <div className="mb-2">
              <Label htmlFor="content_fr">Content (Contenu)</Label>
            </div>
            <ComponentErrorBoundary>
              <Suspense fallback={
                <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-48 w-full">
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                    <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Chargement de l'éditeur de texte...</div>
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
                  onMarkdownImport={(content) => updateField('content_fr', content)}
                />
              </Suspense>
            </ComponentErrorBoundary>
          </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* SEO & Metadata */}
      <Card className="dashboard-card">
        <Collapsible open={showSEOMetadata} onOpenChange={setShowSEOMetadata}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:shadow-md transition-shadow">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showSEOMetadata ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  🎯 SEO & Metadata
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    exportToMarkdown();
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export MD
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_description">Meta Description (English)</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  placeholder="Brief SEO description for search engines (150-160 characters)"
                  rows={2}
                  maxLength={160}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {(formData.meta_description?.length || 0)}/160 characters
                </div>
              </div>

              <div>
                <Label htmlFor="meta_description_fr">Meta Description (French)</Label>
                <Textarea
                  id="meta_description_fr"
                  value={formData.meta_description_fr}
                  onChange={(e) => updateField('meta_description_fr', e.target.value)}
                  placeholder="Description SEO brève pour les moteurs de recherche (150-160 caractères)"
                  rows={2}
                  maxLength={160}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {(formData.meta_description_fr?.length || 0)}/160 caractères
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Primary Actions - Enhanced but Simple */}
      <Card className="dashboard-card border-t-2 border-primary/20 bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => updateField('status', formData.status === 'draft' ? 'published' : 'draft')}
                size="sm"
              >
                {formData.status === 'draft' ? 'Mark as Published' : 'Mark as Draft'}
              </Button>
              {onPreview && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onPreview(formData)}
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || isTranslating}
              className="flex items-center gap-2 font-semibold"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Blog Post'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};