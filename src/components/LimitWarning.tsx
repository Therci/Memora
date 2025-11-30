import React, { memo } from 'react';
import { AlertCircleIcon } from 'lucide-react';
interface LimitWarningProps {
  type: 'memories' | 'timelines';
  current: number;
  max: number;
}
export function LimitWarning({
  type,
  current,
  max
}: LimitWarningProps) {
  const isAtLimit = current >= max;
  const percentage = current / max * 100;
  if (percentage < 70) return null;
  return <div className={`p-4 border ${isAtLimit ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'}`}>
      <div className="flex items-start gap-3">
        <AlertCircleIcon className={`w-5 h-5 flex-shrink-0 ${isAtLimit ? 'text-red-600' : 'text-yellow-600'}`} />
        <div className="flex-1">
          <p className={`font-mono text-sm ${isAtLimit ? 'text-red-900' : 'text-yellow-900'}`}>
            {isAtLimit ? <>
                <strong>Limite atingido:</strong> Você usou todas as {max} {type} para
                este {type === 'memories' ? 'semana' : 'mês'}.
              </> : <>
                <strong>Quase no limite:</strong> {current} de {max} {type} usados
                nesta {type === 'memories' ? 'semana' : 'mês'}.
              </>}
          </p>
          <p className="text-xs font-mono text-gray-600 mt-1">
            Faça upgrade para Premium para limites ilimitados.
          </p>
        </div>
      </div>
    </div>;
}