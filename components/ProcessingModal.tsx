import React from 'react';
import { PromptType } from '../types';
import { PROMPT_OPTIONS } from '../constants';
import { Wand2 } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  transcription: string;
  onConfirm: (type: PromptType) => void;
  onCancel: () => void;
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({ isOpen, transcription, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Wand2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Process Note</h2>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-32 overflow-y-auto">
            <p className="text-sm text-gray-600 italic">"{transcription}"</p>
          </div>

          <p className="text-sm font-medium text-gray-700 mb-3">Choose a style:</p>
          
          <div className="grid grid-cols-2 gap-3">
            {PROMPT_OPTIONS.map((option) => (
              <button
                key={option.type}
                onClick={() => onConfirm(option.type)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{option.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;
