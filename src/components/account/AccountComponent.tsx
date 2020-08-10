import React, { Component } from 'react';
import { Alert, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import GameMatcherService from '../../services/api/GameMatcherService';
import { Player } from '../../services/api/types';
import LocalStorageService from '../../store/LocalStorageService';
import {
  FormInput,
  InputType,
  SQUASH_GRADE_OPTIONS,
  InputOption,
} from '../common/FormTypes';
import FormComponent from '../common/FormComponent';
import NavigationService, {
  NavigationRoutes,
} from '../../services/navigation/NavigationService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const FIRST_NAME_FORM_NAME = 'FIRST_NAME';
const LAST_NAME_FORM_NAME = 'LAST_NAME';
const CLUB_ID_FORM_NAME = 'CLUB';
const ABILITY_FORM_NAME = 'ABILITY';
const PHONE_NUMBER_FORM_NAME = 'PHONE_NUMBER';

export interface AccountProps {
  playerId?: number;
  isExisting: boolean;
}

interface AccountState {
  playerId?: number;
  isExisting: boolean;
  isLoading: boolean;
  formOptions: FormInput[];
}

type AccountStackNavigationProps = StackNavigationProp<
  RootStackParamList,
  NavigationRoutes.Account
>;

const FormOptions = [
  {
    name: FIRST_NAME_FORM_NAME,
    label: 'First name:',
    input: InputType.Text,
    required: true,
  },
  {
    name: LAST_NAME_FORM_NAME,
    label: 'Last name:',
    input: InputType.Text,
    required: true,
  },
  {
    name: CLUB_ID_FORM_NAME,
    label: 'Select your club:',
    input: InputType.Wheel,
    required: true,
    initialValue: 1,
  },
  {
    name: ABILITY_FORM_NAME,
    label: 'Please enter your ability level:',
    input: InputType.Slider,
    required: true,
    options: SQUASH_GRADE_OPTIONS,
  },
  {
    name: PHONE_NUMBER_FORM_NAME,
    label: 'Phone number:',
    input: InputType.Number,
  },
];

export default class AccountComponent extends Component<
  AccountStackNavigationProps,
  AccountState
> {
  private gameMatcherService: GameMatcherService = new GameMatcherService();
  private storeService: LocalStorageService = new LocalStorageService();

  constructor(props: any) {
    super(props);
    const myProps: AccountProps = props.route.params;
    this.state = {
      playerId: myProps.playerId,
      isExisting: myProps.isExisting,
      isLoading: true,
      formOptions: FormOptions,
    };
  }

  public componentDidMount() {
    this.gameMatcherService.getClubs().then((clubOptions: InputOption[]) => {
      let stateCopy = { ...this.state };
      stateCopy.formOptions.find(
        (i) => i.name === CLUB_ID_FORM_NAME,
      )!.options = clubOptions;
      stateCopy.isLoading = false;
      this.setState(stateCopy);
    });

    if (this.state.isExisting && !!this.state.playerId) {
      this.updateDetails();
    }
  }

  private updateDetails = () => {
    this.setState((prevState) => ({ ...prevState, isLoading: true }));
    this.gameMatcherService
      .getPlayerDetails(this.state.playerId!)
      .then((playerDetails) => {
        if (!playerDetails) return;
        let stateCopy = { ...this.state };
        stateCopy.isLoading = false;
        stateCopy.formOptions.find(
          (i) => i.name === FIRST_NAME_FORM_NAME,
        )!.initialValue = playerDetails.firstName;
        stateCopy.formOptions.find(
          (i) => i.name === LAST_NAME_FORM_NAME,
        )!.initialValue = playerDetails.lastName;
        stateCopy.formOptions.find(
          (i) => i.name === CLUB_ID_FORM_NAME,
        )!.initialValue = playerDetails.clubId;
        stateCopy.formOptions.find(
          (i) => i.name === ABILITY_FORM_NAME,
        )!.initialValue = playerDetails.ability;
        stateCopy.formOptions.find(
          (i) => i.name === PHONE_NUMBER_FORM_NAME,
        )!.initialValue = playerDetails.phoneNumber;
        this.setState(stateCopy);
      });
  };

  private handleSubmit = (values: { [key: string]: any }) => {
    const player: Player = {
      firstName: values[FIRST_NAME_FORM_NAME],
      lastName: values[LAST_NAME_FORM_NAME],
      clubId: values[CLUB_ID_FORM_NAME],
      ability: values[ABILITY_FORM_NAME],
      phoneNumber: values[PHONE_NUMBER_FORM_NAME],
    };

    if (!this.state.isExisting) {
      this.gameMatcherService.addPlayer(player).then((playerId: number) => {
        if (playerId !== -1) {
          this.storeService.setPlayerId(playerId);
          this.updateToken(playerId);
          Alert.alert('You have successfuly created an account.');
          NavigationService.navigateReplace(NavigationRoutes.Matches, {
            playerId: playerId,
          });
        } else {
          Alert.alert(
            'An error occured while creating the player. Please try again.',
          );
        }
      });
    } else if (!!this.state.playerId) {
      this.gameMatcherService
        .updatePlayerDetails(this.state.playerId, player)
        .then((playerId: number) => {
          if (playerId === this.state.playerId) {
            Alert.alert('Details successfully updated!');
          }
        });
    }
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
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={this.updateDetails}
              />
            }>
            <FormComponent
              title={
                this.state.isExisting ? 'Edit Your Details' : 'Create A Player'
              }
              formInputs={this.state.formOptions}
              onSubmit={this.handleSubmit}
              submitButtonLabel={this.state.isExisting ? 'Update' : 'Submit'}
            />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}
