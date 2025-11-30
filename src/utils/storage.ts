export interface MemoryItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  photos?: string[];
  likes: number;
  comments: { id: string; userName: string; text: string; createdAt?: string }[];
  isLiked?: boolean;
}

const MEM_KEY = 'memora_memories';

export function loadMemories(): MemoryItem[] {
  try {
    const raw = localStorage.getItem(MEM_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MemoryItem[];
  } catch (err) {
    console.error('loadMemories error', err);
    return [];
  }
}

export function saveMemories(list: MemoryItem[]) {
  localStorage.setItem(MEM_KEY, JSON.stringify(list));
  try {
    window.dispatchEvent(new CustomEvent('memora-change'));
  } catch (err) {
    // ignore
  }
}

export function addMemory(mem: MemoryItem) {
  const list = loadMemories();
  list.unshift(mem);
  saveMemories(list);
}

export function updateMemory(updated: MemoryItem) {
  const list = loadMemories();
  const idx = list.findIndex(m => m.id === updated.id);
  if (idx >= 0) {
    list[idx] = updated;
    saveMemories(list);
  }
}

export function addComment(memoryId: string, comment: { id: string; userName: string; text: string; createdAt?: string }) {
  const list = loadMemories();
  const mem = list.find(m => m.id === memoryId);
  if (!mem) return;
  mem.comments = mem.comments || [];
  mem.comments.push(comment);
  saveMemories(list);
}

export function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}
