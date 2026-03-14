'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Image, Video, Link, Unlink, List, ListOrdered, Quote,
  Code, Heading1, Heading2, Heading3, Palette, Type,
  Trash2, Plus, Eye, Edit3, Save, X
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface VisualEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start typing...',
  className = '',
  showToolbar = true,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const insertImage = useCallback((imageUrl: string, alt: string = '') => {
    if (editorRef.current) {
      const img = `<img src="${imageUrl}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />`;
      document.execCommand('insertHTML', false, img);
      onChange(editorRef.current.innerHTML);
    }
    setShowImageUpload(false);
  }, [onChange]);

  const insertLink = useCallback(() => {
    if (linkUrl && linkText && editorRef.current) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #8b5cf6; text-decoration: underline;">${linkText}</a>`;
      document.execCommand('insertHTML', false, link);
      onChange(editorRef.current.innerHTML);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  }, [linkUrl, linkText, onChange]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  }, []);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('input', handleContentChange);
      editor.addEventListener('mouseup', handleSelectionChange);
      editor.addEventListener('keyup', handleSelectionChange);
      
      return () => {
        editor.removeEventListener('input', handleContentChange);
        editor.removeEventListener('mouseup', handleSelectionChange);
        editor.removeEventListener('keyup', handleSelectionChange);
      };
    }
  }, [handleContentChange, handleSelectionChange]);

  const toolbarButtons = [
    // Text Formatting
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code' },
    
    // Headings
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Heading 3' },
    
    // Alignment
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    
    // Lists
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    
    // Media & Links
    { icon: Image, action: () => setShowImageUpload(true), title: 'Insert Image' },
    { icon: Video, command: 'insertHTML', value: '<video controls style="max-width: 100%; margin: 10px 0;">Your video here</video>', title: 'Insert Video' },
    { icon: Link, action: () => setShowLinkDialog(true), title: 'Insert Link' },
    { icon: Unlink, command: 'unlink', title: 'Remove Link' },
  ];

  return (
    <div className={`border border-white/10 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      {showToolbar && !isPreviewMode && (
        <div className="bg-white/5 border-b border-white/10 p-2">
          <div className="flex flex-wrap gap-1">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => button.action ? button.action() : execCommand(button.command!, button.value)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                title={button.title}
              >
                <button.icon size={16} />
              </button>
            ))}
            
            <div className="border-l border-white/10 mx-2" />
            
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
              title={isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
            >
              {isPreviewMode ? <Edit3 size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative min-h-[400px]">
        {isPreviewMode ? (
          <div 
            className="p-4 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[400px] p-4 focus:outline-none text-white"
            style={{ minHeight: '400px' }}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        
        {!content && !isPreviewMode && (
          <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Image Upload Dialog */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Insert Image</h3>
              <button
                onClick={() => setShowImageUpload(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <ImageUpload
              onUpload={(url, publicId) => insertImage(url, 'Uploaded image')}
              folder="content"
              className="mb-4"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowImageUpload(false)}
                className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Insert Link</h3>
              <button
                onClick={() => setShowLinkDialog(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 text-sm">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2 text-sm">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={insertLink}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Insert Link
              </button>
              <button
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
