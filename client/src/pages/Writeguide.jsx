import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

// --- Custom Interactive Drag-to-Resize & Rotate Image Component ---
const ResizableImageComponent = (props) => {
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizerDirection, setResizerDirection] = useState(null);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialMouseY, setInitialMouseY] = useState(0);
  const [initialWidthPx, setInitialWidthPx] = useState(0);

  const currentRotation = props.node.attrs.rotation || 0;

  // Handles both mouse and touch start events
  const startResize = (e, dir) => {
    // Prevent default to stop mobile scrolling while dragging
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizerDirection(dir);
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setInitialMouseX(clientX);
    setInitialMouseY(clientY);
    
    if (containerRef.current) {
      setInitialWidthPx(containerRef.current.getBoundingClientRect().width);
    }
  };

  useEffect(() => {
    if (!isResizing) return;
    
    const onMove = (e) => {
      // Prevent scrolling while resizing on mobile
      if (e.cancelable) e.preventDefault(); 
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - initialMouseX;
      const deltaY = clientY - initialMouseY;
      
      let effectiveDelta = 0;
      
      // Calculate effective movement based on the current rotation angle
      if (currentRotation === 0) {
        effectiveDelta = ['ne', 'se'].includes(resizerDirection) ? deltaX : -deltaX;
      } else if (currentRotation === 90) {
        effectiveDelta = ['ne', 'se'].includes(resizerDirection) ? deltaY : -deltaY;
      } else if (currentRotation === 180) {
        effectiveDelta = ['ne', 'se'].includes(resizerDirection) ? -deltaX : deltaX;
      } else if (currentRotation === 270) {
        effectiveDelta = ['ne', 'se'].includes(resizerDirection) ? -deltaY : deltaY;
      }
      
      // Multiply by 2 because the container is center-aligned
      const widthChange = effectiveDelta * 2; 
      const newWidth = Math.max(100, initialWidthPx + widthChange); // Adjusted min-width for mobile
      
      props.updateAttributes({ width: `${newWidth}px` });
    };
    
    const onUp = () => {
      setIsResizing(false);
      setResizerDirection(null);
    };
    
    // Mouse events
    window.addEventListener('mousemove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    
    // Touch events for mobile
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isResizing, initialMouseX, initialMouseY, initialWidthPx, resizerDirection, currentRotation, props]);

  const handleRotate = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    const newRotation = (currentRotation + 90) % 360;
    props.updateAttributes({ rotation: newRotation });
  };

  // Added touch-none to prevent scrolling when grabbing handles, and made handles slightly bigger on mobile
  const handleClasses = "absolute w-6 h-6 sm:w-4 sm:h-4 bg-white border-2 border-orange-500 rounded-full shadow-md z-50 transition-transform hover:scale-125 touch-none";

  return (
    <NodeViewWrapper className="flex justify-center my-12 max-w-full px-2 sm:px-0">
      <div 
        ref={containerRef}
        style={{ 
          width: props.node.attrs.width || '100%',
          transform: `rotate(${currentRotation}deg)`,
          transition: isResizing ? 'none' : 'transform 0.3s ease-in-out'
        }} 
        className="relative group inline-block max-w-full"
      >
        <img
          src={props.node.attrs.src}
          alt="Uploaded content"
          className={`rounded-xl shadow-md w-full h-auto object-cover cursor-pointer transition-shadow ${
            props.selected || isResizing ? 'ring-4 ring-orange-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
          }`}
          onClick={props.selectNode}
        />
        
        {/* Floating Rotate Button inside the wrapper so it moves with the rotation */}
        {props.selected && (
          <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-gray-200 z-50">
            <button
              onClick={handleRotate}
              className="p-1.5 sm:p-2 text-gray-600 hover:bg-orange-100 hover:text-orange-600 rounded transition-colors touch-manipulation"
              title="Rotate 90°"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}

        {/* 4 Corner Drag Handles (Touch & Mouse Support) */}
        {(props.selected || isResizing) && (
          <>
            <div 
              className={`${handleClasses} -top-3 -left-3 sm:-top-2 sm:-left-2 cursor-nwse-resize`}
              onMouseDown={(e) => startResize(e, 'nw')}
              onTouchStart={(e) => startResize(e, 'nw')}
              title="Resize"
            />
            <div 
              className={`${handleClasses} -top-3 -right-3 sm:-top-2 sm:-right-2 cursor-nesw-resize`}
              onMouseDown={(e) => startResize(e, 'ne')}
              onTouchStart={(e) => startResize(e, 'ne')}
              title="Resize"
            />
            <div 
              className={`${handleClasses} -bottom-3 -left-3 sm:-bottom-2 sm:-left-2 cursor-nesw-resize`}
              onMouseDown={(e) => startResize(e, 'sw')}
              onTouchStart={(e) => startResize(e, 'sw')}
              title="Resize"
            />
            <div 
              className={`${handleClasses} -bottom-3 -right-3 sm:-bottom-2 sm:-right-2 cursor-nwse-resize`}
              onMouseDown={(e) => startResize(e, 'se')}
              onTouchStart={(e) => startResize(e, 'se')}
              title="Resize"
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// --- Extend standard Tiptap Image to use our custom React component ---
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
      },
      rotation: {
        default: 0,
      }
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

// --- Tiptap Toolbar Component ---
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const handleEditorImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: imageUrl, width: '100%', rotation: 0 }).run();
    }
    e.target.value = '';
  }, [editor]);

  const activeBg = '#f97316'; 
  const activeText = '#ffffff'; 
  const inactiveText = '#374151'; 

  return (
    <div className="sticky top-[64px] z-40 bg-white py-3 border-y border-gray-200 mb-6 flex flex-wrap items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="p-2 rounded flex items-center justify-center transition-all font-serif font-bold text-lg hover:bg-gray-100"
        style={{ backgroundColor: editor.isActive('bold') ? activeBg : 'transparent', color: editor.isActive('bold') ? activeText : inactiveText }}
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="p-2 rounded flex items-center justify-center transition-all font-serif italic text-lg hover:bg-gray-100"
        style={{ backgroundColor: editor.isActive('italic') ? activeBg : 'transparent', color: editor.isActive('italic') ? activeText : inactiveText }}
        title="Italic"
      >
        I
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="p-2 rounded flex items-center justify-center transition-all font-bold text-lg hover:bg-gray-100"
        style={{ backgroundColor: editor.isActive('heading', { level: 2 }) ? activeBg : 'transparent', color: editor.isActive('heading', { level: 2 }) ? activeText : inactiveText }}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="p-2 rounded flex items-center justify-center transition-all font-semibold text-base hover:bg-gray-100"
        style={{ backgroundColor: editor.isActive('heading', { level: 3 }) ? activeBg : 'transparent', color: editor.isActive('heading', { level: 3 }) ? activeText : inactiveText }}
        title="Heading 3"
      >
        H3
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="p-2 rounded flex items-center justify-center transition-all hover:bg-gray-100"
        style={{ backgroundColor: editor.isActive('bulletList') ? activeBg : 'transparent', color: editor.isActive('bulletList') ? activeText : inactiveText }}
        title="Bullet List"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M8 6h.01M8 12h.01M8 18h.01" /></svg>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="p-2 rounded flex items-center justify-center transition-all hover:bg-gray-100"
        style={{ backgroundColor: editor.isActive('orderedList') ? activeBg : 'transparent', color: editor.isActive('orderedList') ? activeText : inactiveText }}
        title="Numbered List"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h11M9 12h11M9 18h11M5 6v4m0-4h-1m1 10h-1m1-4h1v4h-2" /></svg>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="p-2 rounded flex items-center justify-center transition-all hover:bg-gray-100"
        style={{ backgroundColor: editor.isActive('blockquote') ? activeBg : 'transparent', color: editor.isActive('blockquote') ? activeText : inactiveText }}
        title="Quote"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
      </button>

      <label
        className="p-2 rounded flex items-center justify-center transition-all text-gray-700 hover:bg-gray-100 cursor-pointer"
        title="Add Image"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleEditorImageUpload} 
        />
      </label>
    </div>
  );
};

// --- Main Page Component ---
export default function WriteGuide() {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage, 
      Placeholder.configure({
        placeholder: 'Tell your story...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[50vh] text-gray-800 leading-relaxed ' +
               '[&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:mt-10 [&_h2]:mb-4 ' +
               '[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 ' +
               '[&_p]:mb-4 ' +
               '[&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:my-8 [&_blockquote]:bg-orange-50 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote_p]:m-0 ' +
               '[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-2 ' +
               '[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_ol]:space-y-2 ' +
               '[&_strong]:font-extrabold [&_strong]:text-black ' +
               '[&_li>h2]:mt-2 [&_li>h3]:mt-2 [&_li>p]:my-1',
      },
    },
  });

  const handleInputResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !editor.getText().trim()) {
      alert("Title and content are required!");
      return;
    }
    setIsPublishing(true);
    const htmlContent = editor.getHTML();
    console.log("Publishing:", { title, description, category, coverImage, body: htmlContent });
    setTimeout(() => {
      setIsPublishing(false);
      navigate('/guides'); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-8">
      <main className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <Link to="/guides" className="text-gray-500 hover:text-gray-800 transition-colors">
              ← Cancel
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {title ? 'Draft saved' : 'New Guide'}
            </span>
          </div>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-50"
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="mb-8">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm font-bold text-orange-500 bg-orange-50 border-none outline-none rounded px-3 py-1.5 cursor-pointer hover:bg-orange-100 transition-colors"
          >
            <option value="" disabled>Select Category</option>
            <option value="Technique">Technique</option>
            <option value="Equipment">Equipment</option>
            <option value="Science">Science</option>
            <option value="Basics">Basics</option>
          </select>
        </div>

        {/* Cover Image Area */}
        <div className="mb-10 group relative rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-orange-500 transition-colors bg-white">
          {coverImage ? (
            <div className="relative aspect-[21/9] w-full">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold">
                Change Cover Image
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
            </div>
          ) : (
            <label className="aspect-[21/9] w-full flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-orange-500 transition-colors">
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Add a Cover Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          )}
        </div>

        {/* Title & Description */}
        <textarea
          placeholder="Guide Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleInputResize(e);
          }}
          rows={1}
          className="w-full text-4xl lg:text-6xl font-extrabold text-gray-800 placeholder:text-gray-300 outline-none resize-none bg-transparent mb-6 leading-tight"
        />

        <textarea
          placeholder="Write a short description or subtitle..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleInputResize(e);
          }}
          rows={1}
          className="w-full text-xl text-gray-500 placeholder:text-gray-300 outline-none resize-none bg-transparent mb-8 leading-relaxed"
        />

        <MenuBar editor={editor} />
        
        {/* Editor Wrapper */}
        <div className="w-full">
          <EditorContent editor={editor} />
        </div>

      </main>
    </div>
  );
}