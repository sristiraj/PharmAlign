import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { mockTerritories, mockHCPs } from '../services/mockData';

const AIAdvisor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'init-1',
        role: 'model',
        text: 'Hello. I am your Territory Advisor. I can help you analyze workload balance, identify white space opportunities, or draft call plans. How can I assist you today?',
        timestamp: new Date()
      }
    ]);
    
    // Initialize Gemini context
    geminiService.initializeChat({
      territories: mockTerritories,
      hcps: mockHCPs
    }).catch(console.error);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = geminiService.sendMessageStream(userMessage.text);
      
      const responseId = (Date.now() + 1).toString();
      
      // Create placeholder for AI response
      setMessages(prev => [
        ...prev,
        { id: responseId, role: 'model', text: '', timestamp: new Date(), isStreaming: true }
      ]);

      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === responseId 
              ? { ...msg, text: fullText } 
              : msg
          )
        );
      }
      
      // Mark streaming as done
      setMessages(prev => 
        prev.map(msg => 
          msg.id === responseId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now().toString(), 
          role: 'model', 
          text: "I encountered an error processing your request.", 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center space-x-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">AI Territory Advisor</h2>
          <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div
                className={`p-4 rounded-2xl shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
                {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-pulse">|</span>}
              </div>
            </div>
          </div>
        ))}
        {isLoading && !messages.some(m => m.isStreaming) && (
             <div className="flex justify-start">
               <div className="flex max-w-[80%] space-x-3">
                 <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-600">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                 </div>
                 <div className="p-4 rounded-2xl bg-white text-slate-800 border border-slate-200 rounded-tl-none">
                   Thinking...
                 </div>
               </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about territory balance, specific HCPs, or scenario planning..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none outline-none text-sm min-h-[50px] max-h-32"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">
          AI generated responses may vary. Verify critical data in Rep360.
        </p>
      </div>
    </div>
  );
};

export default AIAdvisor;