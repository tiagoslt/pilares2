import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatHook {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
  clearSession: () => void;
  sessionId: string;
}

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://webhook-ia.seplan.pi.gov.br/webhook/6e13ac90-2eaa-4c54-a322-307a401ec1f4/chat';

// Gera um ID de sessão único para o usuário
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};
export default function useChat(): ChatHook {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => generateSessionId());

  const sendMessage = useCallback(async (message: string) => {
    // Validação básica antes de enviar
    if (!message.trim()) {
      setError('Mensagem não pode estar vazia');
      return;
    }

    if (!sessionId) {
      setError('ID da sessão não está disponível');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Adiciona mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Validação da URL do webhook
      if (!WEBHOOK_URL) {
        throw new Error('URL do webhook não configurada');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          chatInput: message,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Erro na requisição: ${response.status}`;
        
        // Adiciona descrição do status HTTP
        switch (response.status) {
          case 400:
            errorMessage += ' - Requisição inválida';
            break;
          case 401:
            errorMessage += ' - Não autorizado';
            break;
          case 403:
            errorMessage += ' - Acesso negado';
            break;
          case 404:
            errorMessage += ' - Endpoint não encontrado';
            break;
          case 500:
            errorMessage += ' - Erro interno do servidor';
            break;
          case 502:
            errorMessage += ' - Bad Gateway';
            break;
          case 503:
            errorMessage += ' - Serviço indisponível';
            break;
          default:
            errorMessage += ` - ${response.statusText}`;
        }
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          } else if (errorData.error) {
            errorMessage += ` - ${errorData.error}`;
          } else if (errorData.details) {
            errorMessage += ` - ${errorData.details}`;
          }
        } catch (parseError) {
          // Se não conseguir fazer parse do JSON, usa apenas a mensagem original
          console.warn('Não foi possível fazer parse da resposta de erro:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Resposta inválida do servidor - não é um JSON válido');
      }
      
      // Processa a resposta do N8N
      let aiResponse = 'Resposta recebida, mas conteúdo não disponível.';
      
      if (data && data.output) {
        // Resposta direta do N8N com campo 'output'
        aiResponse = data.output;
      } else if (data && Array.isArray(data) && data.length > 0 && data[0].output) {
        // Caso seja um array (fallback)
        aiResponse = data[0].output;
      } else if (data && data.response) {
        aiResponse = data.response;
      } else if (data && data.message) {
        aiResponse = data.message;
      } else {
        console.warn('Formato de resposta inesperado:', data);
      }
      
      // Adiciona resposta da IA
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      
      // Remove a mensagem do usuário se houve erro
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      
      let errorMessage = 'Erro desconhecido ao conectar com a IA.';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Timeout: A requisição demorou muito para responder';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Erro de rede: Verifique sua conexão com a internet ou se o servidor está disponível';
        } else if (err.message.includes('CORS')) {
          errorMessage = 'Erro de CORS: O servidor não permite requisições desta origem';
        } else {
          errorMessage = `Erro ao conectar com a IA: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSession = useCallback(() => {
    setMessages([]);
    setError(null);
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    console.log('Nova sessão criada:', newSessionId);
  }, []);
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError,
    clearSession,
    sessionId,
  };
}