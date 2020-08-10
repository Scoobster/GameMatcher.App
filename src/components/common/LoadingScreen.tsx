import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingScreen = () => (
  <View
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
    }}>
    <ActivityIndicator size="large" color="blue" />
  </View>
);

export default LoadingScreen;
