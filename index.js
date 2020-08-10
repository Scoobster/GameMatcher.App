/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import BackgroundMessaging from './src/services/firebase/BackgroundMessaging';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => BackgroundMessaging,
);
