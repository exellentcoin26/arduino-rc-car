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
    useEffect(() => {
        Orientation.lockToLandscape();
    }, []);

    const [frontBackJoystickPos, setFrontBackJoystickPos] = useState(0);
    const [leftRightJoystickPos, setLeftRightJoystickPos] = useState(0);

    const frontBackJoystickResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_evt, gestureState) => {
            if (frontBackJoystickPos !== gestureState.dy)
                setFrontBackJoystickPos(frontBackJoystickPos + gestureState.dy);
        },
        onPanResponderRelease: () => {
            setFrontBackJoystickPos(0);
        },
    });

    return (
        <>
            <View style={styles.container}>
                <View
                    {...frontBackJoystickResponder.panHandlers}
                    style={[
                        styles.joystick,
                        {
                            transform: [{translateY: frontBackJoystickPos}],
                        },
                    ]}></View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#555',
    },
    joystickContainer: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    joystick: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
    },
});

export default Controller;
