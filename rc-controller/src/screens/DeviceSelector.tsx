import {Pressable, Text, View} from 'react-native';

import {BluetoothDevice} from 'react-native-bluetooth-classic';
import Controller from './Controller';

export type DeviceId = string;
export type DeviceAddress = string;

export const DeviceSelector = ({
    devices,
    setSelectedDevice,
}: {
    devices: BluetoothDevice[];
    setSelectedDevice: (device: DeviceAddress) => Promise<void>;
}) => {
    if (devices.length === 0) {
        return <Text>No devices to show.</Text>;
    }

    const handlePress = async (selectedDevice: BluetoothDevice) => {
        console.info('Selected device: ', selectedDevice.name);
        await setSelectedDevice(selectedDevice.address);
    };

    return (
        <>
            {devices.map(device => {
                return (
                    <Pressable
                        onPress={async () => {
                            await handlePress(device);
                        }}
                        key={device.id}>
                        <Text>{device.name}</Text>
                    </Pressable>
                );
            })}
        </>
    );
};
