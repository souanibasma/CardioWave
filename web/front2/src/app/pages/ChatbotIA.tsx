import { useState, useRef, useEffect } from 'react';
import { MedecinLayout } from '../components/MedecinLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Send, Bot, User, ExternalLink } from 'lucide-react';
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

export default function ChatbotIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?\n\nJe peux répondre à vos questions sur les arythmies, les guidelines, les scores de risque et bien plus encore.',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: currentInput,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await askMedicalChatbot(currentInput, history);

      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.answer,
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setHistory(prev => [...prev, {
        question: currentInput,
        answer:   data.answer
      }]);

    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: error?.response?.data?.message || "Service temporairement indisponible. Réessayez dans quelques secondes.",
        sources: [],
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MedecinLayout>
      <div className="p-8 h-[calc(100vh-64px)] flex flex-col">

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl"
                style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)' }}>
                Assistant IA Médical
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Propulsé par Elephant AI • Réponses basées sur les dernières guidelines
              </p>
            </div>
          </div>
        </div>

        <Card
          className="flex-1 flex flex-col border-0 shadow-sm"
          style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id}
                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>

                {message.type === 'bot' && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      background:   message.type === 'user' ? 'var(--primary)' : 'var(--background)',
                      borderRadius: message.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                    }}
                  >
                    {message.type === 'user' ? (
                      <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'white', margin: 0 }}>
                        {message.content}
                      </p>
                    ) : (
                      <div style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} style={{ margin: '2px 0', color: 'var(--text-primary)' }}>
                            {line || '\u00A0'}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

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
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0"
                            style={{ color: 'var(--accent-ai)' }} />
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#E8F5F2' }}>
                    <User className="w-5 h-5" style={{ color: 'var(--accent-ai)' }} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="p-4 rounded-2xl" style={{ background: 'var(--background)' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Analyse en cours...
                  </p>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm mb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>
                Suggestions rapides :
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="cursor-pointer hover:shadow-sm transition-all"
                    style={{
                      background:   'var(--background)',
                      color:        'var(--text-primary)',
                      border:       '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding:      '8px 16px',
                      fontSize:     '13px'
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Posez votre question médicale..."
                className="flex-1 h-12"
                disabled={loading}
                style={{
                  borderRadius: '12px',
                  borderColor:  'var(--border-color)',
                  fontSize:     '15px'
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
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