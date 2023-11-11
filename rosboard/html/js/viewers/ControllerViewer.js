"use strict";

class ControllerViewer extends Viewer {
  /**
    * Gets called when Viewer is first initialized.
    * @override
  **/
  onCreate() {
    this.viewerNode = $('<div></div>')
      .css({'font-size': '11pt',
            // 'height': '600px',
            // 'width': '800px'
        })
      .appendTo(this.card.content);
    
      this.leftJoyId = "joy-" + Math.floor(Math.random()*10000);
      this.leftJoy = $('<div id="' + this.leftJoyId + '"></div>')
        .css({
            "width": "20%",
            "margin-right": "80%"
        })
        .appendTo(this.viewerNode);
    
    this.img = $('<img></img>')
      .css({"width": "60%",
            "margin-left": "20%",
        })
      .appendTo(this.viewerNode);


      this.rightJoyId = "joy-" + Math.floor(Math.random()*10000);
      this.rightJoy = $('<div id="' + this.rightJoyId + '"></div>')
        .css({
            "width": "20%",
            "margin-left": "80%"
        })
        .appendTo(this.viewerNode);

      

        var semi_options = {
            zone: document.getElementById(this.rightJoyId),
            mode: 'semi',
            color: 'blue', 
            size: 50,
            catchDistance: 100,
            dynamicPage: true,    
        };
        var static_options_right = {
            zone: document.getElementById(this.rightJoyId),
            mode: 'static',
            color: 'red', 
            size: 80,
            threshold: 100,
            position: {left: '90%', top: '50%'},
            dynamicPage: true, 
        };
        var right_manager = nipplejs.create(static_options_right);
        right_manager.on('start', function(evt, data) {
          let joystickX = 0.0;
          let joystickY = 0.0;
          let joystickR = 0.0
          console.log("start")
          currentTransport.update_joy({joystickX, joystickY, joystickR});
        }).on('end', function(evt, data) {
          let joystickX = 0.0;
          let joystickY = 0.0;
          let joystickR = 0.0
          console.log("end")
          currentTransport.update_joy({joystickX, joystickY, joystickR});
        }).on('move', function(evt, data) {
          let radian = data['angle']['radian'];
          let distance = data['distance'];
          let joystickX = Math.max(Math.min(Math.cos(radian)/75*distance, 1), -1);
          let joystickY = -1*Math.max(Math.min(Math.sin(radian)/75*distance , 1), -1);
          let joystickR = 0.0
          console.log(data)
          currentTransport.update_joy({joystickX, joystickY, joystickR});
        });

        var static_options_left = {
            zone: document.getElementById(this.leftJoyId),
            mode: 'static',
            color: 'red', 
            size: 80,
            threshold: 100,
            position: {left: '10%', top: '50%'},
            dynamicPage: true, 
            lockX: true,
        };
        var left_manager = nipplejs.create(static_options_left);
        left_manager.on('start', function(evt, data) {
            let joystickX = 0.0;
          let joystickY = 0.0;
          let joystickR = 0.0;
          currentTransport.update_joy({joystickX, joystickY, joystickR});
        }).on('end', function(evt, data) {
            let joystickX = 0.0;
          let joystickY = 0.0;
            let joystickR = 0.0;
          currentTransport.update_joy({joystickX, joystickY, joystickR});
        }).on('move', function(evt, data) {
          let radian = data['angle']['radian'];
          let distance = data['distance'];
          let joystickX = 0.0;
          let joystickY = 0.0;
          let joystickR = Math.max(Math.min(Math.cos(radian)/75*distance, 1), -1);
          console.log(data)
          currentTransport.update_joy({joystickX, joystickY, joystickR});
        });


    let that = this;

    this.img[0].addEventListener('pointermove', function(e) {
      if(!that.lastMsg) return;
      if(!that.img[0].clientWidth || !that.img[0].clientHeight) return;

      let width = that.img[0].naturalWidth;
      let height = that.img[0].naturalHeight;
      if(that.lastMsg._data_shape) {
        height = that.lastMsg._data_shape[0];
        width = that.lastMsg._data_shape[1];
      }
      let x = e.offsetX / that.img[0].clientWidth * width;
      let y = e.offsetY / that.img[0].clientHeight * height;
      x = Math.min(Math.max(x, 0), width);
      y = Math.min(Math.max(y, 0), height);
      that.tip("(" + x.toFixed(0) + ", " + y.toFixed(0) + ")");
    });

    this.img[0].addEventListener('pointerdown', function(e) {
      if(!that.lastMsg) return;
      if(!that.img[0].clientWidth || !that.img[0].clientHeight) return;

      let width = that.img[0].naturalWidth;
      let height = that.img[0].naturalHeight;
      if(that.lastMsg._data_shape) {
        height = that.lastMsg._data_shape[0];
        width = that.lastMsg._data_shape[1];
      }
      let x = e.offsetX / that.img[0].clientWidth * width;
      let y = e.offsetY / that.img[0].clientHeight * height;
      console.log("clicked at " + x + ", " + y);
    });

    this.lastMsg = null;

    super.onCreate();
  }

  onData(msg) {
    this.card.title.text("Controller");

    if(msg.__comp) {
      this.decodeAndRenderCompressed(msg);
    } else {
      this.decodeAndRenderUncompressed(msg);
    }
  }
  
  decodeAndRenderCompressed(msg) {
    this.img[0].src = "data:image/jpeg;base64," + msg._data_jpeg;
    this.lastMsg = msg;
  }

  decodeAndRenderUncompressed(msg) {
    this.error("Support for uncompressed images not yet implemented.");
  }
}

ControllerViewer.friendlyName = "Image";

ControllerViewer.supportedTypes = [
    "sensor_msgs/msg/Image",
    "sensor_msgs/msg/CompressedImage",
    "nav_msgs/msg/OccupancyGrid",
    "sensor_msgs/msg/Joy"
];

ControllerViewer.maxUpdateRate = 24.0;

Viewer.registerViewer(ControllerViewer);