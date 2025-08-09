'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Strikethrough
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ImprovedRichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing your content...",
  className = ""
}: RichTextEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-sm my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] px-6 py-4 bg-white',
      },
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);
    
    setLinkText(text);
    setLinkUrl(editor.getAttributes('link').href || '');
    setLinkDialogOpen(true);
  }, [editor]);

  const insertLink = useCallback(() => {
    if (!editor || !linkUrl) return;

    if (linkText) {
      // Insert new text with link
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
    } else {
      // Add link to selected text
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }

    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkText('');
  }, [editor, linkUrl, linkText]);

  const addImage = useCallback(() => {
    if (!editor) return;
    setImageDialogOpen(true);
  }, [editor]);

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl) return;

    editor.chain().focus().setImage({ 
      src: imageUrl, 
      alt: imageAlt || 'Image' 
    }).run();

    setImageDialogOpen(false);
    setImageUrl('');
    setImageAlt('');
  }, [editor, imageUrl, imageAlt]);

  if (!editor) {
    return (
      <div className={`border border-gray-300 rounded-lg ${className}`}>
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    title, 
    children 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        p-2.5 rounded-md hover:bg-gray-100 transition-colors
        ${isActive ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'text-gray-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className={`border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 ${className}`}>
      {/* Enhanced Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50/50">
        <div className="flex flex-wrap gap-1 items-center">
          {/* Text Formatting Group */}
          <div className="flex gap-1 mr-3">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Headings Group */}
          <div className="flex gap-1 mr-3">
            <ToolbarButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive('paragraph')}
              title="Normal Text"
            >
              <Type className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Large Heading"
            >
              <span className="text-lg font-bold">H1</span>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Medium Heading"
            >
              <span className="text-base font-bold">H2</span>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Small Heading"
            >
              <span className="text-sm font-bold">H3</span>
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Alignment Group */}
          <div className="flex gap-1 mr-3">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Lists Group */}
          <div className="flex gap-1 mr-3">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Media Group */}
          <div className="flex gap-1 mr-3">
            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  onClick={addLink}
                  className={`
                    p-2.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer
                    ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}
                  `}
                  title="Add Link"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="linkText">Link Text (optional)</Label>
                    <Input
                      id="linkText"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Text to display"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkUrl">URL</Label>
                    <Input
                      id="linkUrl"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={insertLink} disabled={!linkUrl}>
                      Add Link
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  onClick={addImage}
                  className="p-2.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer text-gray-700"
                  title="Add Image"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageAlt">Alt Text (for accessibility)</Label>
                    <Input
                      id="imageAlt"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Describe the image"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={insertImage} disabled={!imageUrl}>
                      Add Image
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Other Actions */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Add Horizontal Line"
            >
              <Minus className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Word Count and Status */}
      <div className="border-t border-gray-200 px-6 py-2 bg-gray-50/50 text-sm text-gray-500 flex justify-between">
        <span>
          {editor.storage.characterCount?.characters() || 0} characters, {editor.storage.characterCount?.words() || 0} words
        </span>
        <span className="text-xs">
          💡 Tip: Use headings to structure your content for better readability
        </span>
      </div>
    </div>
  );
} 