import React, { memo } from 'react';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { HeartIcon, MessageCircleIcon, CalendarIcon } from 'lucide-react';
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
interface MemoryCardProps {
  memory: Memory;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onUserClick: (userId: string) => void;
}
export function MemoryCard({
  memory,
  onLike,
  onComment,
  onUserClick
}: MemoryCardProps) {
  const [idx, setIdx] = React.useState(0);
  const photos = memory.photos && memory.photos.length > 0 ? memory.photos : (memory.photo ? [memory.photo] : []);
  return <Card className="space-y-3">
      <div className="flex items-center gap-3">
        <button onClick={() => onUserClick(memory.userId)}>
          <Avatar src={memory.userAvatar} alt={memory.userName} size="md" />
        </button>
        <div className="flex-1">
          <button onClick={() => onUserClick(memory.userId)} className="font-mono font-medium text-gray-900 hover:underline">
            {memory.userName}
          </button>
          <div className="flex items-center gap-1 text-xs font-mono text-gray-500">
            <CalendarIcon className="w-3 h-3" />
            <span>{new Date(memory.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {photos.length > 0 && <div className="border border-dashed border-gray-300 bg-gray-50 aspect-video relative">
          <img src={photos[idx]} alt={`Memory ${idx}`} className="w-full h-full object-cover" />
          {photos.length > 1 && <>
            <button onClick={() => setIdx((p) => (p - 1 + photos.length) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2">
              ‹
            </button>
            <button onClick={() => setIdx((p) => (p + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2">
              ›
            </button>
          </>}
        </div>}

      <p className="text-gray-900 font-mono text-sm leading-relaxed">
        {memory.content}
      </p>

      <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
        <Button variant="ghost" onClick={() => onLike(memory.id)} className={`flex items-center gap-1 ${memory.isLiked ? 'text-red-600' : ''}`}>
          <HeartIcon className={`w-4 h-4 ${memory.isLiked ? 'fill-current' : ''}`} />
          <span className="text-xs">{memory.likes}</span>
        </Button>

        <Button variant="ghost" onClick={() => onComment(memory.id)} className="flex items-center gap-1">
          <MessageCircleIcon className="w-4 h-4" />
          <span className="text-xs">{memory.comments}</span>
        </Button>
      </div>
    </Card>;
}