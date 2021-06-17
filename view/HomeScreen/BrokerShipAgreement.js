import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Platform,
} from 'react-native';

// ========== Libraries ========== //
import RNFetchBlob from 'rn-fetch-blob';
import Icons from 'react-native-vector-icons/Ionicons';

const BrokerShipAgreement = () => {
  const FILE_PATH =
    'https://gizmmoalchemy.com/api/consultancy/documents/BrokersAgreement.docx';

  const checkPermissions = async () => {
    if (Platform.OS === 'ios') {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'This app requires permission to access your storage to download files',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage Permission Granted');
          downloadFile();
        } else {
          console.log('Storage Permission Denied');
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const downloadFile = () => {
    let date = new Date();
    let file_URL = FILE_PATH;
    let ext = getExtension(file_URL);
    ext = '.' + ext[0];

    const {config, fs} = RNFetchBlob;
    let FileDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          FileDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'File',
      },
    };
    config(options)
      .fetch('GET', file_URL)
      .then(res => {
        console.log('Status: ', JSON.stringify(res));
        alert('File Downloaded Successfully');
      });
  };

  const getExtension = fileName => {
    return /[.]/.exec(fileName) ? /[^.]+$/.exec(fileName) : undefined;
  };

  return (
    <>
      <Pressable style={styles.tab} onPress={checkPermissions}>
        <Icons name="receipt-outline" size={25} color="#0077B6" />
        <Text style={styles.tabTxt}>Brokership Agreement</Text>
      </Pressable>
    </>
  );
};

export default BrokerShipAgreement;

const styles = StyleSheet.create({
  tab: {
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#777',
    paddingHorizontal: 10,
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  tabTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    marginLeft: 20,
    flex: 1,
  },
});
