import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput,  }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onVoiceInput(transcript);
      resetTranscript();
      setIsListening(false);
    }
  }, [transcript, onVoiceInput, resetTranscript]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening();
    }
    setIsListening(!isListening);
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <button
      onClick={toggleListening}
      className={`p-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
        isListening 
          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse' 
          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
      }`}
    >
      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
    </button>
  );
};