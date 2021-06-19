import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

// ========== Libraries ========== //
import Icons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import {AuthContext} from '../model/Utils';

const Login = () => {
  const [user_mobile, setUsername] = React.useState('');
  const [user_password, setPassword] = React.useState('');
  const {signIn} = React.useContext(AuthContext);

  return (
    <>
      <ScrollView style={{backgroundColor: '#fff'}}>
        <View style={styles.topContainer}>
          <View style={styles.lottieBox}>
            <LottieView
              source={require('../assets/json/gpsMarker.json')}
              autoPlay
              loop
              style={styles.lottieJson}
            />
          </View>
          <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>

            <Text style={styles.label}>Enter Mobile Number</Text>
            <View style={styles.formRow}>
              <Icons name="phone-portrait-outline" size={20} color="#03045E" />
              <TextInput
                placeholder="XXXXXXXXXX"
                keyboardType="phone-pad"
                style={styles.formTxtInput}
                onChangeText={setUsername}
                value={user_mobile}
              />
            </View>

            <Text style={styles.label}>Enter Password</Text>
            <View style={styles.formRow}>
              <Icons name="lock-closed-outline" size={20} color="#03045E" />
              <TextInput
                placeholder="Password"
                style={styles.formTxtInput}
                secureTextEntry={true}
                onChangeText={setPassword}
                value={user_password}
              />
            </View>

            <Pressable
              onPress={() => {
                signIn({
                  user_mobile,
                  user_password,
                });
              }}
              style={styles.loginBtn}>
              <Text style={styles.loginBtnTxt}>LOGIN</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  heading: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 40,
    color: '#03045E',
  },
  label: {
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    marginTop: 30,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  formTxtInput: {
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    marginLeft: 10,
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
  },
  loginBtn: {
    marginTop: 50,
    marginBottom: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingVertical: 15,
  },
  loginBtnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#fff',
  },
  topContainer: {
    flex: 1,
    backgroundColor: '#90E0EF',
  },
  lottieBox: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CAF0F8',
  },
  lottieJson: {
    width: '100%',
    height: '100%',
  },
});
