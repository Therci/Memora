import React, { memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import { Settings } from 'lucide-react';
import { Button } from './Button';
import { LogOutIcon, PlusIcon } from 'lucide-react';
export function Header() {
  const {
    user,
    logout
  } = useAuth();
  return <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/feed" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Memora</h1>
        </a>

        {user && <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => window.location.href = '/settings'} className="p-2" title="Configurações">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={() => window.location.href = '/create-memory'} className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Memória</span>
            </Button>

            <button onClick={() => window.location.href = `/profile/${user.id}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <Avatar src={user.avatar} alt={user.name} size="sm" />
              <span className="hidden sm:inline text-sm font-mono text-gray-700">
                {user.name}
              </span>
            </button>

            <Button variant="ghost" onClick={logout} className="p-2" title="Sair">
              <LogOutIcon className="w-4 h-4" />
            </Button>
          </div>}
      </div>
    </header>;
}