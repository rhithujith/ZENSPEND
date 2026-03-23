import * as ReactNativeWeb from 'react-native-web';

export const TurboModuleRegistry = {
  get: () => null,
};

// Re-export all members from react-native-web
export const {
  ActivityIndicator,
  Alert,
  Animated,
  AppRegistry,
  AppState,
  Appearance,
  Button,
  CheckBox,
  Clipboard,
  Dimensions,
  Easing,
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  NativeModules,
  NativeEventEmitter,
  PanResponder,
  Picker,
  Platform,
  Pressable,
  ProgressBar,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  VirtualizedList,
  LogBox,
  useColorScheme,
  useWindowDimensions,
  findNodeHandle,
  unmountComponentAtNode,
} = ReactNativeWeb;

export default {
  ...ReactNativeWeb,
  TurboModuleRegistry,
};
