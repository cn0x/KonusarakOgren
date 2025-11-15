import { Text, View } from 'react-native';
import { formatTimestamp, getMoodColor } from '../utils/messageUtils';
import { StyleSheet } from 'react-native';

const renderMessageBubble = ({ message, now }: any) => {
  const moodColor = getMoodColor(message.mood);
  const isUser = message.fromUser;
  // Use 'now' state to calculate relative time, which updates in real-time
  const relativeTime = formatTimestamp(message.timestamp, now);

  return (
    <View
      key={message.id}
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={isUser ? styles.userMessageText : styles.messageText}>
        {message.text}
      </Text>
      <View style={styles.messageFooter}>
        <View
          style={[
            styles.moodIndicator,
            { backgroundColor: message.color || moodColor },
          ]}
        />
        <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
          {relativeTime}
        </Text>
      </View>
      {message.recommendation && !isUser && (
        <Text style={styles.recommendation}>💡 {message.recommendation}</Text>
      )}
    </View>
  );
};

export default renderMessageBubble;

const styles = StyleSheet.create({
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
});
