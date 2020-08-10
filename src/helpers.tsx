import React from 'react';
import NavigationService, {
  NavigationRoutes,
} from './services/navigation/NavigationService';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export function dateToString(value: Date): string {
  const dateTimeFormat = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    weekday: 'long',
  });
  return dateTimeFormat.format(value);
}

export function timeToString(value: Date): string {
  const dateTimeFormat = new Intl.DateTimeFormat('en', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });
  return dateTimeFormat.format(value);
}

export function timeElapsedString(value: Date): string {
  if (!value) return '';

  const now = Date.now();
  const diffMs = now - value.getTime();
  if (diffMs < 0) return '';

  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays !== 0)
    return diffDays === 1 ? diffDays + ' day' : diffDays + ' days';

  const diffHours = Math.floor((diffMs % 86400000) / 3600000);
  if (diffHours !== 0)
    return diffHours === 1 ? diffHours + ' hour' : diffHours + ' hours';

  const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
  return diffMins === 1 ? diffMins + ' min' : diffMins + ' mins';
}

export function getHeaderTitle(route: {
  key: string;
  name: string;
  params?: any;
}): string {
  const focussedRoute =
    getFocusedRouteNameFromRoute(route) ?? NavigationRoutes.Home;
  if (focussedRoute === NavigationRoutes.Find) return 'Find A Match';
  if (focussedRoute === NavigationRoutes.Matches) return 'My Matches';
  if (focussedRoute === NavigationRoutes.Account) return 'Account';
  return 'Home';
}

export function getHeaderButton(route: {
  key: string;
  name: string;
  params?: any;
}): JSX.Element {
  const focussedRoute =
    getFocusedRouteNameFromRoute(route) ?? NavigationRoutes.Home;
  if (focussedRoute === NavigationRoutes.Account) {
    return <NotificationButton />;
  }
  if (focussedRoute === NavigationRoutes.Find) {
    return (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <FilterButton />
        <AddRequestButton />
      </View>
    );
  }
  return <AddRequestButton />;
}

const AddRequestButton = () => (
  <TouchableOpacity
    onPress={() => NavigationService.navigate(NavigationRoutes.Request)}>
    <Icon name="plus" style={{ marginRight: 20, fontSize: 20 }} />
  </TouchableOpacity>
);

const FilterButton = () => (
  <TouchableOpacity
    onPress={() => Alert.alert('Filter options coming soon. Stay tuned...')}>
    <Icon name="filter" style={{ marginRight: 20, fontSize: 20 }} solid />
  </TouchableOpacity>
);

const NotificationButton = () => (
  <TouchableOpacity
    onPress={() =>
      Alert.alert('Notification settings coming soon. Stay tuned...')
    }>
    <Icon name="bell" style={{ marginRight: 20, fontSize: 20 }} solid />
  </TouchableOpacity>
);

export const EmptyMatches = (props: any) => (
  <View style={emptyMatchesStyles.center}>
    <View style={[emptyMatchesStyles.center]}>
      <Icon
        name="frown"
        style={emptyMatchesStyles.emptyIcon}
        color="grey"
        solid
      />
      <Text
        style={[emptyMatchesStyles.emptyText, emptyMatchesStyles.lightGrey]}>
        {props?.label}
      </Text>
      {!!props.subLabel && (
        <Text
          style={[
            emptyMatchesStyles.emptySubText,
            emptyMatchesStyles.lightGrey,
          ]}>
          {props?.subLabel}
        </Text>
      )}
      <Text
        style={[emptyMatchesStyles.emptySubText, emptyMatchesStyles.lightGrey]}>
        You can request a match by tapping the{' '}
        <Icon name="plus" color="#D3D3D3" /> icon or{' '}
        <Text
          onPress={() => NavigationService.navigate(NavigationRoutes.Request)}
          style={{ fontWeight: 'bold' }}>
          tapping here.
        </Text>
      </Text>
    </View>
  </View>
);

const emptyMatchesStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  lightGrey: {
    color: '#A9A9A9',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 100,
  },
  emptySubText: {
    fontSize: 12,
    textAlign: 'center',
    width: '60%',
  },
});

export function getSquashGrade(value: number): string {
  switch (value) {
    case 12:
      return 'A1';
    case 11:
      return 'A2';
    case 10:
      return 'B1';
    case 9:
      return 'B2';
    case 8:
      return 'C1';
    case 7:
      return 'C2';
    case 6:
      return 'D1';
    case 5:
      return 'D2';
    case 4:
      return 'E1';
    case 3:
      return 'E2';
    case 2:
      return 'F';
    default:
      return 'Beginner';
  }
}
