import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

// ========== Libraries ========== //
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from '../../model/Utils';
import Icons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

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

  React.useEffect(() => {
    userProfileData();
  }, []);
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}>
        <View
          style={{
            width: '100%',
            // borderBottomWidth: 0.5,
            // borderBottomColor: '#c7c7c7c7',
            paddingBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '40%',
              height: '40%',
              borderRadius: 100,
            }}>
            <LottieView
              source={require('../../assets/json/profile.json')}
              autoPlay
              loop
            />
          </View>
          <Text
            style={{
              fontFamily: 'OpenSans-ExtraBold',
              fontSize: 30,
              color: '#0077B6',
            }}>
            {name}
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-SemiBold',
              fontSize: 16,
              color: '#777',
              marginTop: 5,
            }}>
            {mobile}
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            width: '100%',
          }}>
          <Pressable
            style={{
              width: '100%',
              borderWidth: 0.5,
              borderRadius: 5,
              borderColor: '#c7c7c7c7',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 30,
              paddingHorizontal: 10,
              backgroundColor: '#fff',
            }}
            onPress={signOut}>
            <View
              style={{
                width: '300%',
                height: '300%',
                flex: 1,
              }}>
              <LottieView
                source={require('../../assets/json/logout.json')}
                autoPlay
                loop
              />
            </View>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 18,
                color: '#000',
                marginLeft: 20,
                flex: 5,
              }}>
              Sign Out
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default SettingsScreen;
