#include <SoftwareSerial.h>

const u32 console_baud{9600};

// hc05 rx pin is the tx pin for the controller,
// same for the rx pin.
const u32 hc05_rx{2};
const u32 hc05_tx{3};
const u32 hc05_state{4};
const u32 hc05_baud{9600};

SoftwareSerial hc05(hc05_rx, hc05_tx);

// is the hc05 connected to a device
bool hc05_connected{false};

void setup() {
    // setup communication with serial monitor
    Serial.begin(console_baud);

    // setup hc-05 bluetooth module
    // State port is HIGH when a device is connected, low otherwise.
    // 9600 is the default baud rate the module uses.
    pinMode(hc05_state, INPUT);
    hc05.begin(hc05_baud);

    Serial.println("HC-05 ready to connect (default password: 1234)");
}


void loop() {
    // check if hc-05 is connected
    if (!hc05_connected && digitalRead(hc05_state) == HIGH) {
        Serial.println("HC-05 module connected");
        hc05_connected = true;
    } else if (hc05_connected && digitalRead(hc05_state) == LOW) {
        Serial.println("HC-05 module disconnected");
        hc05_connected = false;
    }

    if (!hc05_connected) {
        // do nothing if not connected
        return;
    }
}
