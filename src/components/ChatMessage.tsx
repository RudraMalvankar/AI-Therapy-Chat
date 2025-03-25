import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'assistant';

  return (
    <div className={`flex items-start gap-4 message-animation ${isBot ? 'bg-gradient-to-r from-purple-50 to-transparent' : ''} p-4 rounded-lg mb-4 transition-all duration-300 hover:shadow-md`}>
      <div className={`p-3 rounded-full ${isBot ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'}`}>
        {isBot ? <Bot size={24} className="text-white" /> : <User size={24} className="text-white" />}
      </div>
      <div className="flex-1">
        <div className={`text-sm mb-1 ${isBot ? 'text-purple-600' : 'text-blue-600'}`}>
          {isBot ? 'AI Therapist' : 'You'}
        </div>
        <p className="text-gray-800 leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
};