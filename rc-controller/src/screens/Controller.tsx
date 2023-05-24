import {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import {BluetoothDevice} from 'react-native-bluetooth-classic';
import Orientation from 'react-native-orientation-locker';

import Joystick from '../components/Joystick';
import CarController from '../models/car';

const Controller = ({
    device,
    handleDisconnect,
}: {
    device: BluetoothDevice;
    handleDisconnect: () => void;
}) => {
    useEffect(() => {
        Orientation.lockToLandscape();
    }, []);

    const carController = new CarController(device, 0, 0, handleDisconnect);

    const handleHorizontalMove = (x: number) => {
        carController.setX(x);
    };
    const handleVerticalMove = (y: number) => {
        carController.setY(y);
    };

    return (
        <View style={style.controller}>
            <View style={style.directionContainer}>
                <Joystick
                    direction={'vertical'}
                    stickSize={100}
                    sliderSize={300}
                    handleMove={handleVerticalMove}
                />
            </View>
            <View style={style.directionContainer}>
                <Joystick
                    direction={'horizontal'}
                    stickSize={100}
                    sliderSize={300}
                    handleMove={handleHorizontalMove}
                />
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    controller: {
        height: '100%',
        flexDirection: 'row',
    },
    directionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Controller;
