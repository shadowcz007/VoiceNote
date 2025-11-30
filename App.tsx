import React, { useState, useEffect } from 'react';
import { Settings, Mic, Search, Plus } from 'lucide-react';
import { Note, AppSettings } from './types';
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Migration: Map old enum values to new category IDs
  const migratePromptType = (oldType: string): string => {
    const migrationMap: Record<string, string> = {
      'Raw Record': 'raw',
      'Summary': 'summary',
      'Action Items': 'action_items',
      'Journal Entry': 'journal',
      'Email Draft': 'email',
      'Code Snippet': 'code'
    };
    return migrationMap[oldType] || oldType; // Return as-is if not in map (already migrated or custom)
  };

  // Initialization
  useEffect(() => {
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY_NOTES);
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        // Migrate old promptType values
        const migratedNotes = parsed.map((note: Note) => ({
          ...note,
          promptType: migratePromptType(note.promptType)
        }));
        setNotes(migratedNotes);
        // Save migrated notes back
        if (JSON.stringify(parsed) !== JSON.stringify(migratedNotes)) {
          localStorage.setItem(LOCAL_STORAGE_KEY_NOTES, JSON.stringify(migratedNotes));
        }
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    }

    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Migrate old customPrompts keys if needed
        if (parsed.customPrompts) {
          const migratedPrompts: Record<string, string> = {};
          Object.keys(parsed.customPrompts).forEach(oldKey => {
            const newKey = migratePromptType(oldKey);
            migratedPrompts[newKey] = parsed.customPrompts[oldKey];
          });
          parsed.customPrompts = migratedPrompts;
        }
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Persistence
  useEffect(() => {
    if (!isInitialized) return; // 避免初始化时保存空值
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_NOTES, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }, [notes, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return; // 避免初始化时保存空值
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings, isInitialized]);

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

  const handlePromptSelect = async (type: string) => {
    if (!settings.siliconFlowToken) {
      alert("Please set your SiliconFlow API Token in settings first.");
      setIsSettingsOpen(true);
      return;
    }

    setIsProcessingModalOpen(false);
    setIsProcessing(true); // Show processing during AI generation

    try {
      const generatedContent = await processNoteContent(
        currentTranscription, 
        type, 
        settings.siliconFlowToken,
        settings
      );
      console.log('Generated content:', generatedContent);
      
      const newNote: Note = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        originalText: currentTranscription,
        processedContent: generatedContent,
        promptType: type
      };

      console.log('New note created:', newNote);
      setNotes(prev => {
        const updated = [newNote, ...prev];
        console.log('Setting notes, new count:', updated.length);
        return updated;
      });
      
      // Scroll to top to show the new note
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error in handlePromptSelect:', error);
      alert(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // Debug: Monitor notes changes
  useEffect(() => {
    console.log('Notes state updated:', notes.length, 'notes');
    console.log('Filtered notes:', filteredNotes.length, 'notes');
    if (notes.length > 0) {
      console.log('Latest note:', notes[0]);
    }
  }, [notes, filteredNotes]);

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
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <Search className="w-12 h-12 text-indigo-100" />
            </div>
            <h3 className="text-lg font-medium text-gray-600">No notes match your search</h3>
            <p className="text-sm max-w-xs mx-auto mt-2">
              Try a different search term or clear the search to see all notes.
            </p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} settings={settings} />
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
        settings={settings}
        onConfirm={handlePromptSelect}
        onCancel={handleCancelProcessing}
      />
    </div>
  );
};

export default App;
