import React, { useCallback, useState, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import { marked } from 'marked';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic,
  Underline as UnderlineIcon,
  Strikethrough, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Type as Heading4,
  Type as Heading5,
  Type as Heading6,
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
  Upload,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Indent,
  Outdent,
  Pin
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
  const [, forceUpdate] = useState({});
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const editor = useEditor({
    extensions: [
      // Configure StarterKit with custom HTMLAttributes for existing extensions
      StarterKit.configure({
        // Configure built-in extensions with custom styling
        heading: {
          levels: [1, 2, 3, 4, 5, 6], // Explicit H1-H6 support for SEO headings
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm border',
          },
        },
        // Link is included in StarterKit v3 by default
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer',
          },
        },
      }),
      
      // Additional extensions not included in StarterKit
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'px-1 rounded bg-yellow-200 dark:bg-yellow-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
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
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      updateContentStats(html);
    },
    onSelectionUpdate: ({ editor }) => {
      // Force re-render to update button active states when cursor moves
      forceUpdate({});
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

  // Sync editor content when value prop changes (only when not focused)
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

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
        reader.onload = async (e) => {
          const markdown = e.target?.result as string;
          if (markdown && editor) {
            try {
              // Use marked to convert markdown to HTML with enhanced heading support
              const html = await marked.parse(markdown, {
                async: true,
                breaks: true,
                gfm: true,
                headerIds: true, // Enable heading IDs for SEO
                headerPrefix: 'heading-' // Prefix for better SEO structure
              });
              
              // Validate heading structure for SEO feedback
              const validateMarkdownStructure = (htmlContent: string) => {
                const headingMatches = htmlContent.match(/<h[1-6][^>]*>/g) || [];
                const headingCount = headingMatches.length;
                
                if (headingCount === 0) {
                  toast.warning('No headings detected. Consider adding headings for better SEO structure.');
                } else if (headingCount > 0) {
                  const levels = headingMatches.map(h => parseInt(h.match(/h([1-6])/)?.[1] || '1'));
                  const uniqueLevels = [...new Set(levels)].sort();
                  toast.success(`✅ Imported ${headingCount} headings (H${uniqueLevels.join(', H')}) - Great for SEO!`);
                }
                
                return htmlContent;
              };
              
              const validatedHtml = validateMarkdownStructure(html);
              
              // Use TipTap's native setContent with the parsed HTML
              editor.commands.setContent(validatedHtml);
              onChange(validatedHtml);
              
              if (onMarkdownImport) {
                onMarkdownImport(validatedHtml);
              }
              
              toast.success('🌴 Markdown file imported successfully for BelizeVibes!');
            } catch (parseError) {
              console.error('Error parsing markdown:', parseError);
              toast.error('Failed to parse markdown content. Please check file format.');
            }
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
            title="Bold Text (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''}
            title="Italic Text (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-accent text-accent-foreground' : ''}
            title="Underline Text (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-accent text-accent-foreground' : ''}
            title="Strikethrough Text"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Text Alignment */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-accent-foreground' : ''}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-accent-foreground' : ''}
            title="Center Text"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-accent-foreground' : ''}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Text Highlighting */}
          <div className="relative group">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Highlight Text - Add background color to emphasize content"
              className="relative"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="grid grid-cols-4 gap-1 w-32">
                {[
                  '#FEF3C7', '#FBBF24', '#F59E0B', '#D97706',
                  '#FDE68A', '#84CC16', '#22C55E', '#10B981',
                  '#67E8F9', '#06B6D4', '#0EA5E9', '#3B82F6',
                  '#A78BFA', '#8B5CF6', '#A855F7', '#D946EF'
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                    title={`Highlight with ${color}`}
                  />
                ))}
                <button
                  type="button"
                  className="w-6 h-6 rounded border-2 border-gray-400 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-xs font-bold"
                  onClick={() => editor.chain().focus().unsetHighlight().run()}
                  title="Remove highlight"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Indent Controls - Simple and working */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor) {
                editor.chain().focus().sinkListItem('listItem').run();
              }
            }}
            title="Indent List Item"
          >
            <Indent className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor) {
                editor.chain().focus().liftListItem('listItem').run();
              }
            }}
            title="Outdent List Item"
          >
            <Outdent className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground shadow-sm border-primary' : 'hover:bg-accent'}
            title="Large Heading (H1)"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground shadow-sm border-primary' : 'hover:bg-accent'}
            title="Medium Heading (H2)"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-primary text-primary-foreground shadow-sm border-primary' : 'hover:bg-accent'}
            title="Small Heading (H3)"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={editor.isActive('heading', { level: 4 }) ? 'bg-primary text-primary-foreground shadow-sm border-primary' : 'hover:bg-accent'}
            title="Subheading (H4) - Perfect for SEO structure"
          >
            <Heading4 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={editor.isActive('heading', { level: 5 }) ? 'bg-primary text-primary-foreground shadow-sm border-primary' : 'hover:bg-accent'}
            title="Minor Heading (H5) - Great for detailed sections"
          >
            <Heading5 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            className={editor.isActive('heading', { level: 6 }) ? 'bg-primary text-primary-foreground shadow-sm border-primary' : 'hover:bg-accent'}
            title="Smallest Heading (H6) - For fine details"
          >
            <Heading6 className="h-4 w-4" />
          </Button>

          <div className="relative group">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Text Color - Change text color for emphasis and styling"
              className="relative"
            >
              <Palette className="h-4 w-4" />
            </Button>
            <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="grid grid-cols-8 gap-1 w-48">
                {[
                  '#000000', '#374151', '#6B7280', '#9CA3AF',
                  '#DC2626', '#EA580C', '#D97706', '#CA8A04',
                  '#65A30D', '#16A34A', '#059669', '#0D9488',
                  '#0284C7', '#2563EB', '#4F46E5', '#7C3AED',
                  '#C026D3', '#DB2777', '#E11D48', '#DC2626',
                  '#F87171', '#FB923C', '#FBBF24', '#A3E635',
                  '#34D399', '#22D3EE', '#60A5FA', '#A78BFA'
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    title={`Apply color ${color}`}
                  />
                ))}
                <button
                  type="button"
                  className="w-6 h-6 rounded border-2 border-gray-400 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-xs font-bold"
                  onClick={() => editor.chain().focus().unsetColor().run()}
                  title="Remove text color"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-primary text-primary-foreground shadow-sm border-primary' : 'hover:bg-accent'}
            title="Bullet List - Create unordered list with bullet points"
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-primary text-primary-foreground shadow-sm border-primary' : 'hover:bg-accent'}
            title="Numbered List - Create ordered list with numbers"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-accent text-accent-foreground' : ''}
            title="Quote Block - Highlight important quotes or citations"
          >
            <Quote className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-accent text-accent-foreground' : ''}
            title="Code Block - Insert programming code with syntax highlighting"
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
            title="Add Link - Insert hyperlink to external websites or pages"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
            title="Upload Image - Add photos to your blog post"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addTable}
            title="Insert Table - Create data table with rows and columns"
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

          {/* Floating Toolbar Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowFloatingToolbar(!showFloatingToolbar)}
            className={showFloatingToolbar ? 'bg-accent text-accent-foreground' : ''}
            title={showFloatingToolbar ? 'Hide Sticky Toolbar' : 'Pin Sticky Toolbar - Keep essential tools visible while scrolling through long content'}
          >
            <Pin className={`h-4 w-4 ${showFloatingToolbar ? 'rotate-45' : ''} transition-transform`} />
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

        {/* Fixed Floating Toolbar - Always visible while scrolling */}
        {showFloatingToolbar && editor && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="bg-card dark:bg-gray-800 border border-border rounded-xl shadow-xl backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
              <div className="flex flex-wrap items-center gap-1 p-3">
                {/* Essential Formatting */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-9 w-9 p-0 rounded-lg ${editor.isActive('bold') ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-9 w-9 p-0 rounded-lg ${editor.isActive('italic') ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`h-9 w-9 p-0 rounded-lg ${editor.isActive('underline') ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Underline (Ctrl+U)"
                  >
                    <UnderlineIcon className="h-4 w-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />
                
                {/* Headings */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`h-9 px-2 rounded-lg text-sm font-medium ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Heading 1"
                  >
                    H1
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`h-9 px-2 rounded-lg text-sm font-medium ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Heading 2"
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`h-9 px-2 rounded-lg text-sm font-medium ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Heading 3"
                  >
                    H3
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={`h-9 px-2 rounded-lg text-sm font-medium ${editor.isActive('heading', { level: 4 }) ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Heading 4 - SEO Subheading"
                  >
                    H4
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={`h-9 px-2 rounded-lg text-sm font-medium ${editor.isActive('heading', { level: 5 }) ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Heading 5 - Detail Section"
                  >
                    H5
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={`h-9 px-2 rounded-lg text-sm font-medium ${editor.isActive('heading', { level: 6 }) ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Heading 6 - Fine Details"
                  >
                    H6
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />
                
                {/* Lists */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-9 w-9 p-0 rounded-lg ${editor.isActive('bulletList') ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-9 w-9 p-0 rounded-lg ${editor.isActive('orderedList') ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />
                
                {/* Additional Tools */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`h-9 w-9 p-0 rounded-lg ${editor.isActive('blockquote') ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Quote"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={`h-9 w-9 p-0 rounded-lg ${editor.isActive('link') ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent'}`}
                    title="Add Link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />
                
                {/* Content Stats - Mini */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                  <span className="bg-muted/50 px-2 py-1 rounded-md">{wordCount}w</span>
                  <span className="bg-muted/50 px-2 py-1 rounded-md">{readingTime}m</span>
                </div>

                {/* Close Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFloatingToolbar(false)}
                  className="h-9 w-9 p-0 ml-auto rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                  title="Hide Floating Toolbar"
                >
                  <Pin className="h-4 w-4 rotate-45 text-red-600 dark:text-red-400" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Editor Content */}
        <div className="p-4 min-h-[300px] bg-background dark:bg-gray-800 text-foreground">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm max-w-none focus:outline-none focus-within:ring-2 focus-within:ring-primary/20 dark:prose-invert [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-6 [&_ol]:my-2 [&_li]:my-1 [&_li]:ml-0 [&_.ProseMirror]:min-h-[250px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:cursor-text [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3 [&_h5]:text-base [&_h5]:font-semibold [&_h5]:mb-1 [&_h5]:mt-2 [&_h6]:text-sm [&_h6]:font-semibold [&_h6]:mb-1 [&_h6]:mt-2"
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