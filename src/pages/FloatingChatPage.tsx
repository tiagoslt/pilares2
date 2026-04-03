import React from 'react';
import FloatingChatButton from '../components/FloatingChatButton';

export default function FloatingChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pb-safe">
      {/* Conteúdo da página em branco */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Página com Chat Flutuante
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 px-4">
            Esta é uma página em branco com um botão de chat flutuante no canto inferior direito.
          </p>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8 max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              Conteúdo da Página
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              Aqui você pode adicionar qualquer conteúdo que desejar. O chat está disponível
              através do botão flutuante que aparece no canto inferior direito da tela.
            </p>
            <p className="text-sm md:text-base text-gray-600">
              Clique no botão para abrir o chat em um popup e começar a conversar com o
              assistente inteligente.
            </p>
          </div>
        </div>
      </div>

      {/* Botão flutuante do chat */}
      <FloatingChatButton />
    </div>
  );
}