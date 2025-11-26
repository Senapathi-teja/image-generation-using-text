import React, { useState } from 'react';
import { Wand2, Settings2, Image as ImageIcon } from 'lucide-react';
import { GenerationParams, AspectRatio, ModelTier } from '../types';
import { RATIO_LABELS, MODEL_LABELS } from '../constants';
import Button from './Button';

interface GeneratorProps {
  onGenerate: (params: GenerationParams) => Promise<void>;
  isGenerating: boolean;
}

const Generator: React.FC<GeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [model, setModel] = useState<ModelTier>(ModelTier.STANDARD);
  const [enhancePrompt, setEnhancePrompt] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({
      prompt,
      negativePrompt,
      aspectRatio,
      model,
      enhancePrompt
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-600/20 rounded-lg text-primary-400">
          <Wand2 size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">Create New Image</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create... e.g., A cyberpunk city with neon lights in rain"
            className="w-full h-32 bg-slate-900/80 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
            required
          />
        </div>

        {/* Quick Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {Object.entries(RATIO_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Model Quality
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as ModelTier)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {Object.entries(MODEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Toggles */}
        <div className="border-t border-slate-700/50 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 mb-4 transition-colors"
          >
            <Settings2 size={16} />
            {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
          </button>

          {showAdvanced && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Negative Prompt
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Elements to avoid... e.g., blurry, bad anatomy, text"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enhance"
                  checked={enhancePrompt}
                  onChange={(e) => setEnhancePrompt(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500 bg-slate-900"
                />
                <label htmlFor="enhance" className="text-sm text-slate-300 cursor-pointer select-none">
                  <span className="font-medium text-white">Enhance Prompt:</span> Automatically adds quality keywords (8k, detailed, etc.)
                </label>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          isLoading={isGenerating}
          className="w-full py-4 text-lg font-semibold shadow-xl shadow-primary-900/20"
          icon={<ImageIcon size={20} />}
        >
          {isGenerating ? 'Generating Masterpiece...' : 'Generate Image'}
        </Button>
      </form>
    </div>
  );
};

export default Generator;