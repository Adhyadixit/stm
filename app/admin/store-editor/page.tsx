'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Save, Monitor, Smartphone, Tablet,
  ArrowLeft, RefreshCw, Edit3, Type, Image as ImageIcon,
  ChevronDown, Eye, X, Check
} from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';

interface EditableSection {
  id: string;
  page: string;
  selector: string;
  label: string;
  content: string;
  type: 'text' | 'image';
}

export default function StoreEditor() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentPage, setCurrentPage] = useState('/');
  const [iframeKey, setIframeKey] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedElement, setSelectedElement] = useState<EditableSection | null>(null);
  const [editValue, setEditValue] = useState('');
  const [changes, setChanges] = useState<EditableSection[]>([]);

  const pages: {
    path: string;
    name: string;
    sections: {
      id: string;
      selector: string;
      label: string;
      type: 'text' | 'image';
    }[];
  }[] = [
    { path: '/', name: 'Homepage', sections: [
      { id: 'hero-title', selector: 'main h1', label: 'Hero Title', type: 'text' },
      { id: 'hero-subtitle', selector: 'main p', label: 'Hero Subtitle', type: 'text' },
      { id: 'cta-text', selector: 'main a[href="/events"]', label: 'CTA Button', type: 'text' },
    ]},
    { path: '/events', name: 'Events', sections: [
      { id: 'events-title', selector: 'h1', label: 'Page Title', type: 'text' },
    ]},
    { path: '/gallery', name: 'Gallery', sections: [
      { id: 'gallery-title', selector: 'h1', label: 'Page Title', type: 'text' },
    ]},
    { path: '/services', name: 'Services', sections: [
      { id: 'services-title', selector: 'h1', label: 'Page Title', type: 'text' },
    ]},
    { path: '/equipment', name: 'Equipment', sections: [
      { id: 'equipment-title', selector: 'h1', label: 'Page Title', type: 'text' },
    ]},
    { path: '/about', name: 'About', sections: [
      { id: 'about-title', selector: 'h1', label: 'Page Title', type: 'text' },
    ]},
    { path: '/djs', name: 'Resident DJs', sections: [
      { id: 'djs-title', selector: 'h1', label: 'Page Title', type: 'text' },
    ]},
    { path: '/contact', name: 'Contact', sections: [
      { id: 'contact-title', selector: 'h1', label: 'Page Title', type: 'text' },
    ]},
  ];

  const getDeviceDimensions = () => {
    switch (deviceView) {
      case 'mobile': return { width: '375px', height: '812px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      default: return { width: '100%', height: '100%' };
    }
  };

  const currentPageData = pages.find(p => p.path === currentPage);

  const applyChange = () => {
    if (!selectedElement) return;
    
    const change: EditableSection = {
      ...selectedElement,
      content: editValue
    };

    setChanges(prev => {
      const filtered = prev.filter(c => c.id !== selectedElement.id);
      return [...filtered, change];
    });

    // Apply to iframe
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      const script = `
        (function() {
          const el = document.querySelector('${selectedElement.selector}');
          if (el) {
            if ('${selectedElement.type}' === 'image') {
              el.src = '${editValue}';
            } else {
              el.textContent = '${editValue.replace(/'/g, "\\'")}';
            }
          }
        })();
      `;
      try {
        const win = iframe.contentWindow as any;
        if (win.eval) win.eval(script);
      } catch (e) {
        console.error('Failed to apply change:', e);
      }
    }
    
    setShowEditor(false);
    setSelectedElement(null);
  };

  const discardChange = (id: string) => {
    const change = changes.find(c => c.id === id);
    if (change) {
      // Revert in iframe
      const iframe = iframeRef.current;
      if (iframe?.contentWindow) {
        // Would need original content to revert - simplified for now
        setIframeKey(prev => prev + 1);
      }
    }
    setChanges(prev => prev.filter(c => c.id !== id));
  };

  const saveChanges = async () => {
    console.log('Saving changes:', changes);
    // TODO: Implement actual save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    setChanges([]);
    setIframeKey(prev => prev + 1);
  };

  const openEditor = (section: { id: string; selector: string; label: string; type: 'text' | 'image' }) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    try {
      const win = iframe.contentWindow as any;
      const script = `
        (function() {
          const el = document.querySelector('${section.selector}');
          return el ? ('${section.type}' === 'image' ? el.src : el.textContent) : '';
        })();
      `;
      const currentContent = win.eval ? win.eval(script) : '';
      
      setSelectedElement({
        id: section.id,
        page: currentPage,
        selector: section.selector,
        label: section.label,
        type: section.type,
        content: currentContent || ''
      });
      setEditValue(currentContent || '');
      setShowEditor(true);
    } catch (e) {
      console.error('Failed to get element content:', e);
    }
  };

  const dims = getDeviceDimensions();

  return (
    <div className="min-h-screen bg-black flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-white hover:text-purple-400 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-white">Store Editor</h1>
            
            <select
              value={currentPage}
              onChange={(e) => {
                setCurrentPage(e.target.value);
                setIframeKey(prev => prev + 1);
                setChanges([]);
              }}
              className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500 ml-4"
            >
              {pages.map(page => (
                <option key={page.path} value={page.path} className="bg-black">{page.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <button onClick={() => setDeviceView('desktop')} className={`p-2 rounded ${deviceView === 'desktop' ? 'bg-purple-600 text-white' : 'text-white/70 hover:text-white'}`}>
                <Monitor size={18} />
              </button>
              <button onClick={() => setDeviceView('tablet')} className={`p-2 rounded ${deviceView === 'tablet' ? 'bg-purple-600 text-white' : 'text-white/70 hover:text-white'}`}>
                <Tablet size={18} />
              </button>
              <button onClick={() => setDeviceView('mobile')} className={`p-2 rounded ${deviceView === 'mobile' ? 'bg-purple-600 text-white' : 'text-white/70 hover:text-white'}`}>
                <Smartphone size={18} />
              </button>
            </div>

            <button onClick={() => setIframeKey(prev => prev + 1)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded">
              <RefreshCw size={18} />
            </button>

            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${showEditor ? 'bg-purple-600 text-white' : 'bg-white/10 text-white'}`}
            >
              <Edit3 size={16} />
              <span className="text-sm">{showEditor ? 'Editing' : 'Edit'}</span>
            </button>

            <button
              onClick={saveChanges}
              disabled={changes.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              <span className="text-sm">Publish {changes.length > 0 && `(${changes.length})`}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Website Preview */}
        <div className="flex-1 bg-gray-800 flex items-center justify-center p-4 overflow-auto">
          <div 
            className="bg-white shadow-2xl transition-all duration-300 relative"
            style={{ width: dims.width, height: dims.height, maxWidth: '100%', maxHeight: '100%' }}
          >
            <iframe
              ref={iframeRef}
              key={iframeKey}
              src={`http://localhost:3000${currentPage}`}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms"
              title="Website Preview"
            />
          </div>
        </div>

        {/* Editor Panel */}
        {showEditor && (
          <div className="w-80 bg-black border-l border-white/10 p-4 overflow-y-auto flex-shrink-0">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Edit3 size={16} />
              Edit Content
            </h3>

            {!selectedElement ? (
              <div className="space-y-2">
                <p className="text-white/50 text-sm mb-4">Click an element below to edit:</p>
                {currentPageData?.sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => openEditor(section)}
                    className="w-full text-left bg-white/5 hover:bg-white/10 text-white p-3 rounded transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {section.type === 'image' ? <ImageIcon size={14} /> : <Type size={14} />}
                      {section.label}
                    </span>
                    <Edit3 size={14} className="text-white/50" />
                  </button>
                ))}
                
                {changes.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="text-white/70 text-sm mb-2">Pending Changes ({changes.length})</h4>
                    {changes.map(change => (
                      <div key={change.id} className="bg-white/5 rounded p-2 mb-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">{change.label}</span>
                          <button onClick={() => discardChange(change.id)} className="text-red-400 hover:text-red-300">
                            <X size={12} />
                          </button>
                        </div>
                        <p className="text-green-400 truncate">{change.content.substring(0, 30)}...</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">{selectedElement.label}</h4>
                  <button 
                    onClick={() => { setSelectedElement(null); setEditValue(''); }}
                    className="text-white/50 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                {selectedElement.type === 'image' ? (
                  <ImageUpload
                    onUpload={(url) => setEditValue(url)}
                    currentImage={editValue}
                    folder="content"
                  />
                ) : (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={5}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                )}

                <div className="flex gap-2">
                  <button
                    onClick={applyChange}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Apply
                  </button>
                  <button
                    onClick={() => { setSelectedElement(null); setEditValue(''); }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      {!showEditor && (
        <div className="fixed bottom-4 left-4 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm z-40">
          <p className="text-sm font-medium mb-1">How to edit:</p>
          <p className="text-xs opacity-90">
            1. Click the "Edit" button<br/>
            2. Select what you want to change<br/>
            3. Modify and click Apply<br/>
            4. Click "Publish" to save
          </p>
          <button 
            onClick={() => setShowEditor(true)}
            className="mt-2 bg-white text-purple-600 px-3 py-1 rounded text-sm font-medium"
          >
            Start Editing
          </button>
        </div>
      )}
    </div>
  );
}
