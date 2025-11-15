import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GOOGLE_API_KEY } from '../utils/keys';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Storage } from '../utils/storage';
import { Message } from '../types/message';
import renderMessageBubble from '../components/MessageBubble';

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

const MainScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [now, setNow] = useState(new Date());
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadMessages();

    // Update timestamps every 30 seconds for real-time display
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    // Don't load old messages - start with empty screen
    // Only show messages from the current conversation session
    setMessages([]);
  };

  const normalizeMood = (mood: string): string => {
    const normalized = mood.toLowerCase().trim();
    // Map various mood representations to standard values
    if (
      normalized === 'pozitif' ||
      normalized === 'positive' ||
      normalized === 'happy' ||
      normalized === 'mutlu' ||
      normalized === 'iyi' ||
      normalized === 'good'
    ) {
      return 'pozitif';
    }
    if (
      normalized === 'negatif' ||
      normalized === 'negative' ||
      normalized === 'sad' ||
      normalized === 'üzgün' ||
      normalized === 'kötü' ||
      normalized === 'bad'
    ) {
      return 'negatif';
    }
    // Default to neutral
    return 'nötr';
  };

  const parseAIResponse = (
    responseText: string,
  ): {
    mood: string;
    color: string;
    summary: string;
    recommendation: string;
  } => {
    let mood = 'nötr';
    let color = '#FF9800';
    let summary = '';
    let recommendation = '';

    try {
      // Try to parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        mood = normalizeMood(parsed.Duygu || parsed.mood || 'nötr');
        color = parsed.Renk || parsed.color || '#FF9800';
        summary = parsed.Özet || parsed.summary || '';
        recommendation = parsed.Öneri || parsed.recommendation || '';
      } else {
        // Fallback parsing for non-JSON responses
        const moodMatch =
          responseText.match(/Duygu\s*[:：]\s*(\w+)/i) ||
          responseText.match(/mood\s*[:：]\s*(\w+)/i);
        const colorMatch =
          responseText.match(/Renk\s*[:：]\s*(#[0-9A-Fa-f]{6})/i) ||
          responseText.match(/color\s*[:：]\s*(#[0-9A-Fa-f]{6})/i);
        const summaryMatch =
          responseText.match(/Özet\s*[:：]\s*(.+?)(?=Öneri|$)/is) ||
          responseText.match(/summary\s*[:：]\s*(.+?)(?=recommendation|$)/is);
        const recommendationMatch =
          responseText.match(/Öneri\s*[:：]\s*(.+?)$/is) ||
          responseText.match(/recommendation\s*[:：]\s*(.+?)$/is);

        mood = normalizeMood(moodMatch ? moodMatch[1] : 'nötr');
        color = colorMatch ? colorMatch[1] : '#FF9800';
        summary = summaryMatch ? summaryMatch[1].trim() : '';
        recommendation = recommendationMatch
          ? recommendationMatch[1].trim()
          : '';
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Try fallback parsing even if JSON parse fails
      const moodMatch =
        responseText.match(/Duygu\s*[:：]\s*(\w+)/i) ||
        responseText.match(/mood\s*[:：]\s*(\w+)/i);
      if (moodMatch) {
        mood = normalizeMood(moodMatch[1]);
      }
    }

    return {
      mood,
      color,
      summary,
      recommendation,
    };
  };

  const aiCall = async () => {
    if (!text.trim()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      mood: 'neutral',
      color: '#2196F3',
      timestamp: new Date(),
      fromUser: true,
    };

    // Clear old messages and start fresh with just the new user message
    setMessages([userMessage]);
    setText('');

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: text,
        config: {
          systemInstruction:
            'Sen bir günlük asistanısın; kullanıcıdan gelen cümleyi analiz edip Duygu :(pozitif/nötr/negatif) Renk : (kullanıcının duygusunu ifade eden rengi hex formatında ver) Özet : (1 cümle) Öneri : (kısa tavsiye) alanlarını üret; doğal konuş, tekrar yapma, tıbbi/psikolojik teşhis koyma ve çıktıyı json formatında ver.',
        },
      });

      const responseText = response.text || '';
      const parsed = parseAIResponse(responseText);

      // Update user message with the mood detected by AI
      const updatedUserMessage = {
        ...userMessage,
        mood: parsed.mood as any,
        color: parsed.color,
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: parsed.summary || responseText,
        mood: parsed.mood as any,
        color: parsed.color,
        timestamp: new Date(),
        fromUser: false,
        summary: parsed.summary,
        recommendation: parsed.recommendation,
      };

      // Only keep the current conversation (user message + AI response)
      const currentConversation = [updatedUserMessage, aiMessage];
      setMessages(currentConversation);

      // Load all previous messages from storage to preserve history
      const storedMessages = (await Storage.get(
        'messages',
        [] as any,
      )) as Message[];

      // Add new messages to history while keeping old ones
      const allMessages = [...storedMessages, updatedUserMessage, aiMessage];

      await Storage.set({ key: 'messages', value: allMessages });

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('AI call error:', error);
      Alert.alert('Hata', 'Mesaj gönderilirken bir hata oluştu.');
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../utils/assets/pp.jpg')}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.headerTitle}>Konuşarak Öğren</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('History' as never)}
            style={styles.historyButton}
          >
            <Image
              source={require('../utils/assets/history.png')}
              style={styles.historyIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Messages Container */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessageBubble)}
        </ScrollView>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            disabled={text.length === 0}
            style={[
              styles.sendButton,
              text.length > 0
                ? styles.sendButtonActive
                : styles.sendButtonDisabled,
            ]}
            onPress={aiCall}
          >
            <Image
              source={require('../utils/assets/paper-plane.png')}
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  historyButton: {
    padding: 8,
  },
  historyIcon: {
    width: 24,
    height: 24,
    tintColor: '#333',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2196F3',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  userMessageText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  userTimestamp: {
    color: '#E0E0E0',
  },
  recommendation: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#4CAF50',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
});
