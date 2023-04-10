import React from 'react';
import {StatusBar, PermissionsAndroid} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

import NotConnected from './screens/NotConnected';
import Controller from './screens/Controller';

const App = () => {
    (async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: 'Bluetooth permission required',
                message:
                    'In order to connect to bluetooth device, permission is required.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'Ok',
            },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.error('bluetooth permission not granted');
        } else {
            console.info('bluetooth permission granted');
        }

        for (const device of await RNBluetoothClassic.getBondedDevices()) {
            console.log(device);
        }
    })();

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <NotConnected />
        </>
    );
};

export default App;
