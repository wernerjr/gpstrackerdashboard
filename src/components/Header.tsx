'use client';

import { useState } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LocationRecord } from '@/types/location';

interface HeaderProps {
  onDataChange: () => void;
}

export function Header({ onDataChange }: HeaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCleanSessions = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/clean-sessions', { method: 'POST' });
      onDataChange?.();
    } catch (error) {
      console.error('Erro ao limpar sessões:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white">
              GPS TrackerDashboard
            </h1>
          </div>

          {/* Botão de Limpar */}
          <button
            onClick={handleCleanSessions}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors relative group"
            title="Remover sessões incompletas"
          >
            {isLoading ? (
              <svg 
                className="animate-spin w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}

            {/* Tooltip */}
            <span className="absolute hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap border border-gray-800">
              Remover sessões incompletas
            </span>
          </button>
        </div>
      </div>
    </header>
  );
} 