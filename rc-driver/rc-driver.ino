#include <SoftwareSerial.h>

const u32 console_baud = 9600;

// hc05 rx pin is the tx pin for the controller,
// same for the rx pin.
const u32 hc05_rx = 2;
const u32 hc05_tx = 3;
const u32 hc05_state = 4;
const u32 hc05_baud = 9600;

// car motor pins
const u32 forward_motor = 8;
const u32 backward_motor = 9;
const u32 left_motor = 12;
const u32 right_motor = 11;

SoftwareSerial hc05(hc05_rx, hc05_tx);

// is the hc05 connected to a device
bool hc05_connected = false;

// Commands used to control the car
enum class RcCommand {
  Forward,
  Backward,
  Left,
  Right,
  RelHor,
  RelVer,
  None,
};

const char forward = 'f';
const char back = 'b';
const char left = 'l';
const char right = 'r';
const char release_vertical = 'v';
const char release_horizontal = 'h';

RcCommand char_to_rc_commands(char command) {
  switch (command) {
    case forward:
      return RcCommand::Forward;
    case back:
      return RcCommand::Backward;
    case left:
      return RcCommand::Left;
    case right:
      return RcCommand::Right;
    case release_vertical:
      return RcCommand::RelVer;
    case release_horizontal:
      return RcCommand::RelHor;
    default:
      Serial.println(String() + "unknown command received: `" + command + "`");
      return RcCommand::None;
  }
}

struct Heading {
  enum class Direction {
    Forward,
    Backward,
    Left,
    Right,
    None,
  };

  Direction horizontal{ Direction::None };
  Direction vertical{ Direction::None };

  void apply_command(RcCommand command) {
    switch (command) {
      case RcCommand::Left:
        this->horizontal = Direction::Left;
        break;
      case RcCommand::Right:
        this->horizontal = Direction::Right;
        break;
      case RcCommand::Forward:
        this->vertical = Direction::Forward;
        break;
      case RcCommand::Backward:
        this->vertical = Direction::Backward;
        break;
      case RcCommand::RelHor:
        this->horizontal = Direction::None;
        break;
      case RcCommand::RelVer:
        this->vertical = Direction::None;
        break;
      default:
        // do nothing for `RcCommand::None`
        return;
    }
  }

  void debug() const {
    const char* direction[]{
      "forward",
      "backward",
      "left",
      "right",
      "none"
    };

    Serial.println(String() + direction[static_cast<u32>(this->vertical)] + " | " + direction[static_cast<u32>(this->horizontal)]);
  }

  void output_direction() const {
    switch (this->vertical) {
      case Direction::Forward:
        digitalWrite(backward_motor, LOW);
        digitalWrite(forward_motor, HIGH);
        break;
      case Direction::Backward:
        digitalWrite(forward_motor, LOW);
        digitalWrite(backward_motor, HIGH);
        break;
      case Direction::None:
        digitalWrite(forward_motor, LOW);
        digitalWrite(backward_motor, LOW);
        break;
      default:
        Serial.println("Illegal vertical direction received");
        break;
    }

    switch (this->horizontal) {
      case Direction::Left:
        digitalWrite(right_motor, LOW);
        digitalWrite(left_motor, HIGH);
        break;
      case Direction::Right:
        digitalWrite(left_motor, LOW);
        digitalWrite(right_motor, HIGH);
        break;
      case Direction::None:
        digitalWrite(left_motor, LOW);
        digitalWrite(right_motor, LOW);
        break;
      default:
        Serial.println("Illegal horizontal direction received");
        break;
    }
  }
};

Heading heading{};

void setup() {
  // setup communication with serial monitor
  Serial.begin(console_baud);

  // setup hc-05 bluetooth module
  // State port is HIGH when a device is connected, low otherwise.
  // 9600 is the default baud rate the module uses.
  pinMode(hc05_state, INPUT);
  pinMode(hc05_rx, INPUT);
  pinMode(hc05_tx, OUTPUT);
  hc05.begin(hc05_baud);

  // setup motor pins
  pinMode(forward_motor, OUTPUT);
  pinMode(backward_motor, OUTPUT);
  pinMode(left_motor, OUTPUT);
  pinMode(left_motor, OUTPUT);

  Serial.println("HC-05 ready to connect (default password: 1234)");
}

void loop() {
  // check if hc-05 is connected
  if (!hc05_connected && digitalRead(hc05_state) == HIGH) {
    Serial.println("HC-05 module connected to device");
    hc05_connected = true;
  } else if (hc05_connected && digitalRead(hc05_state) == LOW) {
    Serial.println("HC-05 module disconnected from device");
    hc05_connected = false;
  }

  if (!hc05_connected || !hc05.available()) {
    // do nothing if not connected
    return;
  }


  while (hc05.available()) {
    const char in_char = hc05.read();
    const RcCommand command = char_to_rc_commands(in_char);

    // print received command
    Serial.println(String() + "Command received: `" + in_char + "`.");

    heading.apply_command(command);
    heading.output_direction();
  }
}
