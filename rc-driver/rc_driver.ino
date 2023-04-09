#include <SoftwareSerial.h>
// #include <ArduinoSTL.h>

const u32 console_baud = 9600;

// hc05 rx pin is the tx pin for the controller,
// same for the rx pin.
const u32 hc05_rx = 2;
const u32 hc05_tx = 3;
const u32 hc05_state = 4;
const u32 hc05_baud = 9600;

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

  Direction horizontal;
  Direction vertical;

  void apply_command(RcCommand command) {
    switch (command) {
      case RcCommand::Left:
        horizontal = Direction::Left;
        break;
      case RcCommand::Right:
        horizontal = Direction::Right;
        break;
      case RcCommand::Forward:
        vertical = Direction::Forward;
        break;
      case RcCommand::Backward:
        vertical = Direction::Backward;
        break;
      case RcCommand::RelHor:
        horizontal = Direction::None;
        break;
      case RcCommand::RelVer:
        vertical = Direction::None;
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

    Serial.println(String() + direction[static_cast<u32>(vertical)] + "|" + direction[static_cast<u32>(horizontal)]);
  }
};

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
    const RcCommand command = char_to_rc_commands(hc05.read());
  }
}
