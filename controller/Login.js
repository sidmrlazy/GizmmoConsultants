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
  const [isSecureEntry, setIsSecureEntry] = React.useState(true);

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

            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.formRow}>
              <Icons name="phone-portrait-outline" size={20} color="#03045E" />
              <TextInput
                placeholder=""
                keyboardType="phone-pad"
                style={styles.formTxtInput}
                onChangeText={setUsername}
                value={user_mobile}
                autoFocus={true}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.formRow}>
              <Icons name="lock-closed-outline" size={20} color="#03045E" />
              <TextInput
                placeholder=""
                style={styles.formTxtInput}
                secureTextEntry={isSecureEntry}
                onChangeText={setPassword}
                value={user_password}
                onSubmitEditing={() => {
                  signIn({
                    user_mobile,
                    user_password,
                  });
                }}
              />
              <Pressable
                onPress={() => {
                  setIsSecureEntry(prev => !prev);
                }}>
                {isSecureEntry ? (
                  <Icons
                    name="eye-off-outline"
                    size={25}
                    color="#03045E"
                    style={{marginRight: 10}}
                  />
                ) : (
                  <Icons
                    name="eye-outline"
                    size={25}
                    color="#03045E"
                    style={{marginRight: 10}}
                  />
                )}
              </Pressable>
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
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#03045E',
    paddingVertical: 5,
  },
  formTxtInput: {
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  loginBtn: {
    marginTop: 30,
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
