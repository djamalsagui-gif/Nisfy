import React, { useState } from 'react';
import { Upload, X, MapPin, Tag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppStore } from '../../stores/appStore';

interface PublishVideoModalProps {
  onClose: () => void;
  onPublish: (data: any) => void;
}

export function PublishVideoModal({ onClose, onPublish }: PublishVideoModalProps) {
  const { isArabic } = useLanguage();
  const addXp = useAppStore((state) => state.addXp);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('selfie');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      addXp(100); // 100 XP for publishing
      onPublish({ title, description, category });
      setIsUploading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isArabic ? 'نشر فيديو جديد' : 'Publier une vidéo'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <form id="publish-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Fake Dropzone */}
            <div className="w-full h-40 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-500 gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-rose-500" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {isArabic ? 'اختر فيديو (15-60 ثانية)' : 'Sélectionner une vidéo (15-60s)'}
              </p>
              <p className="text-xs">Max 50Mo</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catégorie
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="cuisine">🍳 Cuisine</option>
                <option value="voyage">✈️ Voyage</option>
                <option value="documentaire">🎬 Documentaire</option>
                <option value="selfie">🤳 Selfie</option>
                <option value="mariage">💍 Mariage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Titre
              </label>
              <input 
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white"
                placeholder="Un titre accrocheur..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description & Hashtags
              </label>
              <textarea 
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white resize-none"
                placeholder="Racontez l'histoire de votre vidéo... #Nisfy"
              />
            </div>
            
            <div className="flex gap-2">
              <button type="button" className="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" />
                Lieu
              </button>
              <button type="button" className="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1">
                <Tag className="w-4 h-4" />
                Tags
              </button>
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="submit"
            form="publish-form"
            disabled={isUploading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{isArabic ? 'نشر' : 'Publier'} (+100 XP)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
