import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { useChatbotService } from '../services/chatbotService';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatbotScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatbotService = useChatbotService();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);

    // Placeholder: call chatbotService.chat with mocked aiResult
    const reply = await chatbotService.chat({
      message: input,
      aiResult: {}, // TODO: pass actual ECG result after integration
      doctorNotes: '',
      patient: {},
      history: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: reply.reply };
    setMessages(prev => [...prev, botMsg]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CardioWave Chatbot</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={item.role === 'user' ? styles.userBubble : styles.botBubble}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        style={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask a question..."
          style={styles.input}
          value={input}
          onChangeText={setInput}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', color: '#007bff', marginBottom: 12, textAlign: 'center' },
  chatList: { flex: 1 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#e0f7fa', borderRadius: 8, padding: 8, marginVertical: 4 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#f1f8e9', borderRadius: 8, padding: 8, marginVertical: 4 },
  messageText: { fontSize: 14 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#ddd', paddingTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 8, marginRight: 8 },
});