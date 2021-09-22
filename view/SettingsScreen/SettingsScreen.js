import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Share} from 'react-native';

// ========== Libraries ========== //
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from '../../model/Utils';
import Icons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  const {signOut} = React.useContext(AuthContext);
  const [userId, setUserId] = React.useState('');
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');

  const userProfileData = async () => {
    setUserId(await AsyncStorage.getItem('user_id'));
    setName(await AsyncStorage.getItem('user_name'));
    setMobile(await AsyncStorage.getItem('user_mobile'));
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'https://reactnative.dev/docs/share' + '/' + userId,
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
        message: name + ',' + ' ' + mobile,
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
          <Icons name="document-attach-outline" size={25} color="#6c3a9e" />
          <Text style={styles.tabTxt}>Share Property Detail Form</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={shareContact} style={styles.tab}>
          <Icons name="megaphone-outline" size={25} color="#6c3a9e" />
          <Text style={styles.tabTxt}>Share E-Card</Text>
        </TouchableOpacity>

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
    fontSize: 22,
    flex: 1,
    marginLeft: 20,
  },
});
