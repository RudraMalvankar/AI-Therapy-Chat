import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, ChatState, SYSTEM_PROMPT } from './types';
import { ChatMessage } from './components/ChatMessage';
// import { VoiceInput } from './components/VoiceInput';
import { Send, Volume2, VolumeX, Sparkles } from 'lucide-react';

// Initialize the Gemini API with the correct endpoint and API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [{ role: 'system', content: SYSTEM_PROMPT }],
    isLoading: false,
    error: null,
  });
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = { role: 'user', content: text };
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isLoading: true,
      error: null,
    }));
    setInput('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat({
        history: chatState.messages
          .filter(msg => msg.role !== 'system')
          .map(msg => ({
            role: msg.role,
            parts: msg.content,
          })),
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
        },
      });

      const result = await chat.sendMessage(text);
      const response = await result.response;
      const responseText = response.text();

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseText,
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));

      speak(responseText);
    } catch (error) {
      console.error('API Error:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to get response. Please check your API key and try again.',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-90 to-cyan-100 flex flex-col">
  <div className="w-full max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto p-4 flex-1 flex flex-col min-h-screen">

    <header className="text-center py-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="text-purple-600" size={24} />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          AI Therapy Chat
        </h1>
      </div>
      <p className="text-gray-600 mt-1 text-base">Your safe space to talk and reflect</p>
    </header>

    <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 mb-4 max-h-[65vh]">
      {chatState.messages.filter(msg => msg.role !== 'system').length === 0 && (
        <div className="text-center text-gray-500 py-6">
          <p className="text-lg mb-2">Hey there! 😊 What's on your mind today?</p>
          <p className="text-sm">Feel free to share your thoughts—I'm here to listen and help!</p>
        </div>
      )}
      {chatState.messages
        .filter(msg => msg.role !== 'system')
        .map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      <div ref={messagesEndRef} />
    </div>

    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-3">
      <div className="flex items-center gap-2 w-full">
        <button 
          onClick={isSpeaking ? stopSpeaking : () => speak(chatState.messages[chatState.messages.length - 1]?.content)}
          className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
            isSpeaking 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
              : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'
          }`}
        >
          {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(input)}
          placeholder="Type your message..."
          className="flex-1 p-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm transition-all duration-300"
        />

        {/* <VoiceInput onVoiceInput={handleSubmit} className="hidden sm:block" />  Voice chat now visible on desktop */}

        <button
          onClick={() => handleSubmit(input)}
          disabled={!input.trim()}
          className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  </div>

  <footer className="text-center py-2 text-sm text-gray-500">
  <p className="mb-1">
    © {new Date().getFullYear()} All rights reserved by 
    <a 
      href="https://www.linkedin.com/in/rudra-malvankar/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline ml-1"
    >
      Rudra Malvankar
    </a>
  </p>
  <p className="text-xs text-gray-400">Version 0 (V0) - Production</p>
</footer>

</div>


  );
}

export default App;