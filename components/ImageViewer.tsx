import React from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { GeneratedImage } from '../types';
import Button from './Button';

interface ImageViewerProps {
  image: GeneratedImage | null;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `talrn-gen-${image.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(image.params.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-slate-700">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full md:hidden"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center p-4 relative overflow-hidden group">
            {/* Checkerboard background for transparency */}
            <div className="absolute inset-0 opacity-20" 
                 style={{backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>
            
            <img 
              src={image.url} 
              alt={image.params.prompt} 
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
        </div>

        {/* Details Sidebar */}
        <div className="w-full md:w-96 bg-slate-800 p-6 flex flex-col border-l border-slate-700 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-white">Image Details</h3>
             <button onClick={onClose} className="text-slate-400 hover:text-white hidden md:block">
               <X size={24} />
             </button>
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Prompt</label>
              <div className="bg-slate-900 rounded-lg p-3 text-slate-200 text-sm leading-relaxed border border-slate-700 relative group">
                {image.params.prompt}
                <button 
                  onClick={copyPrompt}
                  className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy Prompt"
                >
                  {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {image.params.negativePrompt && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-red-400 uppercase tracking-wider">Negative Prompt</label>
                <div className="bg-slate-900 rounded-lg p-3 text-slate-300 text-sm border border-slate-700">
                  {image.params.negativePrompt}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Model</label>
                <p className="text-sm text-white font-medium truncate">{image.modelUsed}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Ratio</label>
                <p className="text-sm text-white font-medium">{image.params.aspectRatio}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Created</label>
                <p className="text-sm text-white font-medium">{new Date(image.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <Button onClick={handleDownload} className="w-full" icon={<Download size={18} />}>
              Download Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;