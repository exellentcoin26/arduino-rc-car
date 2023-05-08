import {BluetoothDevice} from 'react-native-bluetooth-classic';

class CarController {
    x: number;
    y: number;
    car: BluetoothDevice;

    directionCommands = {
        forward: 'f',
        backward: 'b',
        releaseVertical: 'v',
        left: 'l',
        right: 'r',
        releaseHorizontal: 'h',
    };

    currentDirection: {
        horizontal: 'releaseHorizontal' | 'left' | 'right';
        vertical: 'releaseVertical' | 'forward' | 'backward';
    } = {
        horizontal: 'releaseHorizontal',
        vertical: 'releaseVertical',
    };

    constructor(device: BluetoothDevice, x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;

        this.car = device;
    }

    private handlePositionChange(newX: number, newY: number) {
        // console.debug(newX);

        // X
        if (newX !== this.x) {
            const newDirection =
                newX === 0 ? 'releaseHorizontal' : newX < 0 ? 'left' : 'right';

            if (newDirection !== this.currentDirection['horizontal'])
                this.move(newDirection);

            this.currentDirection['horizontal'] = newDirection;
            this.y = newY;
        }

        // console.debug(newY);

        // Y
        if (newY !== this.y) {
            const newDirection =
                newY === 0
                    ? 'releaseVertical'
                    : newY < 0
                    ? 'forward'
                    : 'backward';

            if (newDirection !== this.currentDirection['vertical'])
                this.move(newDirection);

            this.currentDirection['vertical'] = newDirection;
            this.y = newY;
        }
    }

    setX(x: number) {
        this.handlePositionChange(x, this.y);
    }

    setY(y: number) {
        this.handlePositionChange(this.x, y);
    }

    private move(
        direction:
            | 'forward'
            | 'backward'
            | 'releaseVertical'
            | 'left'
            | 'right'
            | 'releaseHorizontal',
    ) {
        const command = this.directionCommands[direction];
        console.debug(`Sending command: \`${command}\``);
        this.car
            .write(this.directionCommands[direction])
            .then(() =>
                console.debug(`Successfully sent command: \`${command}\``),
            );
    }
}

export default CarController;
