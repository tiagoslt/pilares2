import React, { useEffect, useRef } from 'react';
import { Bot, Trash2, MessageCircle, RotateCcw } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ErrorMessage from '../components/ErrorMessage';
import useChat from '../hooks/useChat';

const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Chat com IA';
const APP_SUBTITLE = import.meta.env.VITE_APP_SUBTITLE || 'Assistente inteligente do SEPLAN-PI';
const WELCOME_TITLE = import.meta.env.VITE_WELCOME_TITLE || 'Bem-vindo ao Chat com IA!';
const WELCOME_MESSAGE = import.meta.env.VITE_WELCOME_MESSAGE || 'Envie sua primeira mensagem para começar a conversar com o assistente inteligente.';
const TYPING_MESSAGE = import.meta.env.VITE_TYPING_MESSAGE || 'Assistente está digitando...';
const CLEAR_CHAT_TEXT = import.meta.env.VITE_CLEAR_CHAT_TEXT || 'Limpar Chat';
const NEW_SESSION_TEXT = import.meta.env.VITE_NEW_SESSION_TEXT || 'Nova Sessão';
const FOOTER_TEXT = import.meta.env.VITE_FOOTER_TEXT || 'Powered by SEPLAN-PI • Assistente IA v1.0';

export default function ChatPage() {
  const { messages, isLoading, error, sendMessage, clearMessages, clearError, clearSession, sessionId } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-safe">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-800">{APP_TITLE}</h1>
                <p className="text-sm md:text-base text-gray-600 hidden sm:block">{APP_SUBTITLE}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 text-sm md:text-base text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{CLEAR_CHAT_TEXT}</span>
                </button>
              )}
              <button
                onClick={clearSession}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 text-sm md:text-base text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={`ID da Sessão: ${sessionId}`}
              >
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{NEW_SESSION_TEXT}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-200px)] md:h-[600px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-4 text-gray-400" />
                <p className="text-base md:text-lg font-medium text-center px-4">{WELCOME_TITLE}</p>
                <p className="text-sm text-center max-w-md px-4">
                  {WELCOME_MESSAGE}
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-2 p-2 md:p-4 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-500">{TYPING_MESSAGE}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-2 md:px-4 pb-2">
              <ErrorMessage message={error} onClose={clearError} />
            </div>
          )}

          {/* Input Area */}
          <div className="p-2 md:p-4 border-t bg-gray-50 rounded-b-lg">
            <ChatInput
              onSendMessage={sendMessage}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 md:mt-6 text-gray-500 text-xs md:text-sm px-4">
          <p>{FOOTER_TEXT}</p>
        </div>
      </div>
    </div>
  );
}