import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// ========== Screens ========== //
import HomeScreen from '../view/HomeScreen/HomeScreen';
import SettingsScreen from '../view/SettingsScreen/SettingsScreen';
import HistoryScreen from '../view/HistoryScreen/HistoryScreen';

// ========== Libraries ========== //
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icons from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialBottomTabNavigator();

const Navigation = ({navigation}) => {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#000"
        inactiveColor="#777"
        backBehavior="initialRoute"
        labeled="true"
        barStyle={{backgroundColor: '#fff'}}
        style={{
          backgroundColor: '#00000000',
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarColor: '#00B4D8',
            tabBarIcon: ({color}) => (
              <Icons name="home-outline" color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="HistoryScreen"
          component={HistoryScreen}
          options={{
            tabBarLabel: 'History',
            tabBarColor: '#90E0EF',
            tabBarIcon: ({color}) => (
              <Icons name="bookmark-outline" color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarColor: '#CAF0F8',
            tabBarIcon: ({color}) => (
              <Icons name="settings-outline" color={color} size={20} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default Navigation;
