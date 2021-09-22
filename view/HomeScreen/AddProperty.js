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
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

// ========== Libraries ========== //
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import LottieView from 'lottie-react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';

const AddProperty = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);

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

  const [selectedLanguage, setSelectedLanguage] = useState();

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

  // Location
  const [currentLocation, setCurrentLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [sellerList, setSellerList] = useState('');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  const NO_LOCATION_PROVIDER_AVAILABLE = 2;

  // ======= Show Toast ========== //
  function showToast(msg) {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }

  // Ask user permission to access GPS
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs access to your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          setLocationStatus('Permission Denied');
          requestLocationPermission();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

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
    data.append('owner_contact_number', ownerContact);
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
    data.append('broker_contact_number', brokerContact);
    data.append('brokerage_months', brokerage);
    // console.log(data);
    // return;
    setLoading(true);
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
        console.log(result);
        if (result.error == 0) {
          navigation.navigate('HomeScreen');
        }
      })
      .catch(error => {
        if (error) {
          console.error(error);
        }
      })
      .finally(() => setLoading(false));
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
            quality: 1,
          },
          maxWidth: 700,
          maxHeight: 700,
          includeBase64: true,
        };
        launchImageLibrary(options, res => {
          if (res) {
            if (res.errorCode == 'permission') {
              alert('Gallery Permission granted');
              // return;
            } else if (res.errorCode == 'others') {
              alert(res.errorMessage);
              return;
            } else if (res.didCancel) {
            } else {
              let temp = {name: res.fileName, uri: res.uri, type: res.type};
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

  // ====== Get Longitude and Latitude========== //
  const getOneTimeLocation = async () => {
    let location = await AsyncStorage.getItem('customer_location');
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currentLongitude = JSON.stringify(position.coords.longitude);
          const currentLatitude = JSON.stringify(position.coords.latitude);
          setLatitude(currentLatitude);
          setLongitude(currentLongitude);
          getSellerList(currentLongitude, currentLatitude);
          getCurrentLocation(currentLongitude, currentLatitude);
          console.log(position);
        },

        error => {
          if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
            showToast('Please grant permission to access your location');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 2000,
        },
      );
    } else {
      setCurrentLocation(location);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/CustomerAppApi/PantryoCustomer.php?flag=getPartnerListByAddress',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchAddress: location,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          setSellerList(result.SellerList);
          // console.log(result);
          showToast('Property Uploaded');
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };

  // ====== Get Current Location========== //
  const getCurrentLocation = async (currentLongitude, currentLatitude) => {
    if (!currentLatitude) {
      showToast('latitude not found');
      return;
    } else if (!currentLongitude) {
      showToast('longitude not found');
      return;
    } else {
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/CustomerAppApi/PantryoCustomer.php?flag=getAddressByLongitudeLatitude',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            longitude: currentLongitude,
            latitude: currentLatitude,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          setCurrentLocation(result);
          AsyncStorage.setItem('customer_location', result);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* ======== Owner Details Start ======== */}
          <View style={styles.div}>
            <Text style={styles.sectionHeading}>Property Owner Details</Text>
            <Text style={styles.sectiondetails}>
              Insert the details of the property owner
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Full Name</Text>
              <View style={styles.formInput}>
                <TextInput
                  placeholder=""
                  style={styles.formTxtInput}
                  value={ownerName}
                  onChangeText={setOwnerName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Mobile Number</Text>
              <View style={styles.formInput}>
                <TextInput
                  placeholder=""
                  style={styles.formTxtInput}
                  value={ownerContact}
                  onChangeText={setOwnerContact}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>
          </View>
          {/* ======== Owner Details End ======== */}

          {/* ======== Property Location Start ======== */}
          <View style={styles.div}>
            <Text style={styles.sectionHeading}>Property's Location</Text>
            <Text style={styles.sectiondetails}>
              Insert the details of the identified property
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>State</Text>
              <View style={styles.formInput}>
                <Picker
                  mode="dropdown"
                  selectedValue={state}
                  onValueChange={(itemValue, itemIndex) => setState(itemValue)}>
                  <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
                  {/* <Picker.Item label="Punjab" value="Punjab" />
                  <Picker.Item label="Chandigarh" value="Chandigarh" />
                  <Picker.Item label="Uttarakhand" value="Uttarakhand" /> */}
                </Picker>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>City</Text>
              <View style={styles.formInput}>
                <Picker
                  mode="dialog"
                  selectedValue={city}
                  onValueChange={(itemValue, itemIndex) => setCity(itemValue)}>
                  <Picker.Item label="Agra" value="Agra" />
                  <Picker.Item label="Akbarpur" value="Akbarpur" />
                  <Picker.Item label="Aligarh" value="Aligarh" />
                  <Picker.Item label="Allahabad" value="Allahabad" />
                  <Picker.Item label="Auraiya" value="Auraiya" />
                  <Picker.Item label="Azamgarh" value="Azamgarh" />
                  <Picker.Item
                    label="Bamrauli Katara"
                    value="Bamrauli Katara"
                  />
                  <Picker.Item label="Bangarmau" value="Bangarmau" />
                  <Picker.Item label="Barabanki" value="Barabanki" />
                  <Picker.Item label="Bareilly" value="Bareilly" />
                  <Picker.Item label="Deoria" value="Deoria" />
                  <Picker.Item label="Etawah" value="Etawah" />
                  <Picker.Item label="Fatehpur" value="Fatehpur" />
                  <Picker.Item label="Fatehpur Sikri" value="Fatehpur Sikri" />
                  <Picker.Item label="Ferozabad" value="Ferozabad" />
                  <Picker.Item label="Ghazipur" value="Ghazipur" />
                  <Picker.Item label="Gorakhpur" value="Gorakhpur" />
                  <Picker.Item label="Jaunpur" value="Jaunpur" />
                  <Picker.Item label="Jhansi" value="Jhansi" />
                  <Picker.Item label="Jhusi" value="Jhusi" />
                  <Picker.Item label="Jugor" value="Jugor" />
                  <Picker.Item label="Kanpur" value="Kanpur" />
                  <Picker.Item label="Khaga" value="Khaga" />
                  <Picker.Item label="Lucknow" value="Lucknow" />
                  <Picker.Item label="Mathura" value="Mathura" />
                  <Picker.Item label="Mau" value="Mau" />
                  <Picker.Item label="Meerut" value="Meerut" />
                  <Picker.Item label="Mirzapur" value="Mirzapur" />
                  <Picker.Item label="Mirzapur" value="Mirzapur" />
                </Picker>
                {/* <TextInput
                  placeholder=""
                  style={styles.formTxtInput}
                  autoCapitalize="characters"
                  value={city}
                  onChangeText={setCity}
                /> */}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Address</Text>
              <View style={styles.formInput}>
                <TextInput
                  placeholder=""
                  style={styles.formTxtInput}
                  autoCapitalize="words"
                  multiline={true}
                  numberOfLines={5}
                  value={propertyAddress}
                  onChangeText={setPropertyAddress}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Pincode</Text>
              <View style={styles.formInput}>
                <TextInput
                  placeholder=""
                  style={styles.formTxtInput}
                  keyboardType="number-pad"
                  value={pincode}
                  onChangeText={setPincode}
                />
              </View>
            </View>
          </View>
          {/* ======== Property Location End ======== */}

          {/* ======== Property Dimensions Start ======== */}
          <View style={styles.div}>
            <Text style={styles.sectionHeading}>Property Details</Text>
            <Text style={styles.sectiondetails}>
              Insert the carpet area, frontage etc of the identified property
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Carpet Area</Text>
              <View style={styles.formInput}>
                <TextInput
                  placeholder=""
                  style={styles.formTxtInput}
                  keyboardType="number-pad"
                  value={carpetArea}
                  onChangeText={setCarpetArea}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Frontage</Text>
              <View style={styles.formInput}>
                <TextInput
                  placeholder=""
                  style={styles.formTxtInput}
                  keyboardType="number-pad"
                  value={frontage}
                  onChangeText={setFrontage}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Floor offered</Text>
              <View style={styles.formInput}>
                <Picker
                  mode="dropdown"
                  selectedValue={floor}
                  onValueChange={(itemValue, itemIndex) => setFloor(itemValue)}>
                  <Picker.Item label="Ground Floor" value="Ground Floor" />
                  <Picker.Item
                    label="Upper Ground Floor"
                    value="Upper Ground Floor"
                  />
                  <Picker.Item
                    label="Lower Ground Floor"
                    value="Lower Ground Floor"
                  />
                  <Picker.Item label="Basement" value="Basement" />
                </Picker>
              </View>
            </View>
          </View>
          {/* ======== Property Dimensions End ======== */}

          {/* ======== Rentals Start ======== */}
          <View style={styles.div}>
            <Text style={styles.sectionHeading}>Rentals</Text>
            <Text style={styles.sectiondetails}>
              Insert the rent asked by the property owner
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Asking price (per sqft)</Text>
              <View style={styles.formInput}>
                <TextInput
                  placeholder="₹"
                  style={styles.formTxtInput}
                  keyboardType="number-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Brokerage (in months)</Text>
              <View style={styles.formInput}>
                <Picker
                  mode="dropdown"
                  selectedValue={brokerage}
                  onValueChange={(itemValue, itemIndex) =>
                    setBrokerage(itemValue)
                  }>
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="4" value="4" />
                  <Picker.Item label="5" value="5" />
                  <Picker.Item label="6" value="6" />
                </Picker>
              </View>
            </View>
          </View>
          {/* ======== Rentals End ======== */}

          {/* ======== Referred by Start ======== */}
          <View style={styles.div}>
            <Text style={styles.sectionHeading}>Referred by</Text>
            <Text style={styles.sectiondetails}>
              Is the property referred by a broker or through reference? Please
              mention the details below
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Referred by</Text>
              <View style={styles.formInput}>
                <TextInput
                  placeholder=""
                  style={styles.formTxtInput}
                  autoCapitalize="words"
                  value={brokerName}
                  onChangeText={setBrokerName}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Contact Number</Text>
              <View style={styles.formInput}>
                <TextInput
                  placeholder=""
                  style={styles.formTxtInput}
                  keyboardType="phone-pad"
                  value={brokerContact}
                  onChangeText={setBrokerContact}
                  maxLength={10}
                />
              </View>
            </View>
          </View>
          {/* ======== Referred by End ======== */}

          {/* ======== Image Section Start ======== */}
          <View style={styles.div}>
            <Text style={styles.sectionHeading}>Image Section</Text>
            <Text style={styles.sectiondetails}>
              Upload 4 images of the property (front, left, right, facing the
              road)
            </Text>

            <View style={styles.innerDivRow}>
              {/* Front Image */}
              {frontImagePath === '' ? (
                <TouchableOpacity
                  onPress={() => {
                    requestGalleryPermission('front');
                  }}
                  style={styles.innerdiv}>
                  <Icons name="image-outline" size={25} color="#777" />
                  <Text style={styles.sectiondetails}>Upload Front Image</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    requestGalleryPermission('front');
                  }}
                  style={styles.innerdiv}>
                  <Icons name="checkmark-circle" size={25} color="green" />
                  <Text style={styles.sectiondetails}>
                    Front Image uploaded
                  </Text>
                </TouchableOpacity>
              )}
              {/* Front Image */}

              {/* Left Image */}
              {leftImagePath === '' ? (
                <TouchableOpacity
                  onPress={() => {
                    requestGalleryPermission('left');
                  }}
                  style={styles.innerdiv}>
                  <Icons name="image-outline" size={25} color="#777" />
                  <Text style={styles.sectiondetails}>
                    Upload Left Side Image
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    requestGalleryPermission('left');
                  }}
                  style={styles.innerdiv}>
                  <Icons name="checkmark-circle" size={25} color="green" />
                  <Text style={styles.sectiondetails}>
                    Left Side Image uploaded
                  </Text>
                </TouchableOpacity>
              )}
              {/* Left Image */}
            </View>

            <View style={styles.innerDivRow}>
              {/* Rightt Image */}
              {rightImagePath === '' ? (
                <TouchableOpacity
                  onPress={() => {
                    requestGalleryPermission('right');
                  }}
                  style={styles.innerdiv}>
                  <Icons name="image-outline" size={25} color="#777" />
                  <Text style={styles.sectiondetails}>
                    Upload Right Side Image
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    requestGalleryPermission('right');
                  }}
                  style={styles.innerdiv}>
                  <Icons name="checkmark-circle" size={25} color="green" />
                  <Text style={styles.sectiondetails}>
                    Right Side Image uploaded
                  </Text>
                </TouchableOpacity>
              )}
              {/* Rightt Image */}

              {/* Opposite Image */}
              {oppositeImagePath === '' ? (
                <TouchableOpacity
                  onPress={() => {
                    requestGalleryPermission('opposite');
                  }}
                  style={styles.innerdiv}>
                  <Icons name="image-outline" size={25} color="#777" />
                  <Text style={styles.sectiondetails}>
                    Upload Opposite Side Image
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    requestGalleryPermission('opposite');
                  }}
                  style={styles.innerdiv}>
                  <Icons name="checkmark-circle" size={25} color="green" />
                  <Text style={styles.sectiondetails}>
                    Opposite Side Image uploaded
                  </Text>
                </TouchableOpacity>
              )}
              {/* Opposite Image */}
            </View>
          </View>
          {/* ======== Image Section End ======== */}

          {/* ========== Upload Button ========== */}
          {isLoading ? (
            <TouchableOpacity style={styles.btn} onPress={uploadProperty}>
              <ActivityIndicator animating={true} color="#fff" size="large" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btn} onPress={uploadProperty}>
              <Text style={styles.btnTxt}>SUBMIT</Text>
            </TouchableOpacity>
          )}
          {/* ========== Upload Button ========== */}
        </View>
      </ScrollView>
    </>
  );
};

export default AddProperty;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#183d6b',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  div: {
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginBottom: 10,
    marginTop: 10,
  },
  sectionHeading: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#000',
  },
  sectiondetails: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginTop: 5,
  },
  innerDivRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerdiv: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderWidth: 0.5,
    paddingVertical: 20,
    borderRadius: 10,
    height: 150,
    marginHorizontal: 2,
  },
  formSection: {
    marginTop: 20,
    width: '100%',
  },
  formLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  formInput: {
    width: '100%',
    borderWidth: 0.5,
    marginTop: 5,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  formTxtInput: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  btn: {
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: '#e6a42c',
    borderRadius: 5,
  },
  btnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#fff',
  },
});
