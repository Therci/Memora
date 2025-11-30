import React, { useState, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
export function LoginPage() {
  const {
    login
    , googleLogin
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      window.location.href = '/feed';
    } catch (err) {
      setError('Invalid credentials. Please try again.');
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
      setError('Google sign-in failed.');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Memora</h1>
          <p className="text-gray-600 font-mono text-sm">
            Acesse suas memórias
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />

            <Input type="password" label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />

            {error && <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-sm font-mono">
                {error}
              </div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="mt-3">
              <Button type="button" variant="secondary" className="w-full" onClick={handleGoogle} disabled={isLoading}>
                Entrar com Google
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm font-mono text-gray-600">
              Não tem uma conta?{' '}
              <a href="/register" className="text-gray-900 underline hover:no-underline">
                Cadastre-se
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>;
}