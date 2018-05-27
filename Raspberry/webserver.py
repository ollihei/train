# -*- coding: utf-8 -*-
# Käynnistä bluetooth raspberrystä: sudo rfcomm connect hci0 98:D3:31:30:6D:3F

import serial
from time import sleep
from flask import Flask
app = Flask(__name__)
# ser = serial.Serial('/dev/ttyACM0', 9600)
ser = serial.Serial('/dev/rfcomm0', 9600)
# print ser.readline()

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/motor/<int:motor_id>/updatespeed/<int:speed>')
def updatespeed(motor_id, speed):
    ser.write(b'set s=%d' % speed)
    ser.flush()
    response = ser.readline()
    return 'Motor %d: Request speed of %d. Response from motor controller: %s' % (motor_id, speed, response)

@app.route('/motor/<int:motor_id>/updatedirection/<int:direction>')
def updatedirection(motor_id, direction):
    ser.write(b'set d=%d' % direction)
    ser.flush()
    response = ser.readline()
    return 'Motor %d: Request direction of %d. Response from motor controller: %s' % (motor_id, direction, response)

@app.route('/motor/<int:motor_id>/status')
def status(motor_id):
    ser.write(b'status')
    ser.flush()
    response = ser.readline()
    return 'Status of motor %d: %s' % (motor_id, response)

	if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)