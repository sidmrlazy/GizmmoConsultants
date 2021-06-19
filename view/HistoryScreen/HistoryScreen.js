import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Image,
  FlatList,
} from 'react-native';

// ========== Libraries ========== //
import {createStackNavigator} from '@react-navigation/stack';
import Icons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Animatable from 'react-native-animatable';

// ========== Images ========== //
import demo1 from '../../assets/images/demo/demo-one.jpg';
import demo2 from '../../assets/images/demo/demo-two.jpg';
import demo3 from '../../assets/images/demo/demo-three.jpg';
import demo4 from '../../assets/images/demo/demo-four.jpg';

const HistoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  //  Status Modal Property Status DropDown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Negotiated', value: 'Negotiated'},
    {
      label: 'Agreement To Lease Processed',
      value: 'Agreement To Lease Processed',
    },
    {
      label: 'SDR Done',
      value: 'SDR Done',
    },
    {
      label: 'Site Approved',
      value: 'Site Approved',
    },
    {
      label: 'Documentation Pending',
      value: 'Documentation Pending',
    },
    {
      label: 'Documentation Complete',
      value: 'Documentation Complete',
    },
    {
      label: 'LOI Issued',
      value: 'LOI Issued',
    },
    {
      label: 'Brokerage Collected',
      value: 'Brokerage Collected',
    },
  ]);

  const api =
    'https://gizmmoalchemy.com/api/consultancy/consultancy.php?flag=view_property_new';

  // ======= Fetch Main Category ========== //
  const getDetails = async () => {
    return fetch(api)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        // setData(json);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDetails();
  }, []);
  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <TextInput
              placeholder="Search Properties by Owner Name, Owner Contact, Broker Name, Broker Contact or Pincode"
              style={styles.search}
              autoCapitalize="words"
              placeholderTextColor="#777"
            />
          </View>

          <View style={styles.responseSection}>
            <View style={styles.card}>
              <View style={styles.headingRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.ownerName}>Owner Name</Text>
                  <Text style={styles.ownerContact}>9876543210</Text>
                  <Text style={styles.city}>Lucknow</Text>
                  <Text style={styles.pincode}>226024</Text>

                  <Text
                    style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 16,
                      color: 'green',
                      marginTop: 15,
                    }}>
                    Status
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-SemiBold',
                      fontSize: 20,
                      color: '#000',
                    }}>
                    Negotiated
                  </Text>
                </View>
                <Icons name="call" size={20} color="green" />
              </View>

              <Text style={styles.cardSection}>Property Details</Text>

              <View style={styles.cardInnerRow}>
                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Address</Text>
                  <Text style={styles.response}>
                    A-23, Sector J , Aliganj Lucknow
                  </Text>
                </View>

                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Floor Offered</Text>
                  <Text style={styles.response}>Ground Floor</Text>
                </View>
              </View>

              <View style={styles.cardInnerRow}>
                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Carpet Area</Text>
                  <Text style={styles.response}>3000 Sqft</Text>
                </View>

                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Frontage</Text>
                  <Text style={styles.response}>30 Sqft</Text>
                </View>
              </View>

              <View style={styles.cardInnerRow}>
                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Asking Price</Text>
                  <Text style={styles.response}>Rs 50</Text>
                </View>

                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Monthly Asking Price</Text>
                  <Text style={styles.response}>Rs 150000</Text>
                </View>
              </View>

              <View style={styles.cardInnerRow}>
                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Latitude</Text>
                  <Text style={styles.response}>1.54748548</Text>
                </View>

                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Longitude</Text>
                  <Text style={styles.response}>Rs 5.215646</Text>
                </View>
              </View>

              <View style={styles.cardInnerRow}>
                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Broker Details</Text>
                  <Text style={styles.response}>Tarun Srivastava</Text>
                </View>

                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Broker Contact</Text>
                  <Text style={styles.response}>9837010427</Text>
                </View>
              </View>

              <View style={styles.cardInnerRow}>
                <View style={styles.cardDiv}>
                  <Text style={styles.label}>Added on </Text>
                  <Text style={styles.response}>Tarun Srivastava</Text>
                </View>
              </View>

              <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.viewImgBtn}>
                <Text style={styles.viewImgBtnTxt}>View Property Images</Text>
              </Pressable>

              <Pressable
                onPress={() => setStatusModalVisible(true)}
                style={styles.updateStatusBtn}>
                <Text style={styles.UpdateStatusBtnTxt}>Update Status</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Image Slider Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.closeBtn}>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Icons name="close-circle-outline" size={30} color="#fff" />
            </Pressable>
          </View>
          <ScrollView horizontal={true}>
            <View style={styles.imgContainer}>
              <Image source={demo1} style={styles.modalImg} />
            </View>

            <View style={styles.imgContainer}>
              <Image source={demo2} style={styles.modalImg} />
            </View>

            <View style={styles.imgContainer}>
              <Image source={demo3} style={styles.modalImg} />
            </View>

            <View style={styles.imgContainer}>
              <Image source={demo4} style={styles.modalImg} />
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Image Slider Modal */}

      {/* Update Status Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => {
          setStatusModalVisible(!statusModalVisible);
        }}>
        <View style={styles.statusModalContainer}>
          <Animatable.View animation="slideInUp" style={styles.statusModalCard}>
            <View style={styles.statusModalHeadingRow}>
              <Text style={styles.statusModalHeading}>
                Update Status of property
              </Text>
              <Pressable
                onPress={() => setStatusModalVisible(!statusModalVisible)}>
                <Icons name="close-circle-outline" size={30} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.statusModalBottomHeading}>
              <Text style={styles.statusModalHeadingTxt}>Status</Text>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                dropDownDirection="AUTO"
                style={styles.dropDownContainer}
                dropDownContainerStyle={styles.dropDownList}
                // placeholderStyle={{
                //   fontFamily: 'OpenSans-Regular',
                //   fontSize: 16,
                // }}
              />
            </View>

            <View
              style={{
                width: '100%',
                marginTop: 20,
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 20,
                borderRadius: 5,
                backgroundColor: '#03045E',
              }}>
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  fontSize: 18,
                  color: '#fff',
                }}>
                UPDATE STATUS
              </Text>
            </View>
          </Animatable.View>
        </View>
      </Modal>
      {/* Update Status Modal */}
    </>
  );
};

const Stack = createStackNavigator();

const HistoryScreenHolder = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
    </Stack.Navigator>
  );
};

export default HistoryScreenHolder;

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  headerSection: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  search: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  responseSection: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  card: {
    width: '100%',
    paddingHorizontal: 10,
    borderColor: '#c7c7c7c7',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    borderBottomColor: '#c7c7c7c7',
    marginBottom: 20,
  },
  ownerName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#0077B6',
  },
  ownerContact: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  city: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
  },
  cardSection: {
    fontFamily: 'OpenSans-Regular',
    color: '#777777',
    marginBottom: 10,
  },
  cardInnerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardDiv: {
    flex: 1,
  },
  label: {
    fontFamily: 'OpenSans-Regular',
  },
  response: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
  },
  pincode: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    marginTop: 10,
    color: '#777',
  },
  viewImgBtn: {
    marginBottom: 10,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#0077B6',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  viewImgBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#0077B6',
  },
  updateStatusBtn: {
    marginBottom: 10,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#00B4D8',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  UpdateStatusBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#00B4D8',
  },
  modalContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    paddingTop: 30,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 20,
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  modalImg: {
    width: 400,
    height: 300,
    borderRadius: 5,
  },
  statusModalContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statusModalCard: {
    width: '100%',
    backgroundColor: '#0077B6',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    paddingBottom: 40,
    height: 500,
  },
  statusModalHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  statusModalHeading: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    flex: 1,
    color: '#fff',
  },
  statusModalBottomHeading: {
    marginTop: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  statusModalHeadingTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  dropDownContainer: {
    borderWidth: 0.5,
    borderColor: '#c7c7c7c7',
  },
  dropDownList: {
    borderWidth: 0.5,
    borderColor: '#c7c7c7c7',
  },
});
