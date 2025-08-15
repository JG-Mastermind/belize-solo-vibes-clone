import React, { useCallback, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Image as ImageIcon,
  Target,
  TrendingUp,
  Eye,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { analyzeBlogSEO, type SEOAnalysisResult } from '@/lib/ai/generateBlogSEO';
import { toast } from 'sonner';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  seoKeywords?: string[];
  title?: string;
  excerpt?: string;
  showSEOPanel?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value,
  onChange,
  placeholder = "Write your content here...",
  seoKeywords = [],
  title = "",
  excerpt = "",
  showSEOPanel = true
}) => {
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      updateContentStats(html);
    },
  });

  // Update content statistics
  const updateContentStats = useCallback((content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200); // Average reading speed
    
    setWordCount(words);
    setReadingTime(readTime);
  }, []);

  // Perform SEO analysis
  const performSEOAnalysis = useCallback(async () => {
    if (!title || !value || seoKeywords.length === 0) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeBlogSEO({
        title,
        content: value,
        excerpt: excerpt || value.substring(0, 200),
        targetKeywords: seoKeywords,
        language: 'en'
      });
      
      setSeoAnalysis(analysis);
    } catch (error) {
      console.error('SEO analysis failed:', error);
      toast.error('SEO analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [title, value, excerpt, seoKeywords]);

  // Auto-analyze on content changes (debounced)
  useEffect(() => {
    if (!showSEOPanel) return;
    
    const timer = setTimeout(() => {
      if (title && value && seoKeywords.length > 0) {
        performSEOAnalysis();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, value, seoKeywords, showSEOPanel, performSEOAnalysis]);

  // Initialize content stats
  useEffect(() => {
    updateContentStats(value);
  }, [value, updateContentStats]);

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `blog-${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('tours')
          .upload(`blog-images/${fileName}`, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('tours')
          .getPublicUrl(data.path);

        if (editor) {
          editor.chain().focus().setImage({ src: publicUrl }).run();
        }
        
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    };

    input.click();
  }, [editor]);

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSEOScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const highlightKeywords = (content: string, keywords: string[]) => {
    if (keywords.length === 0) return content;
    
    let highlightedContent = content;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedContent = highlightedContent.replace(
        regex, 
        `<mark class="bg-yellow-200 px-1 rounded">${keyword}</mark>`
      );
    });
    
    return highlightedContent;
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Editor with enhanced toolbar */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Content Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
            <span>{wordCount} words</span>
            <span>{readingTime} min read</span>
            {seoKeywords.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {seoKeywords.length} SEO keywords
              </Badge>
            )}
          </div>
        </div>
        
        {/* Editor Content */}
        <div className="p-4 min-h-[300px]">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm max-w-none focus:outline-none"
            placeholder={placeholder}
          />
        </div>
      </div>

      {/* SEO Analysis Panel */}
      {showSEOPanel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              SEO Analysis
              {isAnalyzing && (
                <Badge variant="outline" className="text-xs">
                  Analyzing...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {seoKeywords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Add SEO keywords to see analysis</p>
              </div>
            ) : !seoAnalysis ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Start writing to see SEO analysis</p>
              </div>
            ) : (
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div className="space-y-4">
                    {/* SEO Score */}
                    <div className={`p-4 rounded-lg ${getSEOScoreBg(seoAnalysis.score)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">SEO Score</h3>
                          <p className="text-sm text-muted-foreground">Overall optimization</p>
                        </div>
                        <div className={`text-2xl font-bold ${getSEOScoreColor(seoAnalysis.score)}`}>
                          {seoAnalysis.score}/100
                        </div>
                      </div>
                      <Progress value={seoAnalysis.score} className="mt-2" />
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-muted/50 rounded text-center">
                        <div className="text-lg font-bold">{seoAnalysis.readabilityAnalysis.fleschScore}</div>
                        <div className="text-xs text-muted-foreground">Readability</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded text-center">
                        <div className="text-lg font-bold">{Object.keys(seoAnalysis.keywordAnalysis.keywordDensity).length}</div>
                        <div className="text-xs text-muted-foreground">Keywords Found</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded text-center">
                        <div className="text-lg font-bold">{seoAnalysis.readabilityAnalysis.gradeLevel}</div>
                        <div className="text-xs text-muted-foreground">Reading Level</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="keywords" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Keyword Density</h4>
                      <div className="space-y-2">
                        {Object.entries(seoAnalysis.keywordAnalysis.keywordDensity).map(([keyword, density]) => (
                          <div key={keyword} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm">{keyword}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={Math.min(density * 33, 100)} className="w-16" />
                              <span className="text-sm font-medium">{density}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {seoAnalysis.keywordAnalysis.missingKeywords.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {seoAnalysis.keywordAnalysis.missingKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="suggestions" className="mt-4">
                  <div className="space-y-3">
                    {seoAnalysis.recommendations.slice(0, 5).map((rec, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded border-l-4 ${
                          rec.type === 'critical' ? 'border-red-500 bg-red-50' :
                          rec.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                          'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {rec.type === 'critical' ? 
                            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" /> :
                            rec.type === 'warning' ? 
                            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" /> :
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                          }
                          <div className="flex-1">
                            <p className="font-medium text-sm">{rec.issue}</p>
                            <p className="text-xs text-muted-foreground mt-1">{rec.solution}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};