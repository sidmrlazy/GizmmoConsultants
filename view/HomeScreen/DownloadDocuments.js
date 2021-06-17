import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Platform,
} from 'react-native';

// ========== Components ========== //
import GizmmoPpt from './GizmmoPpt';
import BrokerShipAgreement from './BrokerShipAgreement';

const DownloadDocuments = () => {
  return (
    <>
      <View style={styles.container}>
        <GizmmoPpt />
        <BrokerShipAgreement />
      </View>
    </>
  );
};

export default DownloadDocuments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});
