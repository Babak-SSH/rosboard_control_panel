"use strict";

class JoystickController extends Viewer {
  /**
    * Gets called when Viewer is first initialized.
    * @override
  **/
  onCreate() {
    this.viewer = $('<div></div>')
      .css({'font-size': '11pt'
    , "filter": "invert(100%) saturate(50%)"})
      .appendTo(this.card.content);

    this.joyId = "joy-" + Math.floor(Math.random()*10000);
    this.joy = $('<div id="' + this.joyId + '"></div>')
      .css({
        "height": "250px",
        "width": "250px",
      })
      .appendTo(this.viewer);

    var semi_options = {
        zone: document.getElementById(this.joyId),
        mode: 'semi',
        color: 'blue', 
        size: 50,
        catchDistance: 100,
        dynamicPage: true,    
    };
    var static_options = {
        zone: document.getElementById(this.joyId),
        mode: 'static',
        color: 'black', 
        size: 50,
        threshold: 100,
        // restJoystick: true,
        position: {left: '125px', top: '125px'},
        dynamicPage: true, 
    };
    var manager = nipplejs.create(static_options);
    manager.on('start', function(evt, data) {
      let joystickX = 0.0;
      let joystickY = 0.0;
      console.log("start")
      currentTransport.update_joy({joystickX, joystickY});
    }).on('end', function(evt, data) {
      let joystickX = 0.0;
      let joystickY = 0.0;
      console.log("end")
      currentTransport.update_joy({joystickX, joystickY});
    }).on('move', function(evt, data) {
      let radian = data['angle']['radian'];
      let distance = data['distance'];
      let joystickX = Math.max(Math.min(Math.cos(radian)/75*distance, 1), -1);
      let joystickY = -1*Math.max(Math.min(Math.sin(radian)/75*distance , 1), -1);
      console.log(data)
      currentTransport.update_joy({joystickX, joystickY});
    });
  }

  onData(msg) {
    this.card.title.text(msg._topic_name);
  }
}

JoystickController.friendlyName = "JoystickController";

JoystickController.supportedTypes = [
    // "geometry_msgs/msg/Twist",
    "sensor_msgs/msg/Joy"
];

JoystickController.maxUpdateRate = 10.0;

Viewer.registerViewer(JoystickController);
