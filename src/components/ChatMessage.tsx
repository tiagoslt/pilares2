import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';

const USER_LABEL = import.meta.env.VITE_USER_LABEL || 'Você';
const ASSISTANT_LABEL = import.meta.env.VITE_ASSISTANT_LABEL || 'PI - Assistente Virtual do Projeto Pilares 2';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-2 md:gap-3 p-2 md:p-4 ${isUser ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg`}>
      <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-500' : 'bg-gray-500'
      }`}>
        {isUser ? (
          <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
        ) : (
          <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs md:text-sm font-medium text-gray-700">
            {isUser ? USER_LABEL : ASSISTANT_LABEL}
          </span>
          <span className="text-xs text-gray-500 hidden sm:inline">
            {timestamp.toLocaleTimeString()}
          </span>
        </div>
        <div className="text-sm md:text-base text-gray-800 prose prose-sm max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Customizar componentes para melhor aparência
              h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
              h2: ({children}) => <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>,
              h3: ({children}) => <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>,
              p: ({children}) => <p className="mb-2 last:mb-0 text-gray-800">{children}</p>,
              ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
              li: ({children}) => <li className="text-gray-800">{children}</li>,
              code: ({children, className}) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-900">{children}</code>
                ) : (
                  <code className="block bg-gray-100 p-2 rounded text-xs font-mono text-gray-900 overflow-x-auto whitespace-pre">{children}</code>
                );
              },
              pre: ({children}) => <pre className="bg-gray-100 p-2 rounded mb-2 overflow-x-auto">{children}</pre>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-700 mb-2">{children}</blockquote>,
              strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
              em: ({children}) => <em className="italic text-gray-800">{children}</em>,
              a: ({children, href}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
              table: ({children}) => <table className="border-collapse border border-gray-300 mb-2 text-xs">{children}</table>,
              th: ({children}) => <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-semibold">{children}</th>,
              td: ({children}) => <td className="border border-gray-300 px-2 py-1">{children}</td>,
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}