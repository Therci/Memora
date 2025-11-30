import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MessageCircleIcon, HeartIcon, CalendarIcon } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { loadMemories, addComment, generateId } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function MemoryDetailPage() {
  const { id } = useParams();
  const [memory, setMemory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    // carregar memória do storage
    setTimeout(() => {
      const stored = loadMemories();
      const mem = stored.find(m => m.id === id);
      if (mem) {
        setMemory(mem);
      } else {
        setMemory({
          id,
          userId: '1',
          userName: 'Usuário',
          userAvatar: undefined,
          content: 'Detalhe da memória não encontrado.',
          date: new Date().toISOString().split('T')[0],
          photos: [],
          likes: 0,
          comments: [],
          isLiked: false
        });
      }
      setIsLoading(false);
    }, 200);
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-6">
          <div className="max-w-2xl mx-auto px-4 text-center py-12">
            <p className="font-mono text-gray-600">Carregando memória...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-6 pb-12">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <Card>
            <div className="flex items-center gap-3">
              <Avatar src={memory.userAvatar} alt={memory.userName} size="md" />
              <div className="flex-1">
                <div className="font-mono font-medium text-gray-900">{memory.userName}</div>
                <div className="flex items-center gap-1 text-xs font-mono text-gray-500">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{new Date(memory.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {memory.photos && memory.photos.length > 0 && (
              <div className="mt-4 border border-dashed border-gray-300 bg-gray-50 aspect-video flex items-center justify-center">
                <img src={memory.photos[0]} alt="Memory" className="max-w-full max-h-full object-contain" />
              </div>
            )}

            <p className="text-gray-900 font-mono text-sm leading-relaxed mt-4">{memory.content}</p>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" className={`flex items-center gap-2 ${memory.isLiked ? 'text-red-600' : ''}`}>
                <HeartIcon className="w-4 h-4" />
                <span className="text-xs">{memory.likes}</span>
              </Button>

              <Button variant="ghost" className="flex items-center gap-2">
                <MessageCircleIcon className="w-4 h-4" />
                <span className="text-xs">{memory.comments.length}</span>
              </Button>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Comentários</h3>

              <div className="space-y-3 mb-3">
                {memory.comments && memory.comments.length === 0 && <div className="text-sm font-mono text-gray-600">Seja o primeiro a comentar.</div>}
                {memory.comments && memory.comments.map((c: any) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div>
                      <div className="text-xs font-mono font-semibold">{c.userName}</div>
                      <div className="text-sm font-mono text-gray-700">{c.text}</div>
                      <div className="text-xs font-mono text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2">
                <label className="block text-sm font-mono text-gray-600 mb-1">Adicionar comentário</label>
                <textarea value={newComment} onChange={e => setNewComment(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm font-mono" rows={3} />
                <div className="mt-2 flex gap-2 justify-end">
                  <Button variant="secondary" onClick={() => setNewComment('')}>Limpar</Button>
                  <Button onClick={async () => {
                    if (!newComment.trim()) return;
                    const c = { id: generateId(), userName: user?.name || 'Você', text: newComment.trim(), createdAt: new Date().toISOString() };
                    addComment(memory.id, c);
                    setMemory((prev: any) => ({ ...prev, comments: [...(prev.comments || []), c] }));
                    setNewComment('');
                    try { toast.showToast('Comentário adicionado', undefined, 'success'); } catch (err) {}
                  }}>Comentar</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <MobileNav />
    </>
  );
}

export default MemoryDetailPage;
