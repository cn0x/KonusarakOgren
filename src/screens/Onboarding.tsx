import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Storage } from '../utils/storage';

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = async () => {
    // Mark onboarding as completed
    await Storage.set({ key: 'onboardingCompleted', value: true });
    // Navigate to main screen
    navigation.navigate('Main' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Icon Section */}
        <View style={styles.logoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../utils/assets/pp.jpg')}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.appName}>Konuştukça Öğren</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Günlük Asistanınız</Text>
            <Text style={styles.featureDescription}>
              Gününüzü anlatın, duygularınızı paylaşın ve kişiselleştirilmiş
              öneriler alın.
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>😊</Text>
            </View>
            <Text style={styles.featureTitle}>Duygu Analizi</Text>
            <Text style={styles.featureDescription}>
              Mesajlarınız analiz edilir ve duygu durumunuz renk kodlu olarak
              gösterilir.
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📚</Text>
            </View>
            <Text style={styles.featureTitle}>Geçmiş Takibi</Text>
            <Text style={styles.featureDescription}>
              Tüm mesajlarınızı geçmiş ekranında görüntüleyebilir ve
              yönetebilirsiniz.
            </Text>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Başlayalım</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: '#2196F3',
  },
  avatar: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 40,
  },
  featureIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: 40,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  getStartedButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    bottom: 0,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
