import React, { useState } from 'react';
import { Note, PromptType } from '../types';
import { PROMPT_OPTIONS } from '../constants';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const promptInfo = PROMPT_OPTIONS.find(p => p.type === note.promptType) || PROMPT_OPTIONS[0];

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
            <span className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg text-lg">
              {promptInfo.icon}
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {formatDate(note.createdAt)}
              </div>
              <div className="text-sm font-bold text-gray-800">
                {promptInfo.label}
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
