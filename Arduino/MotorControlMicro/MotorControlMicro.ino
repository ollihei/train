/**
 * Motor controller system for Lego train and Lego train track switch.
 */

#include <SoftwareSerial.h>  // Bluetooth library

const int DIRECTION_FORWARD = 2;
const int DIRECTION_REVERSE = 1;

int txPin = 15;   // For Bluetooth component, TX pin
int rxPin = 8;   // For Bluetooth component, RX pin

SoftwareSerial BT(rxPin, txPin); 

const int motorPin1 = 9;      // Motor pin 1
const int motorPin2 = 10;      // Motor pin 2
const int motorSpeedPin = 6;  // Motor speed pin
int motorSpeed = 0;           // Motor speed (0-255)
int motorDirection = DIRECTION_REVERSE;   // Forward 1, Backward 0
int motorMoveTTL = 0;         // The time how long the motor is on (if it's wanted that the motor is on only for a moment)

void setup () {
  pinMode(motorPin1, OUTPUT);  
  pinMode(motorPin2, OUTPUT);  
  pinMode(motorSpeedPin, OUTPUT);  

  digitalWrite(motorSpeedPin, LOW);  // Set motor off

  BT.begin(9600);
  BT.write("Motor controller started up\n");
}

void loop () {

  if (motorMoveTTL > 0) {
    motorMoveTTL--;
    if (motorMoveTTL == 0){
      motorSpeed = 0;
      updateMotorControlValues();
    }
  }

  String readString;
  if (BT.available()) {
    delay(300);
    while (BT.available()) {
      char a = BT.read();
      readString += a;
    }
  }

  int kohta = readString.indexOf(' ');
  int pituus = readString.length();
  String ret = "Kohta " + kohta;
  ret = ret + " / " + pituus;
  String copyString = readString.substring(0,readString.indexOf(' '));
  if (copyString != "") {
    BT.println("Command: " + copyString);
  }
  if (copyString=="set") {
    set(readString.substring(readString.indexOf(' ') + 1, readString.length()));
  }
  if (copyString=="status") {
    String returnValue = "VALUES|";
    returnValue = returnValue + "d:" + motorDirection + "|" + "s:" + motorSpeed + "|";
    BT.println(returnValue);
    //Serial.println(returnValue);
  }
  if (copyString=="switch") {
    moveSwitch(readString.substring(readString.indexOf(' ') + 1, readString.length()));
  }
  delay(230);
}

/**
 * Sets the speed and direction for the motor based on the variables.
 */
void updateMotorControlValues() {
   if (motorDirection == DIRECTION_FORWARD) {
    digitalWrite(motorPin1, HIGH);
    digitalWrite(motorPin2, LOW);
  } else {
    digitalWrite(motorPin1, LOW);
    digitalWrite(motorPin2, HIGH);
  } 
   
  analogWrite(motorSpeedPin, motorSpeed);

}

/**
 * Sets value for a variable.
 */
void set(String command) {

  String returnText = "No action";
  if (command.indexOf('=')==-1) {
    returnText="No value given for parameter (";
    returnText=returnText+command+").",
    //Serial.println(returnText);
    BT.println(returnText);
   // Serial.println(returnText);
    return;
  }

  String commandLeft = "";
  String commandRight = "";
  int value;

  commandLeft = command.substring(0,command.indexOf('='));
  commandRight = command.substring(command.indexOf('=')+1, command.length());
  value = commandRight.toInt();
  if (commandLeft=="s") {
    motorSpeed=value;
    returnText = "Speed set to ";
    returnText = returnText + value;
  }
  if (commandLeft=="d") {
    motorDirection=value;
    returnText = "Direction set to ";
    returnText = returnText + value;
  }
  updateMotorControlValues();
  BT.println(returnText);
}

/**
 * Changes the state of the switch by moving the motor.
 * @param command 1 or 2
 */
void moveSwitch(String command) {
  String returnText = "No action: " + command +".";
  if (command.toInt()==1) {
    motorSpeed=value;
    returnText = "Switch set to straight mode ";
    returnText = returnText + value;
    motorSpeed=200;
    motorDirection=1;
    motorMoveTTL=1;
    updateMotorControlValues();
  }
  if (command.toInt()==2) {
    returnText = "Switch set to turning mode ";
    returnText = returnText + value;
    motorSpeed=200;
    motorDirection=2;
    motorMoveTTL=1;
    updateMotorControlValues();
  }
  BT.println(returnText);
}

 
