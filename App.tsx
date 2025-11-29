import React, { useState, useEffect } from 'react';
import { Settings, Mic, Search, Plus } from 'lucide-react';
import { Note, AppSettings, PromptType } from './types';
import { LOCAL_STORAGE_KEY_NOTES, LOCAL_STORAGE_KEY_SETTINGS } from './constants';
import { transcribeAudio } from './services/siliconFlowService';
import { processNoteContent } from './services/geminiService';
import NoteCard from './components/NoteCard';
import Recorder from './components/Recorder';
import SettingsModal from './components/SettingsModal';
import ProcessingModal from './components/ProcessingModal';

const App: React.FC = () => {
  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ siliconFlowToken: '' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialization
  useEffect(() => {
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY_NOTES);
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Handlers
  const handleRecordingComplete = async (blob: Blob) => {
    if (!settings.siliconFlowToken) {
      alert("Please set your SiliconFlow API Token in settings first.");
      setIsSettingsOpen(true);
      return;
    }

    setIsProcessing(true);
    try {
      const text = await transcribeAudio(blob, settings.siliconFlowToken);
      setCurrentTranscription(text);
      setIsProcessing(false);
      setIsProcessingModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Failed to transcribe audio. Check your token and internet connection.");
      setIsProcessing(false);
    }
  };

  const handlePromptSelect = async (type: PromptType) => {
    setIsProcessingModalOpen(false);
    setIsProcessing(true); // Show processing during AI generation

    try {
      const generatedContent = await processNoteContent(currentTranscription, type);
      
      const newNote: Note = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        originalText: currentTranscription,
        processedContent: generatedContent,
        promptType: type
      };

      setNotes(prev => [newNote, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content.");
    } finally {
      setIsProcessing(false);
      setCurrentTranscription('');
    }
  };

  const handleCancelProcessing = () => {
    setIsProcessingModalOpen(false);
    setCurrentTranscription('');
  };

  // Filtering
  const filteredNotes = notes.filter(note => 
    note.processedContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.originalText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Mic className="w-5 h-5" />
              </span>
              VoiceNote AI
            </h1>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search your notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <Mic className="w-12 h-12 text-indigo-100" />
            </div>
            <h3 className="text-lg font-medium text-gray-600">No notes yet</h3>
            <p className="text-sm max-w-xs mx-auto mt-2">
              Tap the microphone button below to start recording your thoughts.
            </p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))
        )}
      </main>

      {/* Floating Elements */}
      <Recorder 
        onRecordingComplete={handleRecordingComplete} 
        isProcessing={isProcessing}
      />

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />

      <ProcessingModal 
        isOpen={isProcessingModalOpen}
        transcription={currentTranscription}
        onConfirm={handlePromptSelect}
        onCancel={handleCancelProcessing}
      />
    </div>
  );
};

export default App;
