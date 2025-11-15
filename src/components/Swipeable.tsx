import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, { useRef } from 'react';

import { Message } from '../types/message';
import { getMoodColor, formatTime, formatDate } from '../utils/messageUtils';

const SwipeableHistoryItem = ({
  message,
  deleteMessage,
}: {
  message: Message;
  deleteMessage: (id: string) => void;
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  const SWIPE_THRESHOLD = -100;
  const DELETE_BUTTON_WIDTH = 80;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },
      onPanResponderGrant: () => {
        translateX.setOffset((translateX as any)._value);
        translateX.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        } else if (gestureState.dx > 0 && isOpen.current) {
          translateX.setValue(gestureState.dx - DELETE_BUTTON_WIDTH);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();
        const currentValue = (translateX as any)._value;

        if (currentValue < SWIPE_THRESHOLD) {
          isOpen.current = true;
          Animated.spring(translateX, {
            toValue: -DELETE_BUTTON_WIDTH,
            useNativeDriver: true,
          }).start();
        } else {
          isOpen.current = false;
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleDelete = () => {
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      deleteMessage(message.id);
    });
  };

  const moodColor = getMoodColor(message.mood);

  return (
    <View style={styles.swipeableContainer}>
      {/* Delete Button */}
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Item */}
      <Animated.View
        style={[styles.historyItem, { transform: [{ translateX }] }]}
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

export default SwipeableHistoryItem;

const DELETE_BUTTON_WIDTH = 80;

const styles = StyleSheet.create({
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
  },
});
