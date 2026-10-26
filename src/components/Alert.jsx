import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={`border rounded-lg p-3 text-sm flex items-start gap-2.5 transition-all ${styles[type] || styles.error}`}
    >
      {icons[type] || icons.error}
      <div className="flex-1 font-medium leading-relaxed">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-gray-400 hover:text-gray-600 font-bold ml-2 text-base leading-none"
          aria-label="Cerrar alerta"
        >
          &times;
        </button>
      )}
    </div>
  );
}
