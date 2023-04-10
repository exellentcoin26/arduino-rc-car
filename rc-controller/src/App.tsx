import {useState, useEffect} from 'react';
import {StatusBar, PermissionsAndroid} from 'react-native';
import RNBluetoothClassic, {
    BluetoothDevice,
} from 'react-native-bluetooth-classic';

import NotConnected from './screens/NotConnected';
import Controller from './screens/Controller';
import {
    DeviceAddress,
    DeviceId,
    DeviceSelector,
} from './screens/DeviceSelector';

const requestBluetoothPermission = async (): Promise<boolean> => {
    const granted =
        (await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: 'Bluetooth permission required',
                message:
                    'In order to connect to bluetooth device, permission is required.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'Ok',
            },
        )) === PermissionsAndroid.RESULTS.GRANTED;

    if (granted) {
        console.info('bluetooth permission granted');
    } else {
        console.error('bluetooth permission not granted');
    }

    return granted;
};

const App = () => {
    const [isChoosingDevice, setIsChoosingDevice] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>(
        [],
    );

    useEffect(() => {
        (async () => {
            const bluetoothGranted = await requestBluetoothPermission();

            if (!bluetoothGranted) {
                return;
            }

            const devices = await RNBluetoothClassic.getBondedDevices();
            console.info('Amount of devices paired: ', devices.length);

            for (const [index, device] of devices.entries()) {
                if (index === 0) {
                    console.info('====================================');
                    console.info('Device list:');
                }
                console.info(device.name);
                if (index === devices.length - 1) {
                    console.info('====================================');
                }
            }

            setAvailableDevices(devices);
            setIsChoosingDevice(true);
        })();
    }, []);

    const setSelectedDevice = async (device: DeviceAddress) => {
        console.info('Trying to connect to device with address: ', device);

        try {
            await RNBluetoothClassic.connectToDevice(device);
        } catch (e) {
            console.error(e);
        }
    };

    const renderScreen = (isConnected: boolean, isChoosingDevice: boolean) => {
        if (!isConnected && isChoosingDevice) {
            return (
                <DeviceSelector
                    devices={availableDevices}
                    setSelectedDevice={setSelectedDevice}
                />
            );
        } else if (!isConnected && !isChoosingDevice) {
            return <NotConnected />;
        } else if (isConnected) {
            if (isChoosingDevice) {
                throw Error(
                    'State connected and choosing device should be unreachable',
                );
            }
            return <Controller />;
        } else {
            throw Error('Connection state case not handled');
        }
    };

    return (
        <>
            <StatusBar barStyle="dark-content" />
            {renderScreen(isConnected, isChoosingDevice)}
        </>
    );
};

export default App;
