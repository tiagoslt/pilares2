import React, { useState } from 'react';
import ChatPage from './pages/ChatPage';
import FloatingChatPage from './pages/FloatingChatPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'chat' | 'floating'>('chat');

  return (
    <div>
      {/* Navegação simples para demonstração */}
      <div className="fixed top-2 left-2 md:top-4 md:left-4 z-50 flex gap-1 md:gap-2">
        <button
          onClick={() => setCurrentPage('chat')}
          className={`px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            currentPage === 'chat'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="hidden sm:inline">Chat Completo</span>
          <span className="sm:hidden">Completo</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('floating')}
          className={`px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            currentPage === 'floating'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="hidden sm:inline">Chat Flutuante</span>
          <span className="sm:hidden">Flutuante</span>
        </button>
        
      </div>

      {/* Renderização condicional das páginas */}
      {currentPage === 'floating' ? (
        <FloatingChatPage />
      ) : (
        <div className="pt-12 md:pt-16">
          <ChatPage />
        </div>
      )}
    </div>
  );
}

export default App;