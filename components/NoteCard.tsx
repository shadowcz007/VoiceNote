import React, { useState } from 'react';
import { Note, AppSettings } from '../types';
import { getCategoryById, getCategoryDisplayName, getCategoryIcon } from '../utils/promptUtils';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  settings?: AppSettings;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, settings }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const category = getCategoryById(note.promptType, settings);
  const displayName = getCategoryDisplayName(note.promptType, settings);
  const icon = getCategoryIcon(note.promptType, settings);
  const isDeleted = !category;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(note.processedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg text-lg ${isDeleted ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-600'}`}>
              {icon}
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {formatDate(note.createdAt)}
              </div>
              <div className={`text-sm font-bold ${isDeleted ? 'text-gray-400 italic' : 'text-gray-800'}`}>
                {displayName}
                {isDeleted && <span className="ml-2 text-xs text-gray-400">(已删除)</span>}
              </div>
            </div>
          </div>
          <button 
            onClick={handleCopy}
            className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
          {/* We display the processed content primarily */}
          <div className="whitespace-pre-wrap">
            {note.processedContent}
          </div>
        </div>
      </div>

      {/* Accordion for original transcript */}
      <div className="border-t border-gray-50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <span>Original Transcript</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        
        {isExpanded && (
          <div className="px-5 pb-5 pt-0 bg-gray-50/50 animate-in slide-in-from-top-2">
            <p className="text-xs text-gray-500 italic leading-relaxed whitespace-pre-wrap">
              "{note.originalText}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
