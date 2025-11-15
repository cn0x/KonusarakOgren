import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Storage } from '../utils/storage';
import { Message } from '../types/message';
import { getMoodColor, formatTime, formatDate } from '../utils/messageUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = -100; // Swipe left threshold to trigger delete
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

  const SwipeableHistoryItem = ({ message }: { message: Message }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const isOpen = useRef(false);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only activate if horizontal swipe is more significant than vertical
          return (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
            Math.abs(gestureState.dx) > 10
          );
        },
        onPanResponderGrant: () => {
          // Close any other open items when starting a new swipe
          translateX.setOffset((translateX as any)._value);
          translateX.setValue(0);
        },
        onPanResponderMove: (_, gestureState) => {
          // Only allow swiping left (negative dx)
          if (gestureState.dx < 0) {
            translateX.setValue(gestureState.dx);
          } else if (gestureState.dx > 0 && isOpen.current) {
            // Allow swiping right to close if already open
            translateX.setValue(gestureState.dx - DELETE_BUTTON_WIDTH);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          translateX.flattenOffset();
          const currentValue = (translateX as any)._value;

          if (currentValue < SWIPE_THRESHOLD) {
            // Swipe threshold reached, animate to show delete button
            isOpen.current = true;
            Animated.spring(translateX, {
              toValue: -DELETE_BUTTON_WIDTH,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
          } else {
            // Not enough swipe, animate back to original position
            isOpen.current = false;
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
          }
        },
      }),
    ).current;

    const handleDelete = () => {
      Animated.timing(translateX, {
        toValue: -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        deleteMessage(message.id);
      });
    };

    const handleClose = () => {
      isOpen.current = false;
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    };

    const moodColor = getMoodColor(message.mood);

    return (
      <View style={styles.swipeableContainer}>
        {/* Delete Button Background */}
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>Sil</Text>
          </TouchableOpacity>
        </View>

        {/* Swipeable Content */}
        <Animated.View
          style={[
            styles.historyItem,
            {
              transform: [{ translateX }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.historyItemHeader}>
            <View
              style={[
                styles.moodIndicator,
                { backgroundColor: message.color || moodColor },
              ]}
            />
            <Text style={styles.moodText}>
              {message.mood === 'pozitif' || message.mood === 'happy'
                ? 'Mutlu'
                : message.mood === 'negatif' || message.mood === 'sad'
                ? 'Üzgün'
                : 'Nötr'}
            </Text>
          </View>
          <Text style={styles.historyText}>{message.text}</Text>
          <View style={styles.historyFooter}>
            <Text style={styles.historyTime}>
              {formatTime(message.timestamp)} - {formatDate(message.timestamp)}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
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
            <SwipeableHistoryItem key={message.id} message={message} />
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
