import { useState } from 'react';
import { MedecinLayout } from '../components/MedecinLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { MessageCircle, Send, Bot, User, ExternalLink } from 'lucide-react';
import { askMedicalChatbot } from "../../services/api";
interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  sources?: string[];
  timestamp: string;
}

const suggestions = [
  'Fibrillation auriculaire',
  'Interpréter un QRS large',
  'Critères d\'infarctus',
  'Tachycardie ventriculaire',
  'Score CHA2DS2-VASc',
  'Bloc de branche gauche'
];

const mockBotResponses: Record<string, { content: string; sources: string[] }> = {
  'fibrillation': {
    content: 'La fibrillation auriculaire (FA) est une arythmie cardiaque caractérisée par une activité électrique auriculaire désorganisée et rapide. Sur l\'ECG, on observe :\n\n• Absence d\'ondes P bien définies\n• Intervalles RR irréguliers\n• Présence d\'ondes f de fibrillation (300-600/min)\n• Réponse ventriculaire variable\n\nLa prise en charge dépend du score CHA2DS2-VASc pour le risque thromboembolique et comprend le contrôle du rythme ou de la fréquence, ainsi qu\'une anticoagulation si indiquée.',
    sources: [
      'ESC Guidelines 2024 - Atrial Fibrillation',
      'AHA/ACC/HRS Guidelines on Management of AF',
      'UpToDate: Atrial Fibrillation - Overview'
    ]
  },
  'qrs': {
    content: 'Un QRS large (≥120 ms) peut avoir plusieurs étiologies :\n\n1. **Bloc de branche** :\n   - BBG : QRS ≥120ms, aspect en M en V6, pas d\'onde Q septale\n   - BBD : QRS ≥120ms, aspect rSR\' en V1-V2\n\n2. **Tachycardie ventriculaire** : critères de Brugada, concordance, dissociation AV\n\n3. **Rythme pacemaker** : spike suivi de QRS large\n\n4. **Syndrome WPW** : onde delta, PR court, QRS large\n\nL\'analyse du contexte clinique et des critères ECG permet de différencier ces causes.',
    sources: [
      'Circulation: Wide QRS Complex Tachycardia',
      'NEJM: Ventricular Arrhythmias',
      'Journal of Cardiology: Bundle Branch Blocks'
    ]
  },
  'default': {
    content: 'Je suis là pour vous aider avec vos questions de cardiologie. Vous pouvez me poser des questions sur :\n\n• Interprétation des ECG\n• Diagnostic différentiel des arythmies\n• Guidelines et recommandations\n• Scores de risque cardiovasculaire\n• Prise en charge des urgences cardiaques\n\nN\'hésitez pas à préciser votre question !',
    sources: [
      'ESC Clinical Practice Guidelines',
      'AHA/ACC Guidelines',
      'UpToDate Clinical Database'
    ]
  }
};

export default function ChatbotIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Bonjour Dr. Martin, comment puis-je vous aider aujourd\'hui ? 👋\n\nJe peux répondre à vos questions sur l\'interprétation des ECG, les arythmies, les guidelines, et bien plus encore.',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
  if (!input.trim()) return;

  const currentInput = input;

  const userMessage: Message = {
    id: Date.now(),
    type: 'user',
    content: currentInput,
    timestamp: new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  setMessages(prev => [...prev, userMessage]);
  setInput('');

  try {
    const data = await askMedicalChatbot(currentInput);

    const botMessage: Message = {
      id: Date.now() + 1,
      type: 'bot',
      content: data.answer,
      sources: data.sources || [],
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, botMessage]);

  } catch (error: any) {
    const serverMessage =
      error?.response?.data?.message ||
      "Erreur lors de la communication avec l’assistant médical.";

    const botMessage: Message = {
      id: Date.now() + 1,
      type: 'bot',
      content: serverMessage,
      sources: [],
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, botMessage]);
    }
    };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <MedecinLayout>
      <div className="p-8 h-[calc(100vh-64px)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl" style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)' }}>
                Assistant IA Médical
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Propulsé par GPT-4 Medical • Réponses basées sur les dernières guidelines
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <Card 
          className="flex-1 flex flex-col border-0 shadow-sm"
          style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}
        >
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'bot' && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div 
                    className="p-4 rounded-2xl"
                    style={{ 
                      background: message.type === 'user' ? 'var(--primary)' : 'var(--background)',
                      color: message.type === 'user' ? 'white' : 'var(--text-primary)',
                      borderRadius: message.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                    }}
                  >
                    <p style={{ 
                      fontSize: '15px', 
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line',
                      color: message.type === 'user' ? 'white' : 'var(--text-primary)'
                    }}>
                      {message.content}
                    </p>
                  </div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Sources médicales :
                      </p>
                      {message.sources.map((source, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          style={{ background: 'var(--background)', border: '1px solid var(--border-color)' }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent-ai)' }} />
                          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{source}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                    {message.timestamp}
                  </p>
                </div>

                {message.type === 'user' && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E8F5F2' }}>
                    <User className="w-5 h-5" style={{ color: 'var(--accent-ai)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm mb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>
                Suggestions rapides :
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="cursor-pointer hover:shadow-sm transition-all"
                    style={{ 
                      background: 'var(--background)', 
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '13px'
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question médicale..."
                className="flex-1 h-12"
                style={{ 
                  borderRadius: '12px', 
                  borderColor: 'var(--border-color)',
                  fontSize: '15px'
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-12 px-6"
                style={{ background: 'var(--accent-ai)', borderRadius: '12px' }}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-secondary)' }}>
              ⚠️ Les réponses de l'IA sont à titre informatif. Toujours vérifier avec les sources officielles.
            </p>
          </div>
        </Card>
      </div>
    </MedecinLayout>
  );
}
