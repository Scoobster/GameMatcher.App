import React, { Component } from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';
import GameMatcherService from '../../services/api/GameMatcherService';
import { MatchRequest } from '../../services/api/types';
import LocalStorageService from '../../store/LocalStorageService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import {
  FormInput,
  InputType,
  DateTime,
  SQUASH_GRADE_OPTIONS,
} from '../common/FormTypes';
import FormComponent from '../common/FormComponent';
import { NavigationRoutes } from '../../services/navigation/NavigationService';

export interface RequestMatchProps {
  playerId: number;
}

type RequestStackNavigationProp = StackNavigationProp<
  RootStackParamList,
  NavigationRoutes.Request
>;

const MATCH_START_FORM_NAME = 'MATCH_START';
const LENGTH_FORM_NAME = 'LENGTH';
const ABILITY_MIN_FORM_NAME = 'ABILITY_MIN';
const ABILITY_MAX_FORM_NAME = 'ABILITY_MAX';

const FORM_INPUTS: Array<FormInput> = [
  {
    name: MATCH_START_FORM_NAME,
    label: 'Match start time: ',
    input: InputType.DateTime,
    required: true,
    validators: [
      (dateTime: DateTime) => {
        if (dateTime.combined().getTime() < Date.now()) {
          return 'Match start date cannot be in the past.';
        }
        return '';
      },
    ],
  },
  {
    name: LENGTH_FORM_NAME,
    label: 'Match length in minutes: ',
    input: InputType.Number,
    initialValue: 45,
    required: true,
    validators: [
      (val: string) => {
        if (+val <= 0) {
          return 'Match length time must be greater than zero.';
        }
        return '';
      },
    ],
  },
  {
    name: ABILITY_MAX_FORM_NAME,
    label: 'Enter the maximum ability level you want to play: ',
    input: InputType.Slider,
    required: true,
    initialValue: 2,
    options: SQUASH_GRADE_OPTIONS,
  },
  {
    name: ABILITY_MIN_FORM_NAME,
    label: 'Enter the minimum ability level you want to play: ',
    input: InputType.Slider,
    required: true,
    initialValue: 4,
    options: SQUASH_GRADE_OPTIONS,
  },
];

export default class CreateRequestComponent extends Component {
  private gameMatcherService: GameMatcherService = new GameMatcherService();
  private storeService: LocalStorageService = new LocalStorageService();

  private playerId: number = -1;

  constructor(props: any) {
    super(props);
    this.storeService
      .getPlayerId()
      .then((playerId: number) => (this.playerId = playerId));
  }

  private handleSubmit = (values: { [key: string]: any }) => {
    const matchRequest: MatchRequest = {
      hostPlayerId: this.playerId,
      matchStartTime: values[MATCH_START_FORM_NAME].combined(),
      lengthInMins: values[LENGTH_FORM_NAME],
      abilityMin: values[ABILITY_MIN_FORM_NAME],
      abilityMax: values[ABILITY_MAX_FORM_NAME],
    };

    this.gameMatcherService
      .addMatchRequest(matchRequest)
      .then((requestId: number) => {
        if (requestId !== -1) {
          Alert.alert('Match request sent! Request id is ' + requestId);
        } else {
          Alert.alert('Match request failed to send. Please try again!');
        }
      });
  };

  public render() {
    return (
      <>
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <FormComponent
              title="Request a match"
              formInputs={FORM_INPUTS}
              onSubmit={this.handleSubmit}
            />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}
