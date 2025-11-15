import { Mood } from '../types/message';

export const getMoodColor = (mood: Mood): string => {
  switch (mood.toLowerCase()) {
    case 'pozitif':
    case 'happy':
      return '#4CAF50'; // Green
    case 'negatif':
    case 'sad':
      return '#F44336'; // Red
    case 'nötr':
    case 'neutral':
    default:
      return '#FF9800'; // Orange
  }
};

export const formatTimestamp = (date: Date, now?: Date): string => {
  const currentTime = now || new Date();
  const messageDate = new Date(date);
  const diffInHours =
    (currentTime.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    if (minutes < 1) {
      return 'Az önce';
    }
    return `${minutes} dakika önce`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} saat önce`;
  } else {
    const days = Math.floor(diffInHours / 24);
    return `${days} gün önce`;
  }
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
