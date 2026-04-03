import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, Trash2, MessageCircle, RotateCcw, X, Minimize2 } from 'lucide-react';
import ChatInput from './ChatInput';
import ErrorMessage from './ErrorMessage';
import useChat from '../hooks/useChat';

const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Chat com IA';
const APP_SUBTITLE = import.meta.env.VITE_APP_SUBTITLE || 'Assistente inteligente do Projeto Pilares 2';
const WELCOME_TITLE = import.meta.env.VITE_WELCOME_TITLE || 'Bem-vindo ao Chat com IA!';
const WELCOME_MESSAGE = import.meta.env.VITE_WELCOME_MESSAGE || 'Envie sua primeira mensagem para começar a conversar com o assistente inteligente.';
const TYPING_MESSAGE = import.meta.env.VITE_TYPING_MESSAGE || 'Assistente está digitando...';
const CLEAR_CHAT_TEXT = import.meta.env.VITE_CLEAR_CHAT_TEXT || 'Limpar Chat';
const NEW_SESSION_TEXT = import.meta.env.VITE_NEW_SESSION_TEXT || 'Nova Sessão';

interface ChatPopupProps {
  onClose: () => void;
}

export default function ChatPopup({ onClose }: ChatPopupProps) {
  const { messages, isLoading, error, sendMessage, clearMessages, clearError, clearSession, sessionId } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-x-2 bottom-20 top-16 md:bottom-24 md:right-6 md:left-auto md:top-auto md:w-96 md:h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-blue-500 text-white p-3 md:p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-xs md:text-sm">{APP_TITLE}</h3>
              <p className="text-xs opacity-90 hidden md:block">{APP_SUBTITLE}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-3 md:p-3 border-b bg-gray-50 flex items-center justify-end gap-2 md:gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{CLEAR_CHAT_TEXT}</span>
            </button>
          )}
          <button
            onClick={clearSession}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title={`ID da Sessão: ${sessionId}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{NEW_SESSION_TEXT}</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-3 space-y-3 md:space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-8 h-8 md:w-8 md:h-8 mb-3 md:mb-3 text-gray-400" />
              <p className="text-sm md:text-sm font-medium text-center px-4">{WELCOME_TITLE}</p>
              <p className="text-xs text-center max-w-xs mt-2 px-4">
                {WELCOME_MESSAGE}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.isUser ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-3 md:p-3`}>
                <div className={`flex-shrink-0 w-6 h-6 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                  message.isUser ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {message.isUser ? (
                    <div className="w-3 h-3 md:w-3 md:h-3 bg-white rounded-full" />
                  ) : (
                    <Bot className="w-3 h-3 md:w-3 md:h-3 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs md:text-xs font-medium text-gray-700">
                      {message.isUser ? 'Você' : 'IA'}
                    </span>
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm md:text-sm text-gray-800 prose prose-sm max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Componentes customizados para o popup (tamanhos menores)
                        h1: ({children}) => <h1 className="text-sm font-bold mb-1 text-gray-900">{children}</h1>,
                        h2: ({children}) => <h2 className="text-sm font-bold mb-1 text-gray-900">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xs font-bold mb-1 text-gray-900">{children}</h3>,
                        p: ({children}) => <p className="mb-1 last:mb-0 text-gray-800">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-1 space-y-0.5">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside mb-1 space-y-0.5">{children}</ol>,
                        li: ({children}) => <li className="text-gray-800 text-xs">{children}</li>,
                        code: ({children, className}) => {
                          const isInline = !className;
                          return isInline ? (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-900">{children}</code>
                          ) : (
                            <code className="block bg-gray-100 p-1.5 rounded text-xs font-mono text-gray-900 overflow-x-auto whitespace-pre">{children}</code>
                          );
                        },
                        pre: ({children}) => <pre className="bg-gray-100 p-1.5 rounded mb-1 overflow-x-auto">{children}</pre>,
                        blockquote: ({children}) => <blockquote className="border-l-2 border-gray-300 pl-2 italic text-gray-700 mb-1 text-xs">{children}</blockquote>,
                        strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({children}) => <em className="italic text-gray-800">{children}</em>,
                        a: ({children, href}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline text-xs" target="_blank" rel="noopener noreferrer">{children}</a>,
                        table: ({children}) => <table className="border-collapse border border-gray-300 mb-1 text-xs w-full">{children}</table>,
                        th: ({children}) => <th className="border border-gray-300 px-1 py-0.5 bg-gray-100 font-semibold text-xs">{children}</th>,
                        td: ({children}) => <td className="border border-gray-300 px-1 py-0.5 text-xs">{children}</td>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-3 p-3 md:p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 md:w-6 md:h-6 bg-gray-500 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 md:w-3 md:h-3 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-500">{TYPING_MESSAGE}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-3 md:px-3 pb-3">
            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
              <div className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5">⚠️</div>
              <div className="flex-1">
                <p className="text-red-800 text-sm break-words">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 md:p-3 border-t bg-gray-50 rounded-b-lg">
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </>
  );
}