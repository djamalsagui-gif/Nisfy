import React, { useState, useEffect } from 'react';
import { SocialPostCategory, SocialPost } from '../../types';
import { CategoryTabs } from './CategoryTabs';
import { VideoPlayer } from './VideoPlayer';
import { PublishVideoModal } from './PublishVideoModal';
import { INITIAL_SOCIAL_POSTS } from '../../data/socialFeedData';
import { Plus } from 'lucide-react';

export function SocialFeed() {
  const [selectedCategory, setSelectedCategory] = useState<SocialPostCategory | 'all'>('all');
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // In a real app, React Query would fetch these from Supabase based on category
  const filteredPosts = posts.filter(
    (post) => selectedCategory === 'all' || post.category === selectedCategory
  );

  useEffect(() => {
    if (filteredPosts.length > 0 && !activePostId) {
      setActivePostId(filteredPosts[0].id);
    }
  }, [filteredPosts, activePostId]);

  const handlePublish = (data: any) => {
    console.log('Published:', data);
    // Real implementation would optimistic update the list
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] bg-black overflow-hidden flex flex-col">
      {/* Absolute Header (Tabs) */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setIsCommentsOpen(false);
        }}
      />

      {/* Snap Scrolling Container */}
      <div 
        className="flex-1 w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide no-scrollbar relative"
        onScroll={(e) => {
          const container = e.currentTarget;
          const index = Math.round(container.scrollTop / container.clientHeight);
          if (filteredPosts[index]) {
            setActivePostId(filteredPosts[index].id);
          }
        }}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="w-full h-full snap-start relative">
              <VideoPlayer 
                post={post} 
                isActive={activePostId === post.id} 
                onOpenComments={() => setIsCommentsOpen(true)}
              />
            </div>
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 text-sm p-8 text-center snap-start">
            <span className="text-4xl mb-4">🎥</span>
            <p>Aucune vidéo dans cette catégorie.</p>
            <p>Soyez le premier à publier !</p>
          </div>
        )}
      </div>
      
      {/* Floating Action Button (Publish) */}
      <button 
        onClick={() => setIsPublishModalOpen(true)}
        className="absolute bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>

      {/* Simplified Comments Drawer placeholder */}
      {isCommentsOpen && (
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col transform transition-transform duration-300">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Commentaires</h3>
            <button onClick={() => setIsCommentsOpen(false)} className="text-slate-500 p-2">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center text-slate-500">
            {/* The full comments logic from original SocialFeedView would go here */}
            <p>Espace commentaires (à implémenter)</p>
          </div>
        </div>
      )}
      
      {isPublishModalOpen && (
        <PublishVideoModal 
          onClose={() => setIsPublishModalOpen(false)} 
          onPublish={handlePublish}
        />
      )}
    </div>
  );
}
