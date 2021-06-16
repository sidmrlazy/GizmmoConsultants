import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';

// ========== Libraries ========== //
import {createStackNavigator} from '@react-navigation/stack';
import Icons from 'react-native-vector-icons/Ionicons';

// ========== Screens ========== //
import AddProperty from './AddProperty';

const HomeScreen = ({navigation}) => {
  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Pressable
            onPress={() => navigation.navigate('AddProperty')}
            style={styles.tab}>
            <Icons name="business-outline" size={25} color="#0077B6" />
            <Text style={styles.tabTxt}>Add New Property</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
};

const Stack = createStackNavigator();

const HomeScreenHolder = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddProperty" component={AddProperty} />
    </Stack.Navigator>
  );
};

export default HomeScreenHolder;

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  tab: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  tabTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    flex: 1,
    marginLeft: 20,
  },
});
