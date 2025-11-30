import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export function SettingsPage() {
  const { user, logout } = useAuth();

  const handleUpdateProfile = () => {
    alert('Funcionalidade de atualização de perfil em desenvolvimento.');
  };

  const handleChangePassword = () => {
    alert('Funcionalidade de mudança de senha em desenvolvimento.');
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Configurações</h2>

        <Card className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Informações do Perfil</h3>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Nome de Usuário</label>
              <input
                type="text"
                value={user?.name || ''}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">E-mail</label>
              <input
                type="email"
                value={user?.email || ''}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                readOnly
              />
            </div>
            <Button onClick={handleUpdateProfile} className="w-full sm:w-auto">
              Atualizar Perfil
            </Button>
          </div>
        </Card>

        <Card className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Segurança</h3>
          <Button variant="secondary" onClick={handleChangePassword} className="w-full sm:w-auto">
            Mudar Senha
          </Button>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Sair</h3>
          <Button variant="ghost" onClick={logout} className="text-red-600 hover:bg-red-50 border-red-300">
            Sair da Conta
          </Button>
        </Card>
      </div>
    </>
  );
}
