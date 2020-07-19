import firebase from 'react-native-firebase';
import {
  Notification,
  NotificationOpen,
} from 'react-native-firebase/notifications';

export default class FirebaseService {
  private notificationListener = () => {};
  private notificationOpenedListener = () => {};
  private messageListener = () => {};
  private onTokenRefreshListener = () => {};

  constructor() {}

  public register(
    onRegister: Function,
    onNotification: Function,
    onNotificationOpen: Function,
  ): void {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onNotificationOpen,
    );
  }

  private checkPermission(onRegister: Function) {
    firebase
      .messaging()
      .hasPermission()
      .then((enabled: boolean) => {
        if (enabled) {
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('hasPermission rejected ', error);
      });
  }

  private getToken(onRegister: Function) {
    firebase
      .messaging()
      .getToken()
      .then((fcmToken: string) => {
        if (!!fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('User does not have a device token');
        }
      })
      .catch((error) => {
        console.log('getToken rejected ', error);
      });
  }

  private requestPermission(onRegister: Function) {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log('requestPermission rejected ', error);
      });
  }

  private deleteToken() {
    firebase
      .messaging()
      .deleteToken()
      .catch((error) => {
        console.log('deleteToken rejected ', error);
      });
  }

  private createNotificationListeners(
    onRegister: Function,
    onNotification: Function,
    onNotificationOpen: Function,
  ) {
    // Triggered when particular notification has been received in foreground
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        onNotification(notification);
      });

    // If your app is in background, you can listen for when a notification is opened
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen: NotificationOpen) => {
        onNotificationOpen(notificationOpen);
      });

    // If your app is closed, cou can check if it was opened by a notification being opened
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
        if (notificationOpen) {
          const notification: Notification = notificationOpen.notification;
          onNotificationOpen(notificationOpen);
        }
      });

    // Triggered for data only payload in foreground
    this.messageListener = firebase.messaging().onMessage((message: any) => {
      onNotification(message);
    });

    // Triggered when have new token
    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh((fcmToken: string) => {
        onRegister(fcmToken);
      });
  }

  public unregister() {
    this.notificationListener = () => {};
    this.notificationOpenedListener = () => {};
    this.messageListener = () => {};
    this.onTokenRefreshListener = () => {};
  }

  private buildChannel(
    channelId: string,
    channelName: string,
    channelDescription: string,
  ) {
    return new firebase.notifications.Android.Channel(
      channelId,
      channelName,
      firebase.notifications.Android.Importance.High,
    ).setDescription(channelDescription);
  }

  private buildNotificaton(obj: any): Notification {
    // For Android
    firebase.notifications().android.createChannel(obj.channel); // firebase.notifications.Android.Channel

    // For Android and iOS
    return (
      new firebase.notifications.Notification()
        .setSound(obj.sound)
        .setNotificationId(obj.dataId)
        .setTitle(obj.title)
        .setBody(obj.content)
        .setData(obj.data)
        // For Android
        .android.setChannelId(obj.channel.channelId)
        .android.setLargeIcon(obj.largeIcon) // create this icon in Android Studio (android/app/src/main/res/mipmap)
        .android.setSmallIcon(obj.smallIcon) // create this icon in Android Studio (android/app/src/main/res/drawable)
        .android.setColor(obj.colorBgIcon)
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setVibrate(obj.vibrate)
      //.android.setAutoCancel(true) // Auto cancel after receive notification
    );
  }

  private scheduleNotification(
    notification: Notification,
    scheduledDate: Date,
  ) {
    firebase
      .notifications()
      .scheduleNotification(notification, {fireDate: scheduledDate.getTime()});
  }

  private displayNotification(notification: Notification) {
    firebase
      .notifications()
      .displayNotification(notification)
      .catch((error) => console.log('Display notification error ', error));
  }

  private removeDeliveredNotification(notification: Notification) {
    firebase
      .notifications()
      .removeDeliveredNotification(notification.notificationId);
  }
}
