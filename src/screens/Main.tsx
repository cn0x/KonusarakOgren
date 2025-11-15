import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GOOGLE_API_KEY } from '../utils/keys';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
const MainScreen = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    setMessages([
      ...messages.map((message: any) => {
        return {
          _id: message.id,
          text: message.msg,
          createdAt: new Date(message.date),
          user: {
            _id: message.from,
            name: message.from ? 'You' : 'AI',
          },
        };
      }),
      {
        _id: 0,
        text: 'Gününüzü Anlatın!',
        createdAt: new Date(),
        system: true,
        user: {
          _id: 0,
          name: 'Bot',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const aiCall = async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: text,
      config: {
        systemInstruction:
          'Sen bir günlük asistanısın; kullanıcıdan gelen cümleyi analiz edip Duygu :(pozitif/nötr/negatif) Renk : (kullanıcının duygusunu ifade eden rengi hex formatında ver) Özet : (1 cümle) Öneri : (kısa tavsiye) alanlarını üret; doğal konuş, tekrar yapma, tıbbi/psikolojik teşhis koyma ve çıktıyı json formatında ver.',
      },
    });
    console.log(response);
  };

  const renderTopContainerComponents: any = () => {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Image source={require('../utils/assets/logo2024-2048x503.png')} />
        <TouchableOpacity>
          <Image source={require('../utils/assets/history.png')} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessages = () => {
    return (
      <GiftedChat
        messages={messages}
        onSend={(messages: any) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.topContainer}>{renderTopContainerComponents}</View>
      <View style={styles.msgContainer}></View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} onChangeText={setText} value={text} />
        <TouchableOpacity
          disabled={text.length === 0}
          style={
            text.length > 0
              ? { ...styles.button, backgroundColor: 'green' }
              : { ...styles.button, backgroundColor: 'gray' }
          }
          onPress={() => aiCall()}
        >
          <Image
            source={require('../utils/assets/paper-plane.png')}
            style={styles.img}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
  },
  input: {
    width: '89%',
    paddingHorizontal: 20,
  },
  topContainer: {
    width: '100%',
    height: '5%',
  },
  msgContainer: {
    height: '90%',
    width: '90%',
  },
  inputContainer: {
    bottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 22,
    width: '85%',
    height: '5%',
    flexDirection: 'row',
  },
  button: {
    borderRadius: 55,
    height: '90%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 50,
    height: 50,
  },
});
