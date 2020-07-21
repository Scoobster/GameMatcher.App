/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import FirebaseService from './firebase/FirebaseService';
import {
  Notification,
  NotificationOpen,
} from 'react-native-firebase/notifications';
import LoginComponent from './components/login/LoginComponent';
import StoreService from './store/StoreService';
import GameMatcherService from './api/GameMatcherService';

declare const global: { HermesInternal: null | {} };

export default class App extends Component<any, any> {
  private firebaseService: FirebaseService = new FirebaseService();
  private gameMatcherApiService: GameMatcherService = new GameMatcherService();
  private storeService: StoreService = new StoreService();

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this.firebaseService.register(
      this.onRegister,
      this.onNotification,
      this.onNotificationOpen,
    );
  }

  public componentWillUnmount() {
    this.firebaseService.unregister();
  }

  public onRegister = (token: string) => {
    console.log('[NotificationFCM] New token: ', token);
    this.storeService.setFirebaseToken(token);
    this.storeService.getPlayerId().then((playerId: number) => {
      if (playerId !== -1) {
        this.gameMatcherApiService
          .updateDeviceToken(playerId, token)
          .then((tokenSaved: boolean) =>
            tokenSaved
              ? console.log('Firebase token saved.')
              : console.warn('Firebase token failed to save.'),
          );
      }
    });
  };

  public onNotification(notification: Notification) {
    console.log('[NotificationFCM] onNotification: ', notification);
  }

  public onNotificationOpen(notificationOpen: NotificationOpen) {
    console.log('[NotificationFCM] onNotificationOpen: ', notificationOpen);
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <LoginComponent />
      </>
    );
  }
}
