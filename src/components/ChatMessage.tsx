import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'assistant';

  return (
    <div className={`flex items-start gap-3 message-animation ${isBot ? 'bg-gradient-to-r from-purple-50 to-transparent' : ''} p-3 rounded-lg mb-3 max-w-[90%] sm:max-w-[80%]`}>
  <div className={`p-2 rounded-full ${isBot ? 'bg-purple-500' : 'bg-blue-500'}`}>
    {isBot ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
  </div>
  <div className="flex-1">
    <div className={`text-xs mb-1 ${isBot ? 'text-purple-600' : 'text-blue-600'}`}>
      {isBot ? 'AI Therapist' : 'You'}
    </div>
    <p className="text-gray-800 text-sm leading-relaxed break-words">{message.content}</p>
  </div>
</div>

  );
};