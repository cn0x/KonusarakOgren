Bu, [`@react-native-community/cli`](https://github.com/react-native-community/cli) kullanılarak oluşturulmuş yeni bir [**React Native**](https://reactnative.dev) projesidir.

# Başlangıç

> **Not**: Devam etmeden önce [Ortamınızı Ayarlama](https://reactnative.dev/docs/set-up-your-environment) rehberini tamamladığınızdan emin olun.

## Adım 1: Metro'yu Başlatın

Öncelikle React Native için JavaScript derleme aracı olan **Metro**'yu çalıştırmanız gerekiyor.

Metro geliştirme sunucusunu başlatmak için, React Native projenizin kök dizininden aşağıdaki komutu çalıştırın:

```sh
# npm kullanarak
npm start

# VEYA Yarn kullanarak
yarn start
```

## Adım 2: Uygulamanızı derleyin ve çalıştırın

Metro çalışırken, React Native projenizin kök dizininden yeni bir terminal penceresi/açılımı açın ve Android veya iOS uygulamanızı derlemek ve çalıştırmak için aşağıdaki komutlardan birini kullanın:

### Android

```sh
# npm kullanarak
npm run android

# VEYA Yarn kullanarak
yarn android
```

### iOS

iOS için, CocoaPods bağımlılıklarını yüklemeyi unutmayın (bu yalnızca ilk klonlamada veya native bağımlılıkları güncelledikten sonra çalıştırılması gerekir).

Yeni bir proje oluşturduğunuzda ilk kez, CocoaPods'u yüklemek için Ruby bundler'ı çalıştırın:

```sh
bundle install
```

Ardından, native bağımlılıklarınızı her güncellediğinizde şunu çalıştırın:

```sh
bundle exec pod install
```

Daha fazla bilgi için lütfen [CocoaPods Başlangıç Rehberi](https://guides.cocoapods.org/using/getting-started.html)'ne bakın.

```sh
# npm kullanarak
npm run ios

# VEYA Yarn kullanarak
yarn ios
```

Her şey doğru şekilde ayarlandıysa, yeni uygulamanızı Android Emülatörü, iOS Simülatörü veya bağlı cihazınızda çalışırken görmelisiniz.

Bu, uygulamanızı çalıştırmanın bir yoludur — ayrıca doğrudan Android Studio veya Xcode'dan da derleyebilirsiniz.

## Adım 3: Uygulamanızı değiştirin

Artık uygulamayı başarıyla çalıştırdığınıza göre, değişiklikler yapalım!

`App.tsx` dosyasını tercih ettiğiniz metin düzenleyicide açın ve bazı değişiklikler yapın. Kaydettiğinizde, uygulamanız otomatik olarak güncellenecek ve bu değişiklikleri yansıtacaktır — bu, [Fast Refresh](https://reactnative.dev/docs/fast-refresh) tarafından desteklenmektedir.

Örneğin uygulamanızın durumunu sıfırlamak için zorla yeniden yüklemek istediğinizde, tam bir yeniden yükleme yapabilirsiniz:

- **Android**: <kbd>R</kbd> tuşuna iki kez basın veya <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) veya <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS) ile erişilen **Dev Menu**'den **"Reload"** seçeneğini seçin.
- **iOS**: iOS Simülatöründe <kbd>R</kbd> tuşuna basın.

## Tebrikler! :tada:

React Native uygulamanızı başarıyla çalıştırdınız ve değiştirdiniz. :partying_face:

### Şimdi ne yapmalı?

- Bu yeni React Native kodunu mevcut bir uygulamaya eklemek istiyorsanız, [Entegrasyon rehberi](https://reactnative.dev/docs/integration-with-existing-apps)'ne bakın.
- React Native hakkında daha fazla bilgi edinmek istiyorsanız, [dokümantasyon](https://reactnative.dev/docs/getting-started)'a bakın.

# Sorun Giderme

Yukarıdaki adımları çalıştırırken sorun yaşıyorsanız, [Sorun Giderme](https://reactnative.dev/docs/troubleshooting) sayfasına bakın.

# Daha Fazla Bilgi

React Native hakkında daha fazla bilgi edinmek için aşağıdaki kaynaklara göz atın:

- [React Native Web Sitesi](https://reactnative.dev) - React Native hakkında daha fazla bilgi edinin.
- [Başlangıç](https://reactnative.dev/docs/environment-setup) - React Native'e **genel bakış** ve ortamınızı nasıl ayarlayacağınız.
- [Temelleri Öğrenin](https://reactnative.dev/docs/getting-started) - React Native **temelleri** için **rehberli bir tur**.
- [Blog](https://reactnative.dev/blog) - en son resmi React Native **Blog** yazılarını okuyun.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - React Native için Açık Kaynak; GitHub **deposu**.

---

# Konuştukça Öğren

## Proje Hakkında

"Konuştukça Öğren" günlük asistanı uygulaması, kullanıcıların günlüklerini paylaşmasına ve AI destekli duygu analizi almasına olanak tanıyan bir React Native uygulamasıdır.

## Özellikler

- 💬 **Mesajlaşma Ekranı**: Kullanıcı ve AI arasında özel mesaj baloncukları ile sohbet
- 😊 **Duygu Analizi**: AI tarafından analiz edilen mesajlar, renk kodlu duygu göstergeleri ile
- 📚 **Geçmiş Takibi**: Tüm mesajların kaydedildiği ve görüntülenebildiği geçmiş ekranı
- 🗑️ **Kaydırarak Silme**: Geçmiş ekranında mesajları kaydırarak silme özelliği
- 🎨 **Onboarding Ekranı**: İlk kullanım için hoş geldin ekranı
- ⏰ **Gerçek Zamanlı Zaman Damgaları**: Mesaj zamanlarının dinamik olarak güncellenmesi

## Teknolojiler

- React Native 0.82.1
- TypeScript
- React Navigation
- AsyncStorage (veri saklama)
- Google Gemini AI API

## Proje Yapısı

```
src/
├── screens/
│   ├── Main.tsx          # Ana mesajlaşma ekranı
│   ├── History.tsx       # Geçmiş mesajlar ekranı
│   └── Onboarding.tsx    # Hoş geldin ekranı
├── types/
│   └── message.ts        # Mesaj tip tanımları
└── utils/
    ├── storage.ts        # AsyncStorage yardımcı fonksiyonları
    └── messageUtils.ts   # Mesaj yardımcı fonksiyonları
```

## Cursor AI ile Geliştirilen Özellikler

Aşağıdaki özellikler ve bileşenler [Cursor AI](https://cursor.sh) yardımıyla geliştirilmiştir:

### ✅ Mesajlaşma Ekranı (Main.tsx)

- Özel mesaj baloncukları (üçüncü parti kütüphane kullanılmadan)
- Header bar (avatar, isim, geçmiş butonu)
- AI yanıtlarının JSON formatından parse edilmesi
- Duygu analizi ve renk kodlaması
- Gerçek zamanlı zaman damgası güncellemeleri
- Yeni mesaj gönderildiğinde eski mesajların temizlenmesi

### ✅ Geçmiş Ekranı (History.tsx)

- Kaydırarak silme özelliği (PanResponder ve Animated API kullanılarak)
- Mesaj listesi görüntüleme
- Duygu göstergeleri ve zaman damgaları
- AsyncStorage ile mesaj silme işlemleri

### ✅ Onboarding Ekranı (Onboarding.tsx)

- İlk kullanım için hoş geldin ekranı
- Özellik tanıtımları
- Navigasyon mantığı ve AsyncStorage entegrasyonu

### ✅ Yardımcı Fonksiyonlar

- `messageUtils.ts`: Duygu renk eşleştirme, zaman damgası formatlama
- `message.ts`: TypeScript tip tanımları
- Duygu normalleştirme fonksiyonları (pozitif/negatif/nötr)

### ✅ AI Entegrasyonu

- Google Gemini AI API entegrasyonu
- AI yanıtlarının parse edilmesi (JSON ve fallback parsing)
- Duygu, renk, özet ve öneri çıkarımı

### ✅ Veri Yönetimi

- AsyncStorage ile mesaj saklama
- Onboarding durumu takibi
- Mesaj geçmişi yönetimi

## Manuel Olarak Geliştirilen Kısımlar (Cursor Yardımı Olmadan)

Aşağıdaki kısımlar manuel olarak veya React Native CLI ile oluşturulmuştur:

### ✅ Proje Başlangıç Kurulumu

- React Native CLI ile proje oluşturma (`npx react-native init`)
- Temel proje yapısı ve klasör organizasyonu
- `package.json` bağımlılık yönetimi
- TypeScript konfigürasyonu (`tsconfig.json`)
- Metro bundler konfigürasyonu (`metro.config.js`)
- Android ve iOS native konfigürasyon dosyaları

### ✅ Temel Navigation Yapısı

- React Navigation kurulumu ve temel yapılandırması
- `App.tsx` içindeki temel Stack Navigator yapısı
- NavigationContainer ve Stack.Navigator kurulumu
- Ekranlar arası temel navigasyon akışı

### ✅ Bağımlılık Yönetimi

- `package.json` içindeki bağımlılıkların kurulumu:
  - `@react-navigation/native` ve `@react-navigation/native-stack`
  - `@react-native-async-storage/async-storage`
  - `@google/genai` (Google Gemini AI)
  - `react-native-safe-area-context`
  - Diğer React Native bağımlılıkları

### ✅ API Konfigürasyonu

- Google Gemini AI API key yapılandırması (`src/utils/keys.ts`)
- API entegrasyonu için temel yapı

### ✅ İlk Ekran Yapıları

- `Main.tsx` ve `History.tsx` dosyalarının ilk oluşturulması
- Temel ekran iskeletleri ve import yapıları
- İlk component yapıları

### ✅ Stil ve UI Düzenlemeleri

- Avatar görselinin değiştirilmesi (`pp.jpg` kullanımı)
- Onboarding ekranındaki stil düzenlemeleri:
  - Feature icon'ların kaldırılması
  - Margin ve padding ayarlamaları
  - Layout düzenlemeleri
- Header bar'daki avatar container stil ayarlamaları

### ✅ Git ve Proje Yönetimi

- `.gitignore` dosyası yapılandırması
- Git repository kurulumu
- Proje dokümantasyonu

### ✅ Native Platform Konfigürasyonları

- Android `build.gradle` ve `AndroidManifest.xml` ayarları
- iOS `Info.plist` ve `AppDelegate` konfigürasyonları
- Platform-specific ayarlar

## Notlar

- Tüm UI bileşenleri React Native'in temel bileşenleri kullanılarak oluşturulmuştur (üçüncü parti UI kütüphanesi kullanılmamıştır)
- Swipe-to-delete özelliği React Native'in Animated API ve PanResponder kullanılarak implemente edilmiştir
- AI yanıtları hem JSON hem de düz metin formatlarını destekler
- Proje, React Native 0.82.1 ve TypeScript kullanılarak geliştirilmiştir
