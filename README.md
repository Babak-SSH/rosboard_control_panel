# Robot-Control-panel
a ROS node + web server to control your robot based on [rosboard](https://github.com/dheera/rosboard) project.

control-panel consists of 5 sections:

Status:
- status tab shows multiple ros topics as card (it is basically the base [rosboard](https://github.com/dheera/rosboard) project with small modifications)

Controller:
- main feature of this tab is a controller in form of joystick and a functionality to connect to gamepads. 
- ability to swap between two video streams which you can set their topics in config.js
- a simple status-bar showing things like connectivity, signal power, etc

Commands:
- a simple page consisting of multiple buttons with notion of having multiple patterns programed for robot being fired from this tab.

Help:
- a different approach for FAQ/Assistant section by using chat-gpt as virtual assistant. chat-gpt will repond to questions with regard to prompt about the robot which can be configured in config.js

Options:
- finally a good old options tab to configure or adjust behavior of robot and its software.

## Installation
for setup refer to rosboards [README](https://github.com/dheera/rosboard/blob/main/README.md)