import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle, 
  CheckCircle 
} from 'lucide-react';

export default function ContentCurationPanel() {
  // 1. Dynamic Category Taxonomy Engine State
  const [tags, setTags] = useState([
    'Fasting / Vegan', 
    'Traditional Ethiopian Holidays', 
    'Quick 15m Meals'
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  // 2. Reported Flagged Content Queue Card Deck State
  const [reportedContent, setReportedContent] = useState([
    {
      id: 1,
      type: 'Recipe',
      title: 'Blurry Injera',
      reason: 'Blurry display image asset violating visual standard',
      authorName: 'User_102'
    },
    {
      id: 2,
      type: 'Comment',
      title: 'Inappropriate review text', // using title/text interchangeably
      reason: 'Abusive language filter alert flag',
      authorName: 'User_504'
    }
  ]);

  // Tag creation handler
  const handleCreateTaxonomyBadge = (e) => {
    e.preventDefault();
    const cleanTag = newTagInput.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags(prev => [...prev, cleanTag]);
      setNewTagInput('');
    }
  };

  // Tag removal handler
  const handleRemoveCategoryTag = (tagToRemove) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Action Controllers
  const handlePurgeContentCascade = (id) => {
    setReportedContent(prev => prev.filter(item => item.id !== id));
  };

  const handleDismissReportFlag = (id) => {
    setReportedContent(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-grid-4 animate-fadeIn">
      {/* 1. Dynamic Category Taxonomy Engine Panel */}
      <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm space-y-grid-2">
        <h3 className="font-bold text-sm text-tafach-dark">Category Tags Taxonomy Manager</h3>
        <p className="text-xs text-tafach-muted mb-grid-1">
          Add, manage, and curate recipe taxonomy tags. Type a category and click Create to instantly append to the list.
        </p>

        {/* Tag Input Form */}
        <form onSubmit={handleCreateTaxonomyBadge} className="flex gap-2 max-w-md pt-2">
          <input
            type="text"
            placeholder="e.g. Baking, Keto, Spicy..."
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            className="tafach-input flex-1"
          />
          <button
            type="submit"
            className="active:scale-95 transition-transform bg-tafach-orange hover:bg-tafach-orange/95 text-white font-semibold text-xs px-4 rounded-lg shrink-0 flex items-center gap-1 shadow-md shadow-tafach-orange/20"
          >
            <Plus className="h-4.5 w-4.5" />
            ➕ Create Taxonomy Badge
          </button>
        </form>

        {/* Tag Pills Output */}
        <div className="pt-grid-2">
          <span className="text-[11px] font-bold text-tafach-muted uppercase tracking-wider block mb-2">
            Active Taxonomy Pills
          </span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all duration-150"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveCategoryTag(tag)}
                  className="active:scale-95 transition-transform p-0.5 rounded-full hover:bg-slate-300 text-slate-500 hover:text-slate-800 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {tags.length === 0 && (
              <span className="text-xs text-tafach-muted italic">No custom category tags currently set.</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Reported Flagged Content Queue Card Deck */}
      <div className="space-y-grid-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-tafach-dark">Reported Recipe & Comment Flag Deck</h3>
            <p className="text-xs text-tafach-muted">Moderate flagged entries or low-quality recipe attachments reported by users.</p>
          </div>
          <span className="bg-tafach-error/10 text-tafach-error font-bold text-xs px-2.5 py-1 rounded-full">
            {reportedContent.length} Active Flags
          </span>
        </div>

        {/* Flags Deck Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-2">
          {reportedContent.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex flex-col justify-between space-y-grid-2 hover:shadow-md transition-shadow duration-200"
            >
              <div className="space-y-2">
                {/* Flag Card Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-tafach-muted uppercase tracking-wider">
                    Type: {item.type}
                  </span>
                  <span className="bg-red-100 text-tafach-error px-2 py-0.5 rounded-full text-[9px] font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {item.reason}
                  </span>
                </div>

                {/* Content details */}
                <div className="space-y-1">
                  <span className="text-[11px] text-tafach-muted">
                    Author: <strong className="text-tafach-dark">{item.authorName}</strong>
                  </span>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-xs text-tafach-dark italic font-mono break-all">
                      "{item.title}"
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Action Control Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handlePurgeContentCascade(item.id)}
                  className="active:scale-95 transition-transform flex-1 text-white bg-tafach-error text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  🗑️ Purge Content Cascade
                </button>
                <button
                  onClick={() => handleDismissReportFlag(item.id)}
                  className="active:scale-95 transition-transform flex-1 text-white bg-tafach-green text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" />
                  ✅ Dismiss Report Flag
                </button>
              </div>
            </div>
          ))}

          {/* Empty State Reported Cards */}
          {reportedContent.length === 0 && (
            <div className="col-span-2 bg-tafach-green/5 border border-dashed border-tafach-green/30 p-grid-4 rounded-2xl text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-tafach-green/10 flex items-center justify-center text-tafach-green">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-tafach-dark">No Flagged Content Found</h4>
                <p className="text-xs text-tafach-muted">All comments, recipes, and display images are compliant with the community guidelines.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
