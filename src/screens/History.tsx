import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Storage } from '../utils/storage';
import { Message } from '../types/message';
import SwipeableHistoryItem from '../components/Swipeable';

const DELETE_BUTTON_WIDTH = 80;

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedMessages = (await Storage.get(
        'messages',
        [] as any,
      )) as Message[];
      if (storedMessages && storedMessages.length > 0) {
        const parsedMessages = storedMessages
          .map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
          .filter((msg: Message) => msg.fromUser) // Only show user messages in history
          .sort(
            (a: Message, b: Message) =>
              b.timestamp.getTime() - a.timestamp.getTime(),
          );
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      // Remove from local state
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      setMessages(updatedMessages);

      // Update storage - remove from all messages
      const storedMessages = (await Storage.get(
        'messages',
        [] as any,
      )) as Message[];
      const updatedStoredMessages = storedMessages.filter(
        msg => msg.id !== messageId,
      );
      await Storage.set({ key: 'messages', value: updatedStoredMessages });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  return (
    <SafeAreaView style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Geçmiş</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <View style={styles.messagesIcon}>
            <View style={styles.messagesIconBubble}>
              <View style={styles.messagesIconLine} />
              <View
                style={[styles.messagesIconLine, styles.messagesIconLineShort]}
              />
            </View>
            <View
              style={[
                styles.messagesIconBubble,
                styles.messagesIconBubbleSmall,
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <ScrollView
        style={styles.historyContainer}
        contentContainerStyle={styles.historyContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz mesaj geçmişi yok</Text>
          </View>
        ) : (
          messages.map(message => (
            <SwipeableHistoryItem
              deleteMessage={deleteMessage}
              key={message.id}
              message={message}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;

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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  messagesIcon: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  messagesIconBubble: {
    width: 18,
    height: 14,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 3,
    paddingTop: 2,
  },
  messagesIconBubbleSmall: {
    width: 14,
    height: 10,
    marginTop: 2,
  },
  messagesIconLine: {
    width: 8,
    height: 1.5,
    backgroundColor: '#333',
    marginBottom: 2,
  },
  messagesIconLineShort: {
    width: 5,
  },
  historyContainer: {
    flex: 1,
  },
  historyContent: {
    padding: 16,
  },
  swipeableContainer: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  deleteButtonContainer: {
    position: 'absolute',
    borderRadius: 20,
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336',
  },
  deleteButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  moodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  historyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
