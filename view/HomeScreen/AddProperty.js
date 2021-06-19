import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Modal,
  LogBox,
  PermissionsAndroid,
} from 'react-native';

// ========== Libraries ========== //
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import LottieView from 'lottie-react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';

const AddProperty = ({navigation}) => {
  // React Native Modal
  const [modalVisible, setModalVisible] = useState(false);

  // React Native DropDownPicker
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Ground Floor', value: 'Ground Floor'},
    {label: 'Upper Ground Floor', value: 'Upper Ground Floor'},
    {label: 'Lower Ground Floor', value: 'Lower Ground Floor'},
    {label: 'Basemenet', value: 'Basement'},
  ]);

  const [frontImage, setFrontImage] = useState('');
  const [frontImagePath, setFrontImagePath] = useState('');
  const [leftImage, setLeftImage] = useState('');
  const [leftImagePath, setLeftImagePath] = useState('');
  const [rightImage, setRightImage] = useState('');
  const [rightImagePath, setRightImagePath] = useState('');
  const [oppositeImage, setOppositeImage] = useState('');
  const [oppositeImagePath, setOppositeImagePath] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [carpetArea, setCarpetArea] = useState('');
  const [frontage, setFrontage] = useState('');
  const [price, setPrice] = useState('');
  const [floor, setFloor] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [brokerName, setBrokerName] = useState('');
  const [brokerContact, setBrokerContact] = useState('');
  const [brokerage, setBrokerage] = useState('');

  const uploadPropertyApi =
    'https://gizmmoalchemy.com/api/consultancy/consultancy_property.php';

  // Function to upload property details
  const uploadProperty = async () => {
    let uploadBy = await AsyncStorage.getItem('user_id');
    // console.log(uploadBy);
    const data = new FormData();
    data.append('front_image', frontImage);
    data.append('left_image', leftImage);
    data.append('right_image', rightImage);
    data.append('opposite_image', oppositeImage);
    data.append('upload_by', uploadBy);
    data.append('owner_name', ownerName);
    data.append('owner_contact_name', ownerContact);
    data.append('address', propertyAddress);
    data.append('city', city);
    data.append('state', state);
    data.append('pincode', pincode);
    data.append('carpet_area', carpetArea);
    data.append('frontage', frontage);
    data.append('floor', floor);
    data.append('price', price);
    data.append('latitude', lat);
    data.append('longitude', long);
    data.append('broker_name', brokerName);
    data.append('broker_contact_name', brokerContact);
    data.append('brokerage_months', brokerage);
    // console.log(data);
    // return;
    fetch(
      'https://gizmmoalchemy.com/api/consultancy/consultancy_property.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data; ',
        },
        body: data,
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.error == 1) {
          alert(result.msg);
          navigation.navigate('HomeScreen');
        } else {
          alert(result.msg);
        }
      })
      .catch(error => {
        if (error) {
          console.error(error);
        }
      });
  };

  // Gallery Permission
  const requestGalleryPermission = async selectForImage => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Gizmmo Consultants Gallery Permission Required',
          message: 'Gizmmo Consultants needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          maxWidth: 300,
          maxHeight: 400,
          quality: 0.5,
          includeBase64: true,
        };
        launchImageLibrary(options, res => {
          2;
          if (res) {
            // alert(JSON.stringify(res));
            if (res.errorCode == 'permission') {
              alert('Gallery Permission granted');
              // return;
            } else if (res.errorCode == 'others') {
              alert(res.errorMessage);
              return;
            } else if (res.didCancel) {
            } else {
              let temp = {name: res.fileName, uri: res.uri, type: res.type};
              console.log(temp);
              if (selectForImage == 'front') {
                setFrontImage(temp);
                setFrontImagePath(res.uri);
              } else if (selectForImage == 'left') {
                setLeftImage(temp);
                setLeftImagePath(res.uri);
              } else if (selectForImage == 'right') {
                setRightImage(temp);
                setRightImagePath(res.uri);
              } else if (selectForImage == 'opposite') {
                setOppositeImage(temp);
                setOppositeImagePath(res.uri);
              }
            }
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    // LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.screenName}>Add New Property</Text>

          {/* ========== Front Image upload Section ========== */}
          {frontImagePath === '' ? (
            <>
              <Pressable
                onPress={() => {
                  requestGalleryPermission('front');
                }}
                style={styles.imgUploadContainer}>
                <View style={{flex: 1}}>
                  <Text style={[styles.imgBoxLabel]}>
                    Click on the icon to{' '}
                  </Text>
                  <Text style={[styles.imgBoxLabel]}>Upload Front Image</Text>
                </View>

                <View style={styles.imgIconBox}>
                  <Icons name="cloud-upload-outline" size={25} color="#777" />
                </View>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                onPress={() => {
                  requestGalleryPermission('front');
                }}
                style={styles.imgUploadContainer}>
                <Text style={[styles.imgBoxLabel, {flex: 1}]}>
                  Front Image Uploaded
                </Text>
                <Icons name="checkmark-done-outline" size={25} color="green" />
              </Pressable>
            </>
          )}
          {/* ========== Front Image upload Section ========== */}

          {/* ========== Left Image upload Section ========== */}
          {leftImagePath === '' ? (
            <>
              <Pressable
                onPress={() => {
                  requestGalleryPermission('left');
                }}
                style={styles.imgUploadContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.imgBoxLabel}>Click here to </Text>
                  <Text style={styles.imgBoxLabel}>Upload Front Image</Text>
                </View>
                <View style={styles.imgIconBox}>
                  <Icons name="cloud-upload-outline" size={25} color="#777" />
                </View>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                onPress={() => {
                  requestGalleryPermission('left');
                }}
                style={styles.imgUploadContainer}>
                {/* <View style={styles.imgIconBox}>
                  <Image
                    source={{uri: leftImagePath}}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 5,
                    }}
                  />
                </View> */}
                <Text style={[styles.imgBoxLabel, {flex: 1}]}>
                  Left Image Uploaded
                </Text>
                <Icons name="checkmark-done-outline" size={25} color="green" />
              </Pressable>
            </>
          )}
          {/* ========== Left Image upload Section ========== */}

          {/* ========== Right Image upload Section ========== */}
          {rightImagePath === '' ? (
            <>
              <Pressable
                onPress={() => {
                  requestGalleryPermission('right');
                }}
                style={styles.imgUploadContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.imgBoxLabel}>Click here to </Text>
                  <Text style={styles.imgBoxLabel}>Upload Front Image</Text>
                </View>
                <View style={styles.imgIconBox}>
                  <Icons name="cloud-upload-outline" size={25} color="#777" />
                </View>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                onPress={() => {
                  requestGalleryPermission('right');
                }}
                style={styles.imgUploadContainer}>
                {/* <View style={styles.imgIconBox}>
                  <Image
                    source={{uri: rightImagePath}}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 5,
                    }}
                  />
                </View> */}
                <Text style={[styles.imgBoxLabel, {flex: 1}]}>
                  Right Image Uploaded
                </Text>
                <Icons name="checkmark-done-outline" size={25} color="green" />
              </Pressable>
            </>
          )}
          {/* ========== Right Image upload Section ========== */}

          {/* ========== Opp Image upload Section ========== */}
          {oppositeImagePath === '' ? (
            <>
              <Pressable
                onPress={() => {
                  requestGalleryPermission('opposite');
                }}
                style={styles.imgUploadContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.imgBoxLabel}>Click here to </Text>
                  <Text style={styles.imgBoxLabel}>Upload Front Image</Text>
                </View>
                <View style={styles.imgIconBox}>
                  <Icons name="cloud-upload-outline" size={25} color="#777" />
                </View>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                onPress={() => {
                  requestGalleryPermission('opposite');
                }}
                style={styles.imgUploadContainer}>
                {/* <View style={styles.imgIconBox}>
                  <Image
                    source={{uri: oppositeImagePath}}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 5,
                    }}
                  />
                </View> */}
                <Text style={[styles.imgBoxLabel, {flex: 1}]}>
                  Opposite Side Image Uploaded
                </Text>
                <Icons name="checkmark-done-outline" size={25} color="green" />
              </Pressable>
            </>
          )}
          {/* ========== Opp Image upload Section ========== */}

          {/* ========== Owner Name ========== */}
          <View style={[styles.formGroup, {marginTop: 30}]}>
            <Text style={styles.label}>Owner Name</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              autoCapitalize="words"
              value={ownerName}
              onChangeText={setOwnerName}
            />
          </View>
          {/* ========== Owner Name ========== */}

          {/* ========== Owner Contact Number ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Owner Contact Number</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              keyboardType="phone-pad"
              value={ownerContact}
              onChangeText={setOwnerContact}
            />
          </View>
          {/* ========== Owner Contact Number ========== */}

          {/* ========== Address ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Property Address</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              autoCapitalize="words"
              multiline={true}
              numberOfLines={5}
              value={propertyAddress}
              onChangeText={setPropertyAddress}
            />
          </View>
          {/* ========== Address ========== */}

          {/* ========== City ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              autoCapitalize="words"
              value={city}
              onChangeText={setCity}
            />
          </View>
          {/* ========== City ========== */}

          {/* ========== State ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>State</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              autoCapitalize="words"
              value={state}
              onChangeText={setState}
            />
          </View>
          {/* ========== State ========== */}

          {/* ========== Pincode ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              keyboardType="number-pad"
              value={pincode}
              onChangeText={setPincode}
            />
          </View>
          {/* ========== Pincode ========== */}

          {/* ========== Carpet Area ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Total Carpet Area (Offered)</Text>
            <TextInput
              placeholder="in Square Feet"
              style={styles.input}
              keyboardType="number-pad"
              value={carpetArea}
              onChangeText={setCarpetArea}
            />
          </View>
          {/* ========== Carpet Area ========== */}

          {/* ========== Frontage ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Frontage</Text>
            <TextInput
              placeholder="in Feet"
              style={styles.input}
              keyboardType="number-pad"
              value={frontage}
              onChangeText={setFrontage}
            />
          </View>
          {/* ========== Frontage ========== */}

          {/* ========== Floor ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Floor Offered</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={styles.picker}
              dropDownContainerStyle={styles.dropDownContainer}
              onChangeValue={setFloor}
            />
          </View>
          {/* ========== Floor ========== */}

          {/* ========== Price ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Asking Price</Text>
            <TextInput
              placeholder="in Rs"
              style={styles.input}
              keyboardType="number-pad"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          {/* ========== Price ========== */}

          {/* ========== Lat ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              keyboardType="number-pad"
              value={lat}
              onChangeText={setLat}
            />
          </View>
          {/* ========== Lat ========== */}

          {/* ========== Long ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              keyboardType="number-pad"
              value={long}
              onChangeText={setLong}
            />
          </View>
          {/* ========== Long ========== */}

          {/* ========== Broker Name ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Broker Name</Text>
            <TextInput
              placeholder="(if any)"
              style={styles.input}
              autoCapitalize="words"
              value={brokerName}
              onChangeText={setBrokerName}
            />
          </View>
          {/* ========== Broker Name ========== */}

          {/* ========== Broker Contact ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Broker Contact Number</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              keyboardType="phone-pad"
              value={brokerContact}
              onChangeText={setBrokerContact}
            />
          </View>
          {/* ========== Broker Contact ========== */}

          {/* ========== Brokerage Months ========== */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Brokerage Months</Text>
            <TextInput
              placeholder="in months"
              style={styles.input}
              keyboardType="number-pad"
              value={brokerage}
              onChangeText={setBrokerage}
            />
          </View>
          {/* ========== Brokerage Months ========== */}

          {/* ========== Upload Button ========== */}
          <Pressable onPress={uploadProperty} style={styles.uploadBtn}>
            <Text style={styles.uploadBtnTxt}>UPLOAD PROPERTY DETAILS</Text>
          </Pressable>
          {/* ========== Upload Button ========== */}
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LottieView
            source={require('../../assets/json/success.json')}
            autoPlay
            loop
          />
        </View>
      </Modal>
    </>
  );
};

export default AddProperty;

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
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  screenName: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 24,
    marginBottom: 30,
    color: '#03045E',
  },
  imgUploadContainer: {
    width: '100%',
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imgIconBox: {
    borderWidth: 0.5,
    borderColor: '#c7c7c7c7',
    borderRadius: 5,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imgBoxLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },

  formGroup: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  input: {
    marginTop: 10,
    fontFamily: 'OpenSans-Regular',
    borderWidth: 0.5,
    borderColor: '#c7c7c7c7',
    paddingHorizontal: 10,
    color: '#000',
  },
  picker: {
    marginTop: 10,
    borderWidth: 0.5,
    borderRadius: 0,
    borderColor: '#c7c7c7c7',
  },
  dropDownContainer: {
    borderWidth: 0.5,
    borderRadius: 0,
    borderColor: '#c7c7c7c7',
  },
  uploadBtn: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: '#00B4D8',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  uploadBtnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#fff',
  },
});
