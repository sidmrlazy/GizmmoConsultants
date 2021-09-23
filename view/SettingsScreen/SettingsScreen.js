import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Share} from 'react-native';

// ========== Libraries ========== //
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../model/Utils';
import Icons from 'react-native-vector-icons/Ionicons';
import VersionInfo from 'react-native-version-info';

const SettingsScreen = () => {
  const {signOut} = React.useContext(AuthContext);
  const [userId, setUserId] = React.useState('');
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [appVersion, setAppVersion] = React.useState('');

  const userProfileData = async () => {
    setUserId(await AsyncStorage.getItem('user_id'));
    setName(await AsyncStorage.getItem('user_name'));
    setMobile(await AsyncStorage.getItem('user_mobile'));
  };

  const onShare = async () => {
    // const Buffer = require("buffer").Buffer;
    // let encodedAuth = new Buffer("your text").toString("base64");
    try {
      const result = await Share.share({
        message:
          'https://gizmmoalchemy.com/api/consultancy/index.php?userId=' +
          userId,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result.activityType);
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const shareContact = async () => {
    try {
      const result = await Share.share({
        message:
          name +
          ',' +
          ' ' +
          'from Gizmmo Consultants.' +
          ' ' +
          'Save my contact number' +
          ' ' +
          mobile,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result.activityType);
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    setAppVersion(VersionInfo.appVersion);
    userProfileData();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.details}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userMobile}>{mobile}</Text>
        </View>

        <TouchableOpacity onPress={onShare} style={styles.tab}>
          <Icons name="paper-plane-outline" size={25} color="#6c3a9e" />
          <Text style={styles.tabTxt}>Send Property Detail Form</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={shareContact} style={styles.tab}>
          <Icons name="megaphone-outline" size={25} color="#6c3a9e" />
          <Text style={styles.tabTxt}>Share your information</Text>
        </TouchableOpacity>

        <View onPress={shareContact} style={styles.tab}>
          <Icons name="logo-google-playstore" size={25} color="#6c3a9e" />
          <Text style={styles.tabTxt}>App Version ({appVersion})</Text>
        </View>

        <TouchableOpacity onPress={signOut} style={styles.tab}>
          <Icons name="log-out-outline" size={25} color="#6c3a9e" />
          <Text style={styles.tabTxt}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  details: {
    width: '100%',
    paddingBottom: 15,
    marginBottom: 20,
  },
  userName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#6c3a9e',
  },
  userMobile: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  tab: {
    width: '100%',
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingBottom: 30,
    borderBottomColor: '#c7c7c7',
  },
  tabTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
    flex: 1,
    marginLeft: 20,
  },
});
