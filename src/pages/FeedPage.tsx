import React, { useEffect, useState, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { MemoryCard } from '../components/MemoryCard';
import { LimitWarning } from '../components/LimitWarning';
import { MobileNav } from '../components/MobileNav';
import { loadMemories, saveMemories, addMemory, MemoryItem } from '../utils/storage';
import { useToast } from '../context/ToastContext';
interface Memory {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  photo?: string;
  photos?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
}
export function FeedPage() {
  const {
    user
  } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Load memórias do localStorage (se existir) ou usar mock inicial
    setTimeout(() => {
      const stored = loadMemories();
      if (stored && stored.length > 0) {
        // mapear para o formato usado pelo Feed (comentários como número)
        setMemories(stored.map(m => ({
          id: m.id,
          userId: m.userId,
          userName: m.userName,
          userAvatar: m.userAvatar,
          content: m.content,
          date: m.date,
          photos: m.photos,
          likes: m.likes,
          comments: (m.comments || []).length,
          isLiked: !!m.isLiked
        })) as any);
      } else {
        const seed: MemoryItem[] = [
          {
            id: '1',
            userId: '2',
            userName: 'Sarah Chen',
            content: 'Primeiro dia na praia neste verão. A água estava perfeita e o pôr do sol foi incrível.',
            date: '2024-06-15',
            photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'],
            likes: 24,
            comments: [],
            isLiked: false
          },
          {
            id: '2',
            userId: '3',
            userName: 'Marcus Johnson',
            content: 'Dia de formatura! Quatro anos de muito trabalho finalmente valeram a pena.',
            date: '2024-05-20',
            photos: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200'],
            likes: 89,
            comments: [],
            isLiked: true
          }
        ];
        seed.forEach(s => addMemory(s));
        setMemories(seed.map(m => ({
          id: m.id,
          userId: m.userId,
          userName: m.userName,
          userAvatar: m.userAvatar,
          content: m.content,
          date: m.date,
          photos: m.photos,
          likes: m.likes,
          comments: (m.comments || []).length,
          isLiked: !!m.isLiked
        })) as any);
      }
      setIsLoading(false);
    }, 300);
  }, []);

  // escutar mudanças globais (salvar novas memórias, comentários, likes)
  useEffect(() => {
    const handler = () => {
      const stored = loadMemories();
      if (stored && stored.length > 0) {
        setMemories(stored.map(m => ({
          id: m.id,
          userId: m.userId,
          userName: m.userName,
          userAvatar: m.userAvatar,
          content: m.content,
          date: m.date,
          photos: m.photos,
          likes: m.likes,
          comments: (m.comments || []).length,
          isLiked: !!m.isLiked
        })) as any);
      }
    };
    window.addEventListener('memora-change', handler);
    return () => window.removeEventListener('memora-change', handler);
  }, []);

  // infinite scroll (mock paging)
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // load more mock memories
          setTimeout(() => {
            const newMem: MemoryItem = {
              id: String(Date.now()),
              userId: '5',
              userName: 'Novo Usuário',
              content: 'Uma memória carregada pelo scroll infinito.',
              date: new Date().toISOString().split('T')[0],
              photos: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200'],
              likes: 0,
              comments: [],
              isLiked: false
            };
            addMemory(newMem);
            setMemories(prev => [...prev, {
              id: newMem.id,
              userId: newMem.userId,
              userName: newMem.userName,
              userAvatar: newMem.userAvatar,
              content: newMem.content,
              date: newMem.date,
              photos: newMem.photos,
              likes: newMem.likes,
              comments: 0,
              isLiked: !!newMem.isLiked
            }]);
            setPage(p => p + 1);
          }, 700);
        }
      });
    }, { rootMargin: '200px' });
    obs.observe(loadMoreRef.current);
    return () => obs.disconnect();
  }, [loadMoreRef.current]);
  const handleLike = (id: string) => {
    setMemories(prev => {
      const next = prev.map(memory => memory.id === id ? {
        ...memory,
        isLiked: !memory.isLiked,
        likes: memory.isLiked ? memory.likes - 1 : memory.likes + 1
      } : memory);
      // persist
      const stored = loadMemories();
      const idx = stored.findIndex(s => s.id === id);
      if (idx >= 0) {
        stored[idx].isLiked = !stored[idx].isLiked;
        stored[idx].likes = next.find(n => n.id === id)?.likes || stored[idx].likes;
        saveMemories(stored);
      }
      try { toast.showToast(next.find(n => n.id === id)?.isLiked ? 'Você curtiu a memória' : 'Curtir removida'); } catch (err) {}
      return next;
    });
  };
  const handleComment = (id: string) => {
    window.location.href = `/memory/${id}`;
  };
  const handleUserClick = (userId: string) => {
    window.location.href = `/profile/${userId}`;
  };
  const toast = useToast();
  if (isLoading) {
    return <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-6">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center py-12">
              <p className="font-mono text-gray-600">Carregando memórias...</p>
            </div>
          </div>
        </main>
      </>;
  }
  return <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-6 pb-12">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          {user && user.plan === 'free' && <LimitWarning type="memories" current={user.memoriesThisWeek} max={7} />}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sua Linha do Tempo</h2>
            <p className="text-sm font-mono text-gray-600">
              {memories.length} memórias
            </p>
          </div>

          {memories.length === 0 ? <div className="text-center py-12 border-2 border-dashed border-gray-300 bg-white">
              <p className="font-mono text-gray-600 mb-4">Nenhuma memória ainda.</p>
              <p className="text-sm font-mono text-gray-500">
                Comece a registrar seus momentos!
              </p>
            </div> : <div className="space-y-4">
              {memories.map(memory => <MemoryCard key={memory.id} memory={memory} onLike={handleLike} onComment={handleComment} onUserClick={handleUserClick} />)}
            </div>}
          <div ref={loadMoreRef} className="h-6" />
        </div>
      </main>
      <MobileNav />
    </>;
}