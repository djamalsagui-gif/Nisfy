import React, { useState, useEffect, useRef } from 'react';
import { SocialPostCategory, SocialPost, SocialComment, UserProfile } from '../../types';
import { CategoryTabs } from './CategoryTabs';
import { VideoPlayer } from './VideoPlayer';
import { PublishVideoModal } from './PublishVideoModal';
import { INITIAL_SOCIAL_POSTS } from '../../data/socialFeedData';
import { Plus, Send, Heart, Sparkles, X, Compass } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SocialFeedProps {
  onSelectUser?: (userId: string) => void;
  onNavigateToDiscover?: () => void;
  onNavigateToShop?: (productId?: string) => void;
  currentUser?: UserProfile;
  posts?: SocialPost[];
  onUpdatePosts?: (posts: SocialPost[]) => void;
}

export function SocialFeed({ onSelectUser, onNavigateToDiscover, onNavigateToShop, currentUser, posts: externalPosts, onUpdatePosts }: SocialFeedProps) {
  const { isArabic } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<any>('all');
  const [localPosts, setLocalPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  
  const posts = externalPosts || localPosts;
  const setPosts = onUpdatePosts || setLocalPosts;
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishInitialTrackId, setPublishInitialTrackId] = useState<string | undefined>(undefined);
  const [publishInitialIsStory, setPublishInitialIsStory] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'following') {
      // Show verified creators or user's network
      return post.authorVerified || post.likesCount > 400;
    }
    if (selectedCategory === 'nearby') {
      // Prioritize user wilaya or central/regional posts
      return post.authorCity?.includes(currentUser?.city || 'Alger') || post.authorCity?.includes('16') || post.authorCity?.includes('31');
    }
    if (selectedCategory === 'wilayas') {
      return !!post.authorCity;
    }
    return post.category === selectedCategory;
  });

  const currentIndex = filteredPosts.findIndex((p) => p.id === activePostId);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  useEffect(() => {
    if (filteredPosts.length > 0 && (!activePostId || !filteredPosts.some(p => p.id === activePostId))) {
      setActivePostId(filteredPosts[0].id);
    }
  }, [filteredPosts, activePostId]);

  // Scroll to index helper
  const scrollToIndex = (index: number) => {
    if (containerRef.current && filteredPosts[index]) {
      const targetPost = filteredPosts[index];
      setActivePostId(targetPost.id);
      const height = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: index * height,
        behavior: 'smooth',
      });
    }
  };

  const handleNextVideo = () => {
    if (activeIndex < filteredPosts.length - 1) {
      scrollToIndex(activeIndex + 1);
    } else {
      // Loop back to start or stay
      scrollToIndex(0);
    }
  };

  const handlePrevVideo = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  // Keyboard navigation (ArrowUp, ArrowDown, PageUp, PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'j') {
        e.preventDefault();
        handleNextVideo();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'k') {
        e.preventDefault();
        handlePrevVideo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, filteredPosts]);

  const handlePublish = (data: any) => {
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser?.id || 'me',
      authorPseudo: currentUser?.pseudo || 'Vous 🌟',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      authorCity: currentUser?.city ? `${currentUser.city} (${currentUser.wilayaCode || '16'})` : 'Alger (16)',
      authorVerified: true,
      category: data.category || 'mariage',
      videoUrl: data.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
      title: data.title || 'Mon nouveau moment Nisfy',
      description: data.description || 'Moment de vie authentique partagé sur Nisfy.',
      tags: data.isStoryOnWall ? ['#StoryWall', '#NisfyDZ', '#ZawajDZ'] : ['#NisfyDZ', '#ZawajSincere'],
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      likedBy: [],
      bookmarkedBy: [],
      createdAt: 'À l’instant',
      duration: 30,
      comments: [],
      musicTitle: data.musicTitle,
      musicThemeId: data.musicThemeId,
      musicThemeUrl: data.musicThemeUrl,
    };
    setPosts([newPost, ...posts]);
    setActivePostId(newPost.id);
    setIsPublishModalOpen(false);
    setPublishInitialTrackId(undefined);
    setPublishInitialIsStory(false);
    scrollToIndex(0);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activePostId) return;

    const newComment: SocialComment = {
      id: `comment-${Date.now()}`,
      postId: activePostId,
      authorId: 'me',
      authorPseudo: 'Vous 🌟',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      authorCity: 'Alger (16)',
      content: newCommentText.trim(),
      timestamp: 'À l’instant',
      likes: 0,
      emojiReaction: '❤️',
    };

    setPosts(posts.map((post) => {
      if (post.id === activePostId) {
        const currentComments = post.comments || [];
        return {
          ...post,
          commentsCount: (post.commentsCount || currentComments.length) + 1,
          comments: [newComment, ...currentComments],
        };
      }
      return post;
    }));
    setNewCommentText('');
  };

  const activePost = filteredPosts.find((p) => p.id === activePostId) || filteredPosts[0];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] bg-black overflow-hidden flex flex-col select-none">
      {/* Category Tabs Header */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setIsCommentsOpen(false);
          scrollToIndex(0);
        }}
      />

      {/* Video Counter & Discover Button Overlay Top-Right */}
      <div className="absolute top-16 right-4 z-30 flex items-center gap-2">
        <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-white text-[11px] font-black tracking-widest shadow-md">
          {filteredPosts.length > 0 ? `${activeIndex + 1} / ${filteredPosts.length}` : '0 / 0'}
        </div>
      </div>

      {/* Snap Scrolling Container */}
      <div 
        ref={containerRef}
        className="flex-1 w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide no-scrollbar relative"
        onScroll={(e) => {
          const container = e.currentTarget;
          const index = Math.round(container.scrollTop / container.clientHeight);
          if (filteredPosts[index] && filteredPosts[index].id !== activePostId) {
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
                onSelectUser={onSelectUser}
                currentUser={currentUser}
                onNavigateToShop={onNavigateToShop}
                onCreateStoryFromClip={(p) => {
                  setPublishInitialTrackId(p.musicThemeId);
                  setPublishInitialIsStory(true);
                  setIsPublishModalOpen(true);
                }}
              />
            </div>
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/70 text-sm p-8 text-center snap-start">
            <span className="text-5xl mb-4 animate-bounce">🎥</span>
            <p className="font-bold text-base text-white">Aucune vidéo dans cette catégorie.</p>
            <p className="text-xs text-white/60 mt-1">Soyez le premier à publier un moment Nisfy !</p>
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white rounded-xl text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              {isArabic ? 'نشر فيديو' : 'Publier une vidéo'}
            </button>
          </div>
        )}
      </div>



      {/* Bouton doux & discret : Publier une vidéo */}
      <button 
        onClick={() => setIsPublishModalOpen(true)}
        className="absolute bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 px-3.5 py-2 bg-[#FF3823]/85 hover:bg-[#FF3823] text-white text-xs font-bold rounded-xl border border-orange-300/40 backdrop-blur-md shadow-lg shadow-orange-500/25 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        title="Publier une vidéo"
      >
        <Plus className="w-4 h-4 text-white" />
        <span>{isArabic ? 'نشر فيديو' : 'Publier une vidéo'}</span>
      </button>

      {/* Interactive Comments Drawer */}
      {isCommentsOpen && activePost && (
        <div className="absolute bottom-0 left-0 w-full h-[65%] sm:h-[60%] bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/80 rounded-t-3xl shadow-[0_-15px_50px_rgba(0,0,0,0.8)] z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">
                {isArabic ? 'التعليقات' : 'Commentaires'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF3823]/20 text-orange-400 border border-[#FF3823]/30">
                {activePost.comments?.length || 0}
              </span>
            </div>
            <button 
              onClick={() => setIsCommentsOpen(false)} 
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {activePost.comments && activePost.comments.length > 0 ? (
              activePost.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorPseudo}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 bg-slate-800/70 p-2.5 rounded-2xl border border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FF6B35]">{comment.authorPseudo}</span>
                      <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs py-8">
                <span className="text-3xl mb-2">💬</span>
                <p className="font-bold">Aucun commentaire pour le moment.</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Soyez le premier à envoyer vos félicitations ou questions !</p>
              </div>
            )}
          </div>

          {/* Comment Input Bar */}
          <form onSubmit={handleAddComment} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={isArabic ? 'اكتب تعليقاً محترماً...' : 'Écrire un commentaire bienveillant...'}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF3823]"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <PublishVideoModal 
          onClose={() => {
            setIsPublishModalOpen(false);
            setPublishInitialTrackId(undefined);
            setPublishInitialIsStory(false);
          }} 
          onPublish={handlePublish}
          initialTrackId={publishInitialTrackId}
          initialIsStory={publishInitialIsStory}
        />
      )}
    </div>
  );
}
