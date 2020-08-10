import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationRoutes } from '../../services/navigation/NavigationService';
import ViewMyMatchesComponent from '../match/ViewMyMatchesComponent';
import FindMatchRequestsComponent from '../match/FindMatchRequests';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import AccountComponent from '../account/AccountComponent';
import { getHeaderButton } from '../../helpers';

const Tab = createBottomTabNavigator();

export interface HomeProps {
  playerId: number;
}

export type HomeStackNavigationProp = StackNavigationProp<
  RootStackParamList,
  NavigationRoutes.Home
>;

export default class HomeComponent extends Component {
  private readonly playerId: number;

  constructor(props: any) {
    super(props);
    this.playerId = props.route.params.playerId;
  }

  render() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: styles.tabLabel,
          activeTintColor: 'blue',
          inactiveTintColor: 'black',
        }}>
        <Tab.Screen
          name={NavigationRoutes.Find}
          component={FindMatchRequestsComponent}
          options={{
            title: 'Find A Match',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon name="search" color={color} size={size} />
            ),
          }}
          initialParams={{
            playerId: this.playerId,
          }}
        />
        <Tab.Screen
          name={NavigationRoutes.Matches}
          component={ViewMyMatchesComponent}
          options={{
            title: 'My Matches',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcon name="tennis" color={color} size={size} />
            ),
          }}
          initialParams={{
            playerId: this.playerId,
          }}
        />
        <Tab.Screen
          name={NavigationRoutes.Account}
          component={AccountComponent}
          options={{
            title: 'Account',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon name="user" color={color} size={size} solid />
            ),
          }}
          initialParams={{
            playerId: this.playerId,
            isExisting: true,
          }}
        />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  tabLabel: {
    fontWeight: 'bold',
  },
});
