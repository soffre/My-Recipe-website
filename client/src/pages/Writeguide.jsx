import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

// --- Tiptap Toolbar Component ---
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className="sticky top-[64px] z-40 bg-white py-3 border-y border-tafach-border mb-6 flex flex-wrap items-center gap-1 sm:gap-2 text-tafach-dark">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded transition-colors font-serif font-bold text-lg ${editor.isActive('bold') ? 'bg-orange-100 text-tafach-orange' : 'hover:bg-tafach-light'}`}
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded transition-colors font-serif italic text-lg ${editor.isActive('italic') ? 'bg-orange-100 text-tafach-orange' : 'hover:bg-tafach-light'}`}
        title="Italic"
      >
        I
      </button>
      
      <div className="w-px h-6 bg-tafach-border mx-1"></div>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded transition-colors font-bold text-lg ${editor.isActive('heading', { level: 2 }) ? 'bg-orange-100 text-tafach-orange' : 'hover:bg-tafach-light'}`}
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded transition-colors font-semibold text-base ${editor.isActive('heading', { level: 3 }) ? 'bg-orange-100 text-tafach-orange' : 'hover:bg-tafach-light'}`}
        title="Heading 3"
      >
        H3
      </button>

      <div className="w-px h-6 bg-tafach-border mx-1"></div>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-orange-100 text-tafach-orange' : 'hover:bg-tafach-light'}`}
        title="Bullet List"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M8 6h.01M8 12h.01M8 18h.01" /></svg>
      </button>

      {/* FIXED: Added Numbered (Ordered) List */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-orange-100 text-tafach-orange' : 'hover:bg-tafach-light'}`}
        title="Numbered List"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h11M9 12h11M9 18h11M5 6v4m0-4h-1m1 10h-1m1-4h1v4h-2" /></svg>
      </button>

      {/* Blockquote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-orange-100 text-tafach-orange' : 'hover:bg-tafach-light'}`}
        title="Quote"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
      </button>

      <button
        onClick={addImage}
        className="p-2 hover:bg-tafach-light rounded transition-colors"
        title="Add Image"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </button>
    </div>
  );
};

// --- Main Page Component ---
export default function WriteGuide() {
  const navigate = useNavigate();
  
  // Basic Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl shadow-md my-8 w-full max-w-3xl object-cover',
        },
      }),
      Placeholder.configure({
        placeholder: 'Tell your story...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[50vh] text-tafach-dark leading-relaxed ' +
               // Headings
               '[&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:mt-10 [&_h2]:mb-4 ' +
               '[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 ' +
               // Paragraphs & Blockquotes
               '[&_p]:mb-4 ' +
               '[&_blockquote]:border-l-4 [&_blockquote]:border-tafach-orange [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:my-8 [&_blockquote]:bg-orange-50/50 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-tafach-muted [&_blockquote_p]:m-0 ' +
               // Lists (Fixed to support nested blocks like headings)
               '[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-2 ' +
               '[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_ol]:space-y-2 ' +
               // Ensure bold elements inside lists stand out
               '[&_strong]:font-extrabold [&_strong]:text-black ' +
               // Fix alignment if a heading is inside a list item
               '[&_li>h2]:mt-2 [&_li>h3]:mt-2 [&_li>p]:my-1',
      },
    },
  });

  // Auto-resize textarea for Title & Description
  const handleInputResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Handle Cover Image
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
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
    <div className="min-h-screen bg-white pb-20">
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-tafach-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/guides" className="text-sm font-semibold text-tafach-muted hover:text-tafach-dark transition-colors">
              ← Cancel
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-tafach-muted">
              {title ? 'Draft saved' : 'New Guide'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-tafach-orange hover:bg-tafach-orange/90 text-white px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 pt-10">
        
        {/* Category Selector */}
        <div className="mb-8">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm font-bold text-tafach-orange bg-orange-50 border-none outline-none rounded-md px-3 py-1.5 cursor-pointer appearance-none hover:bg-orange-100 transition-colors"
          >
            <option value="" disabled>Select Category</option>
            <option value="Technique">Technique</option>
            <option value="Equipment">Equipment</option>
            <option value="Science">Science</option>
            <option value="Basics">Basics</option>
          </select>
        </div>

        {/* Cover Image Area */}
        <div className="mb-10 group relative rounded-2xl overflow-hidden bg-tafach-light border-2 border-dashed border-gray-300 hover:border-tafach-orange transition-colors">
          {coverImage ? (
            <div className="relative aspect-[21/9] w-full">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold">
                Change Cover Image
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
            </div>
          ) : (
            <label className="aspect-[21/9] w-full flex flex-col items-center justify-center cursor-pointer text-tafach-muted hover:text-tafach-orange transition-colors">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Add a Cover Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          )}
        </div>

        {/* Title & Description Inputs */}
        <textarea
          placeholder="Guide Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleInputResize(e);
          }}
          rows={1}
          className="w-full text-4xl md:text-5xl lg:text-6xl font-extrabold text-tafach-dark placeholder:text-gray-300 outline-none resize-none bg-transparent mb-6 leading-tight"
        />

        <textarea
          placeholder="Write a short description or subtitle..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleInputResize(e);
          }}
          rows={1}
          className="w-full text-xl text-tafach-muted placeholder:text-gray-300 outline-none resize-none bg-transparent mb-8 leading-relaxed"
        />

        {/* Real Tiptap Toolbar */}
        <MenuBar editor={editor} />

        {/* Real Tiptap Content Area */}
        <EditorContent editor={editor} />

      </main>
    </div>
  );
}