import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// ========== Libraries ========== //
import LottieView from 'lottie-react-native';

const SplashScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <LottieView
          source={require('../assets/json/gpsMarker.json')}
          autoPlay
          loop
        />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.copyright}>
          © Designed & Developed by GizmmoAlchemy
        </Text>
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  copyright: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
});
