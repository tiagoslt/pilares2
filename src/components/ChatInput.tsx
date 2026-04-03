import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

const INPUT_PLACEHOLDER = import.meta.env.VITE_INPUT_PLACEHOLDER || 'Digite sua mensagem...';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 md:gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={INPUT_PLACEHOLDER}
        className="flex-1 min-h-[44px] md:min-h-[44px] max-h-28 md:max-h-32 px-4 md:px-4 py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        disabled={disabled}
        rows={1}
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="px-4 md:px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 md:w-5 md:h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5 md:w-5 md:h-5" />
        )}
      </button>
    </form>
  );
}