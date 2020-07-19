/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import FirebaseService from './src/firebase/FirebaseService';
import {
  Notification,
  NotificationOpen,
} from 'react-native-firebase/notifications';
import {Player} from './src/api/types';
import GameMatcherService from './src/api/GameMatcherService';
const t = require('tcomb-form-native');

declare const global: {HermesInternal: null | {}};

const Form = t.form.Form;
const FormType = t.struct({
  firstName: t.String,
  lastName: t.String,
  clubId: t.Number,
  ability: t.Number,
  phoneNumber: t.maybe(t.String),
});

export default class App extends Component<any, any> {
  private firebaseService: FirebaseService = new FirebaseService();
  private gameMatcherService: GameMatcherService = new GameMatcherService();

  private playerFormValues: any;

  constructor(props: any) {
    super(props);
    this.playerFormValues = {};
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

  public onRegister(token: string) {
    console.log('[NotificationFCM] New token: ', token);
    // TODO: Send token to db
  }

  public onNotification(notification: Notification) {
    console.log('[NotificationFCM] onNotification: ', notification);
  }

  public onNotificationOpen(notificationOpen: NotificationOpen) {
    console.log('[NotificationFCM] onNotificationOpen: ', notificationOpen);
  }

  private onFormChange = (value: any) => {
    this.playerFormValues = value;
  };

  private handleSubmit = () => {
    if (
      !this.playerFormValues ||
      !this.playerFormValues.firstName ||
      !this.playerFormValues.lastName ||
      !this.playerFormValues.clubId ||
      !this.playerFormValues.ability
    ) {
      return;
    }

    const player: Player = {
      firstName: this.playerFormValues.firstName,
      lastName: this.playerFormValues.lastName,
      clubId: this.playerFormValues.clubId,
      ability: this.playerFormValues.ability,
      phoneNumber: this.playerFormValues.phoneNumber,
    };

    this.gameMatcherService.addPlayer(player);
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Add Player</Text>
            </View>
            <View style={styles.body}>
              <Form type={FormType} onChange={this.onFormChange} />
              <Button title="Submit" onPress={this.handleSubmit} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  header: {
    width: '100%',
    minHeight: 100,
    backgroundColor: Colors.darker,
  },
  headerText: {
    fontSize: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  body: {
    backgroundColor: Colors.white,
    paddingBottom: 24,
  },
});
