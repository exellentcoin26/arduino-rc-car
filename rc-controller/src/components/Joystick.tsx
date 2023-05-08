import {useState} from 'react';
import {View, PanResponder, StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const Joystick = ({
    direction,
    stickSize,
    sliderSize,
    handleMove,
}: {
    direction: 'horizontal' | 'vertical';
    stickSize: number;
    sliderSize: number;
    handleMove: (pos: number) => void;
}) => {
    const [pos, setPos] = useState(0);

    const styles = StyleSheet.create({
        container: {
            [direction == 'vertical' ? 'width' : 'height']: stickSize,
            [direction == 'vertical' ? 'height' : 'width']: sliderSize,
            alignItems: 'center',
            borderRadius: stickSize / 2,
            justifyContent: 'center',
            backgroundColor: '#555',
        },
        stick: {
            width: stickSize,
            height: stickSize,
            borderRadius: stickSize / 2,
            backgroundColor: 'black',
            transform: [
                {
                    translateY: direction === 'vertical' ? pos : 0,
                },
                {
                    translateX: direction !== 'vertical' ? pos : 0,
                },
            ],
        },
    });

    const stickResponder = Gesture.Pan()
        .onUpdate(e => {
            const unboundPos =
                direction === 'vertical' ? e.translationY : e.translationX;
            const boundPos =
                unboundPos < 0
                    ? Math.max(unboundPos, -sliderSize / 2 + stickSize / 2)
                    : Math.min(unboundPos, sliderSize / 2 - stickSize / 2);

            if (pos !== boundPos) {
                setPos(boundPos);
                handleMove(boundPos);
            }
        })
        .onFinalize(() => {
            setPos(0);
            handleMove(0);
        });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={stickResponder}>
                <View style={styles.stick} />
            </GestureDetector>
        </View>
    );
};

export default Joystick;
