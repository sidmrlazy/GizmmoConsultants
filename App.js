import React from 'react';
import {Text, View, ToastAndroid} from 'react-native';

// ========== Libraries ========== //
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from './model/Utils';

// ========== Screens ========== //
import HomeScreen from './controller/Navigation';
import SplashScreen from './controller/SplashScreen';
import LoginScreen from './controller/Login';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setLoading] = React.useState();

  function showToast(msg) {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          if (action.token) {
            AsyncStorage.setItem('userToken', action.token);
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          AsyncStorage.clear();
          AsyncStorage.removeItem('userToken', action.token);
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    setTimeout(() => {
      const bootstrapAsync = async () => {
        let userToken;

        try {
          userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {}
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      };

      bootstrapAsync();
    }, 3000);
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        const {user_mobile, user_password} = data;

        if (!user_mobile) {
          showToast('Please enter your authorized mobile number');
          return;
        }
        if (!user_password) {
          showToast('Password is incorrect');
          return;
        }
        fetch(
          'https://gizmmoalchemy.com/api/consultancy/consultancy.php?flag=login',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_mobile: user_mobile,
              user_password: user_password,
            }),
          },
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (result) {
            console.log(result);
            setLoading(false);
            if (result.error == 0) {
              AsyncStorage.setItem('user_id', result.user_id);
              AsyncStorage.setItem('user_name', result.user_name);
              AsyncStorage.setItem('user_mobile', result.user_mobile);
              dispatch({type: 'SIGN_IN', token: 'userToken'});
              AsyncStorage.setItem('userToken', '1');
            } else {
              showToast('We could not find this user in our system');
            }
          })
          .catch(error => {
            console.error(error);
          });

        // dispatch({type: 'SIGN_IN', token: 'userToken'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
    }),
    [],
  );
  return (
    <>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            {state.isLoading ? (
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
            ) : state.userToken == null ? (
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                  title: 'Sign in',
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
            ) : (
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                  title: 'Home',
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </>
  );
};

export default App;
