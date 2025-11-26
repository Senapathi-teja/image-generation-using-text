import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Layers, History as HistoryIcon, Zap } from 'lucide-react';

import Generator from './components/Generator';
import HistoryCard from './components/HistoryCard';
import ImageViewer from './components/ImageViewer';
import { generateImage } from './services/geminiService';
import { GeneratedImage, GenerationParams } from './types';
import { APP_NAME } from './constants';

const App: React.FC = () => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('talrn_gen_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save history when it changes
  useEffect(() => {
    localStorage.setItem('talrn_gen_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    setError(null);
    try {
      const base64Image = await generateImage(params);
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: base64Image,
        params,
        timestamp: Date.now(),
        modelUsed: params.model
      };

      setHistory(prev => [newImage, ...prev]);
      // Optionally auto-open the new image
      // setSelectedImage(newImage); 
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedImage?.id === id) setSelectedImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-primary-500/30">
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
              <Layers size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {APP_NAME}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="hidden sm:flex items-center gap-1">
              <Zap size={14} className="text-yellow-500" /> Powered by Gemini
            </span>
            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
            <span>Internship Task</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Generator */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <Generator onGenerate={handleGenerate} isGenerating={isGenerating} />
            
            {/* Disclaimer / Instructions */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 text-sm text-slate-400">
              <h4 className="text-slate-200 font-medium mb-2">Assignment Notes</h4>
              <p className="mb-2">
                This application utilizes the <strong>Google Gemini API</strong> for generation instead of local Python models, adhering to the technical environment constraints of this web interface.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-1 text-slate-500">
                <li>Models: gemini-2.5-flash-image / 3.0-pro</li>
                <li>Output: Base64 Encoded PNGs</li>
                <li>Storage: Browser LocalStorage</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Gallery */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <HistoryIcon size={20} className="text-primary-400" />
                <h2 className="text-xl font-bold text-white">Generation History</h2>
              </div>
              <span className="text-sm text-slate-500">{history.length} generated</span>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-200 flex items-start gap-3">
                 <div className="mt-0.5"><Zap size={16} /></div>
                 <div>
                   <p className="font-semibold">Generation Failed</p>
                   <p className="text-sm opacity-90">{error}</p>
                 </div>
              </div>
            )}

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <Layers size={32} />
                </div>
                <p className="text-lg font-medium text-slate-400">No images created yet</p>
                <p className="text-sm">Enter a prompt on the left to start creating magic.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {history.map(item => (
                  <HistoryCard 
                    key={item.id} 
                    item={item} 
                    onDelete={handleDelete}
                    onSelect={setSelectedImage}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Full Screen Viewer Modal */}
      {selectedImage && (
        <ImageViewer 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default App;