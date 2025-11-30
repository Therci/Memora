import React, { useState, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { LimitWarning } from '../components/LimitWarning';
import { ImageIcon, X } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { addMemory, generateId } from '../utils/storage';
import { useToast } from '../context/ToastContext';

export function CreateMemoryPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [media, setMedia] = useState<File[]>([]);
  const [importedMediaUrls, setImportedMediaUrls] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<{id: string; name: string}[]>([]);
  const mockUsers = [
    { id: 'u1', name: 'alice' },
    { id: 'u2', name: 'bob' },
    { id: 'u3', name: 'carla' },
    { id: 'u4', name: 'diego' }
  ];

  const canCreateMemory = user && user.memoriesThisWeek < 7;

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMedia([...media, ...files]);
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const addMention = (user: {id: string; name: string}) => {
    if (!mentionedUsers.find(u => u.id === user.id)) {
      setMentionedUsers(prev => [...prev, user]);
    }
    setMentionQuery('');
  };

  const removeMention = (id: string) => {
    setMentionedUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleImportFromSocial = async (provider: 'facebook' | 'instagram') => {
    setIsImporting(true);
    await new Promise(resolve => setTimeout(resolve, 1400));
    const imported = [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200'
    ];
    setImportedMediaUrls(prev => [...prev, ...imported]);
    setIsImporting(false);
    setShowSocialModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateMemory) {
      return;
    }
    setIsSubmitting(true);
    // Prepare photos: imported + local object URLs
    const localUrls = media.map(f => URL.createObjectURL(f));
    const photos = [...importedMediaUrls, ...localUrls];

    const newMemory = {
      id: generateId(),
      userId: user?.id || '0',
      userName: user?.name || 'Usuário',
      userAvatar: user?.avatar,
      content,
      date,
      photos,
      likes: 0,
      comments: [],
      isLiked: false
    };

    addMemory(newMemory as any);

    // Update user's weekly counter in localStorage
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const obj = JSON.parse(stored);
        obj.memoriesThisWeek = (obj.memoriesThisWeek || 0) + 1;
        localStorage.setItem('memora_user', JSON.stringify(obj));
      }
    } catch (err) {
      // ignore
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    toast.showToast('Memória criada com sucesso', 'Compartilhado', 'success');
    setTimeout(() => window.location.href = '/feed', 300);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-6 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          {user && user.plan === 'free' && (
            <div className="mb-4">
              <LimitWarning type="memories" current={user.memoriesThisWeek} max={7} />
            </div>
          )}

          <Card>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Create a Memory
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="O que aconteceu?"
                multiline
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Descreva sua Memória..."
                required
                disabled={!canCreateMemory}
              />

              <Input
                type="date"
                label="Quando isso aconteceu?"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                disabled={!canCreateMemory}
              />

              <Input
                label="Onde isso aconteceu?"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Digite o local..."
                disabled={!canCreateMemory}
              />

              <Input
                label="Tags (separadas por vírgula)"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="e.g., viagem, família, aventura"
                disabled={!canCreateMemory}
              />

              <div>
                <label className="block text-sm font-mono text-gray-600 mb-1">Mencionar pessoas</label>
                <input
                  value={mentionQuery}
                  onChange={e => setMentionQuery(e.target.value)}
                  placeholder="Digite um nome e pressione Enter ou clique na sugestão"
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 font-mono text-sm rounded-lg"
                />
                {mentionQuery && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm">
                    {mockUsers.filter(u => u.name.includes(mentionQuery.toLowerCase()) && !mentionedUsers.find(m => m.id === u.id)).map(u => (
                      <button key={u.id} onClick={() => addMention(u)} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm font-mono">@{u.name}</button>
                    ))}
                  </div>
                )}

                {mentionedUsers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mentionedUsers.map(u => (
                      <span key={u.id} className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full text-sm font-mono">
                        @{u.name}
                        <button type="button" onClick={() => removeMention(u.id)} className="text-xs text-red-600">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-600 mb-2">
                  Adicionar Fotos ou Videos
                </label>
                <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer rounded-lg">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    disabled={!canCreateMemory}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-mono text-gray-500">
                      {media.length > 0 ? `${media.length} file(s) selected` : 'Click to upload photos or videos'}
                    </p>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                      PNG, JPG, MP4, WebM up to 10MB each
                    </p>
                  </label>
                </div>
                {media.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {media.map((file, idx) => (
                      <div key={idx} className="relative bg-gray-100 rounded-lg p-2 text-center">
                        <p className="text-xs font-mono text-gray-600 truncate">{file.name}</p>
                        <button
                          type="button"
                          onClick={() => removeMedia(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {importedMediaUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {importedMediaUrls.map((url, idx) => (
                      <div key={idx} className="relative bg-gray-100 rounded-lg overflow-hidden">
                        <img src={url} alt={`imported-${idx}`} className="w-full h-32 object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-600 mb-2">
                  Privacidade
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={privacy === 'public'}
                      onChange={e => setPrivacy(e.target.value as 'public')}
                      disabled={!canCreateMemory}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-mono text-gray-700">
                      Publica
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={privacy === 'private'}
                      onChange={e => setPrivacy(e.target.value as 'private')}
                      disabled={!canCreateMemory}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-mono text-gray-700">
                      Privada
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.location.href = '/feed'}
                  className="flex-1"
                >
                  Cancele
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!canCreateMemory || isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Compartilhar Memória'}
                </Button>
              </div>

              {!canCreateMemory && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-sm font-mono text-center rounded-lg">
                  Limite semanal atingido. Faça upgrade para Premium para memórias ilimitadas.
                </div>
              )}
            </form>
          </Card>
        </div>
      </main>
      {showSocialModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Vincular com Facebook/Instagram?</h3>
            <p className="text-sm font-mono text-gray-600 mt-2">Deseja importar fotos e publicações das suas contas sociais?</p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowSocialModal(false)}>Não</Button>
              <Button onClick={() => handleImportFromSocial('facebook')} disabled={isImporting}>
                {isImporting ? 'Importando...' : 'Sim, importar do Facebook'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isImporting && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow">Importing posts...</div>
      )}

      <MobileNav />
    </>
  );
}
