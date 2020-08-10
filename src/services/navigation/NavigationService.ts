import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import { RequestNotification } from 'src/services/api/types';

export enum NavigationRoutes {
  Account = 'Account',
  Find = 'Find',
  Home = 'Home',
  Loading = 'Loading',
  Login = 'Login',
  Matches = 'Matches',
  Request = 'Request',
}

const TabRoutes: NavigationRoutes[] = [
  NavigationRoutes.Account,
  NavigationRoutes.Find,
  NavigationRoutes.Matches,
];

let navigator: NavigationContainerRef;
let showRequestModal: (reqNotif: RequestNotification) => void;

function setNavigator(
  navRef: NavigationContainerRef,
  showRequestModalCallback: (reqNotif: RequestNotification) => void,
) {
  navigator = navRef;
  showRequestModal = showRequestModalCallback;
}

function navigate(route: NavigationRoutes, params?: any) {
  if (!navigator) return;
  if (isTabRoute(route)) {
    navigator.navigate(NavigationRoutes.Home, {
      screen: route,
      ...params,
    });
    return;
  }
  navigator.navigate(route, params);
}

function navigateReplace(route: NavigationRoutes, params?: any) {
  if (!navigator) return;
  if (isTabRoute(route)) {
    navigator.dispatch(
      StackActions.replace(NavigationRoutes.Home, {
        ...params,
        screen: route,
      }),
    );
    return;
  }
  navigator.dispatch(StackActions.replace(route, params));
}

function displayRequestModal(request: RequestNotification) {
  showRequestModal(request);
}

function isTabRoute(route: NavigationRoutes): boolean {
  if (TabRoutes.includes(route)) return true;
  return false;
}

export default { setNavigator, navigate, navigateReplace, displayRequestModal };
