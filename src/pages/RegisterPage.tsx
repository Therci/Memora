import React, { useState, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
export function RegisterPage() {
  const {
    register
    , googleLogin
  } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      window.location.href = '/feed';
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      await googleLogin();
      window.location.href = '/feed';
    } catch (err) {
      setError('Google sign-up failed.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gray-700 border-2 border-gray-800 items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Memora</h1>
          <p className="text-gray-600 font-mono text-sm">
            Comece a preservar suas memórias
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" label="Nome" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" required />

            <Input type="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />

            <Input type="password" label="Senha" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />

            {error && <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-sm font-mono">
                {error}
              </div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
            <div className="mt-3">
              <Button type="button" variant="secondary" className="w-full" onClick={handleGoogle} disabled={isLoading}>
                Continuar com Google
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm font-mono text-gray-600">
              Já tem uma conta?{' '}
              <a href="/login" className="text-gray-900 underline hover:no-underline">
                Entrar
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>;
}