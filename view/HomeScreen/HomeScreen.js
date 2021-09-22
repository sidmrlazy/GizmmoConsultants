import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  LogBox,
  Modal,
  useWindowDimensions,
  ToastAndroid,
  RefreshControl,
  ActivityIndicator,
  TouchableHighlight,
  Share,
} from 'react-native';

// ========== Libraries ========== //
import {createStackNavigator} from '@react-navigation/stack';
import Icons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tooltip from 'react-native-walkthrough-tooltip';
import {List} from 'react-native-paper';

// ========== Screens ========== //
import AddProperty from './AddProperty';
import HistoryScreen from '../HistoryScreen/HistoryScreen';
import Download from './DownloadDocuments';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HomeScreen = ({navigation}) => {
  const [userId, setUserId] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const [data, setData] = React.useState('');
  const [frontImage, setFrontImage] = useState('');
  const [rightImage, setRightImage] = useState('');
  const [leftImage, setLeftImage] = useState('');
  const [oppositeImage, setOppositeImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [searchBy, setSearchBy] = useState('');
  const [showTip, setTip] = useState(false);
  const [filter, setFilter] = useState('');

  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);

  const userProfileData = async () => {
    setUserId(await AsyncStorage.getItem('user_id'));
    setUserName(await AsyncStorage.getItem('user_name'));
    setMobile(await AsyncStorage.getItem('user_mobile'));
  };

  // ======= Show Toast ========== //
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    getPropertyDetails();
  }, []);

  const window = useWindowDimensions();

  const getPropertyDetails = async () => {
    setLoading(true);
    let uploadBy = await AsyncStorage.getItem('user_id');
    return fetch(
      'https://gizmmoalchemy.com/api/consultancy/consultancy.php?flag=view_property_new',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upload_by: uploadBy,
        }),
      },
    )
      .then(response => response.json())
      .then(json => {
        setData(json.Property);
        // getPropertyDetails();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const deleteProperty = async () => {
    setLoading(true);
    return fetch(
      'https://gizmmoalchemy.com/api/consultancy/delete_property.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
        }),
      },
    )
      .then(response => response.json())
      .then(json => {
        if (json.error == 0) {
          showToast('Property Deleted');
        } else {
          showToast(
            json.msg + ' ' + 'Please pull down to refresh and try again',
          );
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  async function searchProperty(searchkey) {
    setLoading(true);
    await fetch(
      'https://gizmmoalchemy.com//api/consultancy/search_property.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchkey: searchkey,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result.allproperty);
        if (result.error == 0) {
          setData(result.allproperty);
        } else {
          setData('');
        }
        return Promise.resolve();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function filterProperty() {
    console.log('FILTERED VALUE: ' + filter);
    setLoading(true);
    await fetch(
      'https://gizmmoalchemy.com/api/consultancy/short_property.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sortkey: filter,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result);
        if (result.error == 0) {
          setData(result.allproperty);
        } else {
          showToast('No property of this Carpet Area found');
        }
        return Promise.resolve();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  React.useEffect(() => {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);
    getPropertyDetails();
    userProfileData();
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <View style={styles.loader}>
            <ActivityIndicator size="large" animating={true} color="#237282" />
          </View>
        </>
      ) : (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.scrollView}>
            {/* User Profile Details */}
            <View style={styles.userProfileSection}>
              <Icons name="location" size={30} color="#6c3a9e" />
              <View
                style={{
                  flex: 1,
                  marginLeft: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: 20,
                  }}>
                  Search
                </Text>
                <TextInput
                  placeholder="Property owner name, mobile number, pincode, city"
                  onChangeText={txt => setSearchBy(txt)}
                  onSubmitEditing={() => searchProperty(searchBy)}
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16,
                    flex: 1,
                    marginRight: 10,
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>
            {/* User Profile Details */}

            {/* Buttons */}
            <View style={styles.scrollDiv}>
              {/* <Text style={styles.filterHeading}>
                Filter properties by type
              </Text> */}
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddProperty')}
                  style={[styles.addBtn, {backgroundColor: 'green'}]}>
                  <Icons name="add-outline" size={20} color="#fff" />
                  <Text style={styles.addBtnTxt}>Add Property</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            {/* Buttons */}

            {/* Filter property Through Size */}
            <View style={styles.scrollDiv}>
              <Text style={styles.filterHeading}>
                Filter properties by area
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => {
                    setFilter('100-200');
                    filterProperty();
                  }}>
                  <Text style={styles.filterBtnTxt}>100-200 sqft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => {
                    setFilter('500-1000');
                    filterProperty();
                  }}>
                  <Text style={styles.filterBtnTxt}>500-1000 sqft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => {
                    setFilter('1000-2000');
                    filterProperty();
                  }}>
                  <Text style={styles.filterBtnTxt}>1000-2000 sqft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => {
                    setFilter('2000-3000');
                    filterProperty();
                  }}>
                  <Text style={styles.filterBtnTxt}>2000-3000 sqft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => {
                    setFilter('3000-5000');
                    filterProperty();
                  }}>
                  <Text style={styles.filterBtnTxt}>3000-5000 sqft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => {
                    setFilter('5000-8000');
                    filterProperty();
                  }}>
                  <Text style={styles.filterBtnTxt}>5000-8000 sqft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => {
                    setFilter('8000-10000');
                    filterProperty();
                  }}>
                  <Text style={styles.filterBtnTxt}>8000-10,000 sqft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => {
                    setFilter('10000-15000');
                    filterProperty();
                  }}>
                  <Text style={styles.filterBtnTxt}>10,000-15,000 sqft</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            {/* Filter property Through Size */}

            {data ? (
              <>
                <View style={{marginTop: 30}}>
                  <Text style={styles.filterHeading}>
                    Properties added by you
                  </Text>
                  <FlatList
                    data={data}
                    keyExtractor={({property_id}, index) => property_id}
                    renderItem={({item}) => (
                      <>
                        <View style={styles.flatListContainer}>
                          {item.front_image !== '' ? (
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 150,
                                height: 150,
                                marginRight: 5,
                              }}>
                              <Image
                                source={{uri: item.front_image}}
                                style={{
                                  width: 150,
                                  height: 150,
                                  borderRadius: 5,
                                  resizeMode: 'contain',
                                }}
                              />
                            </View>
                          ) : null}

                          <View style={{flex: 2, marginLeft: 20}}>
                            <TouchableOpacity
                              onPress={() => {
                                setPropertyId(item.property_id);
                                deleteProperty();
                              }}
                              style={styles.deleteBtn}>
                              <Icons
                                name="trash-outline"
                                color="red"
                                size={25}
                              />
                              {item.broker_name !== '' ? (
                                <>
                                  <Tooltip
                                    isVisible={showTip}
                                    content={
                                      <View>
                                        <Text> Broker's Property </Text>
                                      </View>
                                    }
                                    onClose={() => setTip(false)}
                                    placement="center">
                                    <TouchableOpacity
                                      onPress={() => setTip(true)}>
                                      <Icons
                                        name="ribbon-outline"
                                        color="#3a679e"
                                        size={25}
                                        style={{marginLeft: 10}}
                                      />
                                    </TouchableOpacity>
                                  </Tooltip>
                                </>
                              ) : null}
                            </TouchableOpacity>
                            <Text style={styles.ownerName}>
                              {item.owner_name}
                            </Text>
                            <Text style={styles.address}>
                              {item.address}, {item.city}, {item.state} .
                              {item.pincode}{' '}
                            </Text>

                            <List.Accordion
                              title="Property Details"
                              left={() => <Icons name="folder-open-outline" />}
                              right={() => (
                                <Icons name="chevron-down-outline" />
                              )}>
                              <List.Item
                                title="Front"
                                description={item.frontage}
                              />
                              <List.Item
                                title="Carpet Area"
                                description={item.frontage + ' ft'}
                              />

                              <List.Item
                                title="Carpet Area"
                                description={item.carpet_area + ' sqft'}
                              />

                              <List.Item
                                title="Floor"
                                description={item.floor}
                              />

                              <List.Item
                                title="Rent per sqft"
                                description={'₹' + item.price}
                              />

                              <List.Item
                                title="Monthly Rent"
                                description={
                                  '₹' + item.price * item.carpet_area
                                }
                              />

                              <List.Item
                                title="Upload Date"
                                description={item.created_date}
                              />
                              {item.broker_name !== '' ? (
                                <List.Item
                                  title="Broker Name"
                                  description={item.broker_name}
                                />
                              ) : null}
                            </List.Accordion>

                            <TouchableOpacity
                              onPress={() => {
                                setFrontImage(item.front_image);
                                setRightImage(item.right_image);
                                setLeftImage(item.left_image);
                                setOppositeImage(item.opposite_image);
                                setModalVisible(true);
                              }}
                              style={styles.imgBtn}>
                              <Text style={styles.imgBtnTxt}>
                                View all images
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    )}
                  />
                </View>
              </>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  No property found. Pull down to refresh!
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      )}

      {/* Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <ScrollView
            horizontal={true}
            minimumZoomScale={1}
            maximumZoomScale={5}
            style={styles.modalScroller}>
            <View style={styles.modalImgContainer}>
              {frontImage == '' ? (
                <View style={styles.loader}>
                  <ActivityIndicator
                    size="large"
                    animating={true}
                    color="#237282"
                  />
                </View>
              ) : (
                <Image
                  source={{uri: frontImage}}
                  style={{
                    width: window.width,
                    height: window.height,
                    resizeMode: 'contain',
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                />
              )}

              {leftImage == '' ? (
                <View style={styles.loader}>
                  <ActivityIndicator
                    size="large"
                    animating={true}
                    color="#237282"
                  />
                </View>
              ) : (
                <Image
                  source={{uri: leftImage}}
                  style={{
                    width: window.width,
                    height: window.height,
                    resizeMode: 'contain',
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                />
              )}

              {rightImage == '' ? (
                <View style={styles.loader}>
                  <ActivityIndicator
                    size="large"
                    animating={true}
                    color="#237282"
                  />
                </View>
              ) : (
                <Image
                  source={{uri: rightImage}}
                  style={{
                    width: window.width,
                    height: window.height,
                    resizeMode: 'contain',
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                />
              )}

              {oppositeImage == '' ? (
                <View style={styles.loader}>
                  <ActivityIndicator
                    size="large"
                    animating={true}
                    color="#237282"
                  />
                </View>
              ) : (
                <Image
                  source={{uri: oppositeImage}}
                  style={{
                    width: window.width,
                    height: window.height,
                    resizeMode: 'contain',
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Image Modal */}
    </>
  );
};

const Stack = createStackNavigator();

const HomeScreenHolder = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="HomeScreen"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          title: 'Add New Property',
        }}
        name="AddProperty"
        component={AddProperty}
      />
      <Stack.Screen
        options={{
          title: 'View Property Status',
        }}
        name="HistoryScreen"
        component={HistoryScreen}
      />
      <Stack.Screen
        options={{
          title: 'Download Documents',
        }}
        name="Download"
        component={Download}
      />
    </Stack.Navigator>
  );
};

export default HomeScreenHolder;

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  userProfileSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7',
    paddingBottom: 10,
  },
  greeting: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
  userName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 24,
    color: '#237282',
    flex: 1,
  },
  addBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#c7c7c7c7',
    marginRight: 5,
    backgroundColor: '#6c3a9e',
    flexDirection: 'row',
  },
  flatListContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 5,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#c7c7c7c7',
    flexDirection: 'row',
  },
  ownerName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
    flex: 1,
    marginTop: 10,
    marginBottom: 5,
  },
  address: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginBottom: 20,
  },
  state: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  pincode: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },

  label: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginTop: 10,
  },
  response: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  imgBtn: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 5,
    paddingVertical: 10,
    borderColor: 'green',
  },
  imgBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: 'green',
  },
  modalImg: {
    width: 350,
    height: 350,
    marginRight: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    paddingHorizontal: 10,
  },
  modalScroller: {
    width: '100%',
    paddingHorizontal: 10,
  },
  modalImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  deleteBtn: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 5,
    flexDirection: 'row',
  },
  addBtnSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#c7c7c7c7',
    marginRight: 5,
    backgroundColor: '#237282',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollDiv: {
    marginTop: 20,
  },
  filterBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: '#a970cf',
    borderRadius: 5,
  },
  filterBtnTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#fff',
  },
  filterHeading: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginBottom: 15,
    color: '#777',
  },
  addBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#fff',
    marginLeft: 3,
  },
});
