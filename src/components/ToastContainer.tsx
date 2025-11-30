import React from 'react';

type Toast = {
  id: string;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'error';
};

export default function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-3">
      {toasts.map(t => (
        <div key={t.id} className={`max-w-sm w-full p-3 rounded-lg shadow-md border ${t.type === 'success' ? 'bg-green-50 border-green-200' : t.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              {t.title && <div className="font-semibold text-sm text-gray-800">{t.title}</div>}
              <div className="text-sm font-mono text-gray-700">{t.message}</div>
            </div>
            <div>
              <button onClick={() => onRemove(t.id)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
