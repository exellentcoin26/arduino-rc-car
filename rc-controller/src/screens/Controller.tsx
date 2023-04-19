import {Text} from 'react-native';
import {useState, useEffect} from 'react';
import {Text, View, PanResponder, StyleSheet} from 'react-native';

import RNBluetoothClassic, {
    BluetoothDevice,
} from 'react-native-bluetooth-classic';
import Orientation from 'react-native-orientation-locker';

const handleMove = async () => {};

const Controller = ({
    device,
    handleDisconnect,
}: {
    device: BluetoothDevice;
    handleDisconnect: () => void;
}) => {
    return <Text>Controller</Text>
};

export default Controller;
