import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatPopup from './ChatPopup';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center hover:scale-110 active:scale-95"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Popup do chat */}
      {isOpen && (
        <ChatPopup onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}