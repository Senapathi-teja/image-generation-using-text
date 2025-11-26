import React from 'react';
import { Download, Trash2, Calendar, Maximize2 } from 'lucide-react';
import { GeneratedImage } from '../types';
import Button from './Button';

interface HistoryCardProps {
  item: GeneratedImage;
  onDelete: (id: string) => void;
  onSelect: (item: GeneratedImage) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, onDelete, onSelect }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `talrn-gen-${item.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <div 
      className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-primary-500/50 transition-all duration-300 shadow-xl"
      onClick={() => onSelect(item)}
    >
      <div className="aspect-square w-full overflow-hidden bg-slate-900 relative">
        <img 
          src={item.url} 
          alt={item.params.prompt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
           <div className="flex justify-between items-center gap-2">
             <Button variant="secondary" size="sm" onClick={handleDownload} className="p-2 h-auto" title="Download">
               <Download size={16} />
             </Button>
             <Button variant="danger" size="sm" onClick={handleDelete} className="p-2 h-auto" title="Delete">
               <Trash2 size={16} />
             </Button>
           </div>
        </div>
      </div>
      
      <div className="p-3">
        <p className="text-sm text-slate-300 line-clamp-2 mb-2 font-medium" title={item.params.prompt}>
          {item.params.prompt}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
             <Calendar size={12} />
             {new Date(item.timestamp).toLocaleDateString()}
          </span>
          <span className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">
            {item.params.aspectRatio}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;