import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import GameMatcherService from '../../api/GameMatcherService';
import { Player } from '../../api/types';
import StoreService from '../../store/StoreService';
const t = require('tcomb-form-native');

const Form = t.form.Form;
const FormType = t.struct({
  firstName: t.String,
  lastName: t.String,
  clubId: t.Number,
  ability: t.Number,
  phoneNumber: t.maybe(t.String),
});

export default class LoginComponent extends Component {
  private gameMatcherService: GameMatcherService = new GameMatcherService();
  private storeService: StoreService = new StoreService();

  private playerFormValues: any;

  constructor(props: any) {
    super(props);
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

    this.storeService.setPlayerInfo(player);

    this.gameMatcherService.addPlayer(player).then((playerId: number) => {
      if (playerId !== -1) {
        this.storeService.setPlayerId(playerId);
        this.updateToken(playerId);
        Alert.alert('Player saved! Player id is ' + playerId);
      } else {
        Alert.alert('Player failed to save.');
      }
    });
  };

  private updateToken(playerId: number) {
    this.storeService
      .getFirebaseToken()
      .then((token: string) =>
        this.gameMatcherService.updateDeviceToken(playerId, token),
      );
  }

  public render() {
    return (
      <>
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
