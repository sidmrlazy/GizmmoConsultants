import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

// ========== Libraries ========== //
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from '../../model/Utils';

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
      <View>
        <Text>{userId}</Text>
        <Text>{name}</Text>
        <Text>{mobile}</Text>
        <Pressable onPress={signOut}>
          <Text>Sign Out</Text>
        </Pressable>
      </View>
    </>
  );
};

export default SettingsScreen;
