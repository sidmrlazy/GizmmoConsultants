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
import Download from './DownloadDocuments';

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

          <Pressable
            onPress={() => navigation.navigate('Download')}
            style={styles.tab}>
            <Icons name="library-outline" size={25} color="#0077B6" />
            <Text style={styles.tabTxt}>Download Documents</Text>
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
      <Stack.Screen name="Download" component={Download} />
    </Stack.Navigator>
  );
};

export default HomeScreenHolder;

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 5,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginTop: 10,
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
    marginTop: 10,
  },
  tabTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    flex: 1,
    marginLeft: 20,
  },
});
