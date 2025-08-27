import React, { useCallback, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import FloatingMenu from '@tiptap/extension-floating-menu';
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
  Heading3,
  Image as ImageIcon,
  Target,
  TrendingUp,
  Eye,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Search,
  Link as LinkIcon,
  Quote,
  Code,
  Table as TableIcon,
  Type,
  FileText,
  Upload
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
  onMarkdownImport?: (content: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value,
  onChange,
  placeholder = "Write your content here...",
  seoKeywords = [],
  title = "",
  excerpt = "",
  showSEOPanel = true,
  onMarkdownImport
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
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm border',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 dark:border-gray-600 w-full my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 font-bold p-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 p-2',
        },
      }),
      FloatingMenu.configure({
        element: document.querySelector('.floating-menu'),
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

  const handleMarkdownUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const markdown = e.target?.result as string;
          if (markdown) {
            // Simple markdown to HTML conversion for basic formatting
            const html = convertMarkdownToHTML(markdown);
            if (editor) {
              editor.commands.setContent(html);
              onChange(html);
            }
            if (onMarkdownImport) {
              onMarkdownImport(html);
            }
            toast.success('Markdown file imported successfully!');
          }
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('Error importing markdown:', error);
        toast.error('Failed to import markdown file');
      }
    };

    input.click();
  }, [editor, onChange, onMarkdownImport]);

  const convertMarkdownToHTML = (markdown: string): string => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]*)`/gim, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Unordered lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n/gim, '<br>');
  };

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSEOScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const highlightKeywords = (content: string, keywords: string[]) => {
    if (keywords.length === 0) return content;
    
    let highlightedContent = content;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedContent = highlightedContent.replace(
        regex, 
        `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${keyword}</mark>`
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
      <div className="border border-border rounded-lg overflow-hidden bg-card dark:bg-gray-800 text-card-foreground">
        {/* Enhanced Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30 dark:bg-gray-700">
          {/* Text Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-accent text-accent-foreground' : ''}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : ''}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-accent text-accent-foreground' : ''}
          >
            <Quote className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-accent text-accent-foreground' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Links & Media */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={editor.isActive('link') ? 'bg-accent text-accent-foreground' : ''}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addTable}
          >
            <TableIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Import */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleMarkdownUpload}
            title="Import Markdown File"
          >
            <Upload className="h-4 w-4" />
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
        <div className="p-4 min-h-[300px] bg-background dark:bg-gray-800 text-foreground">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm max-w-none focus:outline-none dark:prose-invert"
            placeholder={placeholder}
          />
        </div>
      </div>

      {/* SEO Analysis Panel */}
      {showSEOPanel && (
        <Card className="dashboard-card">
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
                      <div className="p-3 bg-muted/30 rounded text-center">
                        <div className="text-lg font-bold">{seoAnalysis.readabilityAnalysis.fleschScore}</div>
                        <div className="text-xs text-muted-foreground">Readability</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded text-center">
                        <div className="text-lg font-bold">{Object.keys(seoAnalysis.keywordAnalysis.keywordDensity).length}</div>
                        <div className="text-xs text-muted-foreground">Keywords Found</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded text-center">
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
                          <div key={keyword} className="flex items-center justify-between p-2 bg-muted/30 rounded">
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
                          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
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
                          rec.type === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                          rec.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                          'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {rec.type === 'critical' ? 
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" /> :
                            rec.type === 'warning' ? 
                            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" /> :
                            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
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