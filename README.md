# The Lego train project

## Idea

My goal is to build a simple lego train controlling system with Arduino. At this stage it's be possible to change the speed and running direction of a locomotive. Also controlling a switch is possible.

## Electronic

A simple diagram describing the electronics of the project. This diagram is for locomotive.

<img src="https://raw.githubusercontent.com/ollihei/train/master/Documentation/ElectronicsDiagram.png" width="50%">

## Running

In Raspberry webserver do the following:
* Connect he bluetooth: 'sudo rfcomm connect hci0 98:D3:31:30:6D:3F'
* Start the webserver: 'sudo python webserver.py'

## Author

olliolioi@gmail.com