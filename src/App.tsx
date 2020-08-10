import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
  Notification,
  NotificationOpen,
} from 'react-native-firebase/notifications';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirebaseService from './services/firebase/FirebaseService';
import GameMatcherService from './services/api/GameMatcherService';
import CreateRequestComponent, {
  RequestMatchProps,
} from './components/request/CreateRequestComponent';
import LocalStorageService from './store/LocalStorageService';
import RequestModal from './components/request/RequestModal';
import NavigationService, {
  NavigationRoutes,
} from './services/navigation/NavigationService';
import { RequestNotification } from './services/api/types';
import { Alert } from 'react-native';
import { MyMatchesProps } from './components/match/ViewMyMatchesComponent';
import HomeComponent, { HomeProps } from './components/home/HomeStackComponent';
import { FindMatchesProps } from './components/match/FindMatchRequests';
import { getHeaderTitle, getHeaderButton } from './helpers';
import AccountComponent, {
  AccountProps,
} from './components/account/AccountComponent';
import LoadingScreen from './components/common/LoadingScreen';

export type RootStackParamList = {
  Account: AccountProps;
  Find: FindMatchesProps;
  Home: HomeProps;
  Loading: undefined;
  Login: AccountProps;
  Matches: MyMatchesProps;
  Request: RequestMatchProps;
};

interface AppState {
  playerId: number;
  showRequestModal: boolean;
  requestNotificationData?: RequestNotification;
}

const Stack = createStackNavigator<RootStackParamList>();

export default class App extends Component<any, AppState> {
  private readonly firebaseService: FirebaseService = new FirebaseService();
  private readonly gameMatcherApiService: GameMatcherService = new GameMatcherService();
  private readonly storeService: LocalStorageService = new LocalStorageService();

  constructor(props: any) {
    super(props);
    this.state = {
      playerId: -1,
      showRequestModal: false,
    };
  }

  public componentDidMount() {
    this.storeService.getPlayerId().then((playerId: number) => {
      if (playerId !== -1) {
        NavigationService.navigateReplace(NavigationRoutes.Find, {
          playerId: playerId,
        });
      } else {
        this.setState((prevState: any) => ({
          ...prevState,
          playerId: playerId,
        }));
        NavigationService.navigateReplace(NavigationRoutes.Login, {
          isExisting: false,
        });
      }
    });

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

  public onNotification = (notification: Notification) => {
    console.log('[NotificationFCM] onNotification: ', notification);
    this.handleNotificationReceived(notification);
  };

  public onNotificationOpen = (notificationOpen: NotificationOpen) => {
    console.log('[NotificationFCM] onNotificationOpen: ', notificationOpen);
    this.handleNotificationReceived(notificationOpen.notification);
  };

  private handleNotificationReceived = (notification: Notification) => {
    const data = notification.data;
    if (data['type'] === 'REQUEST_NOTIFICATION') {
      const request: RequestNotification = {
        id: +data['Id'],
        hostPlayerId: +data['HostPlayerId'],
        created: new Date(data['Created']),
        matchStartTime: new Date(data['MatchStartTime']),
        lengthInMins: +data['LengthInMins'],
        hostPlayerAbility: +data['HostPlayerAbility'],
      };
      this.launchRequestModal(request);
    }
  };

  private launchRequestModal = (request: RequestNotification) => {
    this.setState((prevState: any) => ({
      ...prevState,
      showRequestModal: true,
      requestNotificationData: request,
    }));
  };

  private onRequestNotificationModalAction = (
    action: boolean,
    requestId?: number,
  ) => {
    this.setState((prevState: any) => ({
      ...prevState,
      showRequestModal: false,
    }));

    if (action && !!requestId) {
      this.storeService.getPlayerId().then((playerId: number) => {
        this.gameMatcherApiService
          .confirmMatch(requestId, playerId)
          .then((matchId: number) =>
            Alert.alert(
              'You have accepted the match. Your match Id is: ' + matchId,
            ),
          );
      });
    }
  };

  render() {
    return (
      <>
        <NavigationContainer
          ref={(navigationRef: NavigationContainerRef) =>
            NavigationService.setNavigator(
              navigationRef,
              this.launchRequestModal,
            )
          }>
          <Stack.Navigator>
            <Stack.Screen
              name={NavigationRoutes.Loading}
              component={LoadingScreen}
              options={{ title: 'Loading...' }}
            />
            <Stack.Screen
              name={NavigationRoutes.Login}
              component={AccountComponent}
              options={{ title: 'Login to continue...' }}
            />
            <Stack.Screen
              name={NavigationRoutes.Request}
              component={CreateRequestComponent}
              initialParams={{ playerId: this.state.playerId }}
            />
            <Stack.Screen
              name={NavigationRoutes.Home}
              component={HomeComponent}
              options={({ route }) => ({
                title: getHeaderTitle(route),
                headerRight: () => getHeaderButton(route),
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
        {this.state?.showRequestModal && (
          <RequestModal
            request={this.state.requestNotificationData!}
            onAction={this.onRequestNotificationModalAction}
          />
        )}
      </>
    );
  }
}
