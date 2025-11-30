import React from 'react';
import { Home, PlusCircle, User } from 'lucide-react';

export function MobileNav() {
  return (
    <nav className="fixed bottom-4 left-0 right-0 z-20 flex items-center justify-center">
      <div className="mx-auto max-w-2xl w-full px-4">
        <div className="bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-between px-6 py-3">
          <button onClick={() => (window.location.href = '/feed')} className="flex flex-col items-center text-gray-700">
            <Home className="w-5 h-5" />
            <span className="text-xs font-mono">Início</span>
          </button>

          <button onClick={() => (window.location.href = '/create-memory')} className="-mt-2 bg-gray-700 text-white rounded-full p-3 shadow-md">
            <PlusCircle className="w-5 h-5" />
          </button>

          <button onClick={() => (window.location.href = `/profile/${localStorage.getItem('memora_user') ? JSON.parse(localStorage.getItem('memora_user')!).id : ''}`)} className="flex flex-col items-center text-gray-700">
            <User className="w-5 h-5" />
            <span className="text-xs font-mono">Perfil</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default MobileNav;
