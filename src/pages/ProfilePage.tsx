import React, { useEffect, useState, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { loadMemories, saveMemories, MemoryItem } from '../utils/storage';
import { Header } from '../components/Header';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { MemoryCard } from '../components/MemoryCard';
import { CalendarIcon, ImageIcon, MapPin, Tag } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';

export function ProfilePage() {
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [memories, setMemories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userId: paramUserId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      const uid = paramUserId || user?.id || '1';
      setProfileUser({
        id: uid,
        name: user?.id === uid ? user?.name : `Usuário ${uid}`,
        email: user?.email || 'user@example.com',
        plan: user?.plan || 'free',
        joinedDate: '2024-01-15',
        totalMemories: 0,
        totalTimelines: 1
      });

      const all = loadMemories();
      const userMems = all.filter(m => m.userId === uid);
      setMemories(userMems.map((m: MemoryItem) => ({
        id: m.id,
        userId: m.userId,
        userName: m.userName,
        userAvatar: m.userAvatar,
        content: m.content,
        date: m.date,
        location: undefined,
        tags: undefined,
        likes: m.likes,
        comments: (m.comments || []).length,
        isLiked: !!m.isLiked
      })) as any);

      setProfileUser(prev => prev ? { ...prev, totalMemories: userMems.length } : null);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [user, paramUserId]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-6">
          <div className="max-w-4xl mx-auto px-4">
              <div className="text-center py-12">
              <p className="font-mono text-gray-600">Carregando perfil...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-6 pb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Card>
            <div className="flex items-start gap-4">
              <Avatar src={profileUser.avatar} alt={profileUser.name} size="lg" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileUser.name}
                </h1>
                <p className="text-sm font-mono text-gray-600 mt-1">
                  {profileUser.email}
                </p>
                <div className="flex items-center gap-1 text-xs font-mono text-gray-500 mt-2">
                  <CalendarIcon className="w-3 h-3" />
                  <span>
                    Entrou em {new Date(profileUser.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs font-mono font-semibold rounded-lg shadow-md">
                  {profileUser.plan.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {profileUser.totalMemories}
                </div>
                <div className="text-xs font-mono text-gray-600 mt-1">Memórias</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {profileUser.totalTimelines}
                </div>
                <div className="text-xs font-mono text-gray-600 mt-1">Linhas do Tempo</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {user?.memoriesThisWeek || 0}/7
                </div>
                <div className="text-xs font-mono text-gray-600 mt-1">Esta Semana</div>
              </div>
            </div>
          </Card>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Memórias Recentes
            </h2>
            {memories.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-mono text-gray-600">Nenhuma memória ainda</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {memories.map(memory => (
                  <MemoryCard key={memory.id} memory={memory} onLike={(id) => {
                    // toggle like locally and persist
                    setMemories(prev => prev.map(m => m.id === id ? { ...m, isLiked: !m.isLiked, likes: m.isLiked ? m.likes - 1 : m.likes + 1 } : m));
                    try {
                      const all = loadMemories();
                      const idx = all.findIndex(a => a.id === memory.id);
                      if (idx >= 0) {
                        all[idx].isLiked = !all[idx].isLiked;
                        all[idx].likes = memory.isLiked ? Math.max(0, memory.likes - 1) : memory.likes + 1;
                        saveMemories(all);
                      }
                    } catch (err) {}
                  }} onComment={(id) => window.location.href = `/memory/${id}`} onUserClick={(id) => window.location.href = `/profile/${id}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
