import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from './LoadingSpinner';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullPage, setIsFullPage] = useState(false);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm OpusBot, your career assistant. I can help you with job searching, resume building, interview preparation, and career advice. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && checkApiKey()) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, showApiKeySetup]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userInput = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get OpenAI API key from environment variable or localStorage
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai-api-key') || 'YOUR_API_KEY';
      
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        throw new Error('Please set your OpenAI API key');
      }

      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Using the cheaper but still capable model
          messages: [
            { 
              role: "system", 
              content: "You are OpusBot, a friendly and professional job assistant helping users with career advice, job applications, resume building, interview preparation, and job search strategies. Always be helpful, encouraging, and provide actionable advice. Keep responses concise but informative." 
            },
            ...conversationHistory,
            { role: "user", content: userInput }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      
      let errorText = "I'm sorry, I'm having trouble right now. ";
      
      if (error.message?.includes('API key')) {
        errorText += "Please make sure your OpenAI API key is properly configured.";
      } else if (error.message?.includes('quota')) {
        errorText += "It looks like the API quota has been exceeded. Please check your OpenAI account.";
      } else if (error.message?.includes('rate limit')) {
        errorText += "I'm being rate limited. Please wait a moment and try again.";
      } else {
        errorText += "Please check your internet connection and try again.";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    if (isFullPage) {
      setIsFullPage(false);
      setIsMinimized(false);
    } else if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsFullPage(true);
    }
  };

  const handleApiKeySetup = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('openai-api-key', apiKeyInput.trim());
      setShowApiKeySetup(false);
      setApiKeyInput('');
      
      // Add confirmation message
      const confirmMessage: Message = {
        id: Date.now().toString(),
        text: "Great! Your OpenAI API key has been saved. I'm now ready to assist you!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmMessage]);
    }
  };

  const checkApiKey = () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai-api-key');
    return apiKey && apiKey !== 'YOUR_API_KEY';
  };

  return (
    <div className={`${isFullPage ? 'fixed inset-0 z-50' : 'fixed bottom-4 right-4 z-50 max-h-screen flex flex-col justify-end'}`}>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`${isFullPage ? 'w-full h-full' : 'w-96 sm:w-96 max-w-[calc(100vw-2rem)]'} bg-white shadow-2xl border-0 transition-all duration-300 ${
          isMinimized ? 'h-16' : isFullPage ? 'h-full' : 'h-[600px] max-h-[calc(100vh-2rem)]'
        } flex flex-col`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white text-gray-900 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Opusnex AI</h3>
                <p className="text-xs text-gray-500">Powered by OpenAI</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {!checkApiKey() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKeySetup(!showApiKeySetup)}
                  className="text-gray-600 hover:bg-gray-100 p-1"
                  title="Setup OpenAI API Key"
                >
                  🔑
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="text-gray-600 hover:bg-gray-100 p-1"
                title={isFullPage ? "Exit Full Page" : "Full Page"}
              >
                {isFullPage ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-gray-600 hover:bg-gray-100 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* API Key Setup */}
          {!isMinimized && showApiKeySetup && (
            <div className="p-4 bg-yellow-50 border-b border-yellow-200">
              <p className="text-sm text-yellow-800 mb-3">
                Please enter your OpenAI API key to start chatting:
              </p>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleApiKeySetup}
                  disabled={!apiKeyInput.trim()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </div>
              <p className="text-xs text-yellow-600 mt-2">
                Your API key is stored locally and only used to make requests to OpenAI.
              </p>
            </div>
          )}

          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-sm lg:max-w-lg px-4 py-3 rounded-lg shadow-sm ${
                        message.isUser
                          ? 'bg-green-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {!message.isUser && (
                          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.isUser ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {message.isUser && (
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span className="text-sm">Opusnex AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {!checkApiKey() ? (
                                      <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        Click the 🔑 button above to set up your OpenAI API key
                      </p>
                      <Button
                        onClick={() => setShowApiKeySetup(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Setup API Key
                      </Button>
                    </div>
                ) : (
                  <>
                    <div className="flex space-x-2">
                      <textarea
                        ref={inputRef as any}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask OpusBot anything..."
                        className="flex-1 resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[2.5rem] max-h-24"
                        disabled={isLoading}
                        rows={1}
                        style={{ 
                          height: 'auto',
                          minHeight: '2.5rem'
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 h-10"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Press Enter to send • OpusBot AI Assistant
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}; 