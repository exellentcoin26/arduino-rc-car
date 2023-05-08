import {useState, useEffect} from 'react';
import {StatusBar, PermissionsAndroid} from 'react-native';

import RNBluetoothClassic, {
    BluetoothDevice,
} from 'react-native-bluetooth-classic';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

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
    const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>(
        [],
    );
    const [connectedDevice, setConnectedDevice] =
        useState<BluetoothDevice | null>(null);

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

    const setSelectedDevice = async (deviceAddress: DeviceAddress) => {
        console.info(
            'Trying to connect to device with address: ',
            deviceAddress,
        );

        let device = await (async (): Promise<BluetoothDevice | null> => {
            try {
                return await RNBluetoothClassic.connectToDevice(deviceAddress);
            } catch (e) {
                console.error(e);
                return null;
            }
        })();

        if (!device) return;

        console.info('Connected!');
        setIsChoosingDevice(false);
        setConnectedDevice(device);
    };

    const handleDisconnect = () => {
        setConnectedDevice(null);
        setIsChoosingDevice(true);
    };

    const renderScreen = (
        connectedDevice: BluetoothDevice | null,
        isChoosingDevice: boolean,
    ) => {
        if (!connectedDevice && isChoosingDevice) {
            return (
                <DeviceSelector
                    devices={availableDevices}
                    setSelectedDevice={setSelectedDevice}
                />
            );
        } else if (!connectedDevice && !isChoosingDevice) {
            return <NotConnected />;
        } else if (connectedDevice) {
            if (isChoosingDevice) {
                console.debug(connectedDevice);

                throw Error(
                    'State connected and choosing device should be unreachable',
                );
            }
            return (
                <Controller
                    device={connectedDevice}
                    handleDisconnect={handleDisconnect}
                />
            );
        } else {
            throw Error('Connection state case not handled');
        }
    };

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <GestureHandlerRootView>
                {renderScreen(connectedDevice, isChoosingDevice)}
            </GestureHandlerRootView>
        </>
    );
};

export default App;
