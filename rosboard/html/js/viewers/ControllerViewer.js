"use strict";

class ControllerViewer extends Viewer {
  /**
    * Gets called when Viewer is first initialized.
    * @override
  **/
  onCreate() {
    this.viewerNode = $('<div id="controller-viewer"></div>')
      .css({'font-size': '11pt',
        })
      .appendTo(this.card.content);
    
    //   this.card.gamepad = $('<label class="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect" for="icon-toggle-1"><input type="checkbox" id="icon-toggle-1" class="mdl-icon-toggle__input" disabled><i class="mdl-icon-toggle__label material-icons">gamepad</i></label>').appendTo(this.card.buttons);
    //   var toggle1 = document.getElementById("icon-toggle-1");
    //   toggle1.checked = true;

    this.card.statusBar = $('<div></div>').addClass('card-status').text('').appendTo(this.card);
    this.card.gamepad = $('<span id="gamepad-toggle" class="gamepad-off-icon"></span>').appendTo(this.card.statusBar);
    this.card.closeButton.remove();
    this.card.pauseButton.remove();

    let joySize = 80;
    if (mobileCheck()) {
        joySize = 100;
    } else {
        joySize = 250;
    }

    this.leftJoyId = "joyLeft";
    this.leftJoy = $('<div id="' + this.leftJoyId + '"></div>')
        .css({
            "width": "20%",
            "margin-right": "80%"
        })
        .appendTo(this.viewerNode);
    
    this.img = $('<img id="controller-img"></img>')
      .appendTo(this.viewerNode);

    this.rightJoyId = "joyRight";
    this.rightJoy = $('<div id="' + this.rightJoyId + '"></div>')
        .css({
            "width": "20%",
            "margin-left": "80%"
        })
        .appendTo(this.viewerNode);

    // this.xybuttons = $('<div><button class="mdl-button mdl-js-button mdl-button--fab"><i class="material-icons">add</i></button></div>')
    //     .css({
    //         "width": "20%",
    //         "margin-left": "80%",
    //     })
    //     .appendTo(this.rightJoy);

      

        // var semi_options = {
        //     zone: document.getElementById(this.rightJoyId),
        //     mode: 'semi',
        //     color: 'blue', 
        //     size: joySize,
        //     catchDistance: 100,
        //     dynamicPage: true,    
        // };
        var static_options_right = {
            zone: document.getElementById(this.rightJoyId),
            mode: 'static',
            color: 'red', 
            size: joySize,
            threshold: 100,
            position: {left: '90%', top: '50%'},
            dynamicPage: true, 
        };
        var right_manager = nipplejs.create(static_options_right);
        right_manager.on('start', function(evt, data) {
          let joystickRX = 0.0;
          let joystickRY = 0.0;
          console.log("start")
          currentTransport.update_joy({joystickRX, joystickRY, joystickLX:0, joystickLY:0,
                                        joystickDUp:false, joystickDDown:false, joystickDRight:false, joystickDLeft:false,
                                        joystickButtonA:false, joystickButtonX:false, joystickButtonB:false, joystickButtonY:false, 
                                        joystickButtonR1:false, joystickButtonR2:false, joystickButtonL1:false, joystickButtonL2:false,
                                        joystickRSB:false, joystickLSB:false, joystickEdit:false});
        }).on('end', function(evt, data) {
          let joystickRX = 0.0;
          let joystickRY = 0.0;
          console.log("end")
          currentTransport.update_joy({joystickRX, joystickRY, joystickLX:0, joystickLY:0,
                                        joystickDUp:false, joystickDDown:false, joystickDRight:false, joystickDLeft:false,
                                        joystickButtonA:false, joystickButtonX:false, joystickButtonB:false, joystickButtonY:false, 
                                        joystickButtonR1:false, joystickButtonR2:false, joystickButtonL1:false, joystickButtonL2:false,
                                        joystickRSB:false, joystickLSB:false, joystickEdit:false});
        }).on('move', function(evt, data) {
          let radian = data['angle']['radian'];
          let distance = data['distance'];
          let joystickRX = Math.max(Math.min(Math.cos(radian)/75*distance, 1), -1);
          let joystickRY = -1*Math.max(Math.min(Math.sin(radian)/75*distance , 1), -1);
          console.log(data)
          currentTransport.update_joy({joystickRX, joystickRY, joystickLX:0, joystickLY:0,
                                        joystickDUp:false, joystickDDown:false, joystickDRight:false, joystickDLeft:false,
                                        joystickButtonA:false, joystickButtonX:false, joystickButtonB:false, joystickButtonY:false, 
                                        joystickButtonR1:false, joystickButtonR2:false, joystickButtonL1:false, joystickButtonL2:false,
                                        joystickRSB:false, joystickLSB:false, joystickEdit:false});
        });

        var static_options_left = {
            zone: document.getElementById(this.leftJoyId),
            mode: 'static',
            color: 'red', 
            size: joySize,
            threshold: 100,
            position: {left: '10%', top: '50%'},
            dynamicPage: true, 
            lockX: true,
        };
        var left_manager = nipplejs.create(static_options_left);
        left_manager.on('start', function(evt, data) {
            currentTransport.update_joy({joystickRX:0, joystickRY:0, joystickLX:0, joystickLY:0,
                                        joystickDUp:false, joystickDDown:false, joystickDRight:false, joystickDLeft:false,
                                        joystickButtonA:false, joystickButtonX:false, joystickButtonB:false, joystickButtonY:false, 
                                        joystickButtonR1:false, joystickButtonR2:false, joystickButtonL1:false, joystickButtonL2:false,
                                        joystickRSB:false, joystickLSB:false, joystickEdit:false});
        }).on('end', function(evt, data) {
            currentTransport.update_joy({joystickRX:0, joystickRY:0, joystickLX:0, joystickLY:0,
                                        joystickDUp:false, joystickDDown:false, joystickDRight:false, joystickDLeft:false,
                                        joystickButtonA:false, joystickButtonX:false, joystickButtonB:false, joystickButtonY:false, 
                                        joystickButtonR1:false, joystickButtonR2:false, joystickButtonL1:false, joystickButtonL2:false,
                                        joystickRSB:false, joystickLSB:false, joystickEdit:false});
        }).on('move', function(evt, data) {
            let radian = data['angle']['radian'];
            let distance = data['distance'];
            let joystickLX = Math.max(Math.min(Math.cos(radian)/75*distance, 1), -1);
            let joystickLY = -1*Math.max(Math.min(Math.sin(radian)/75*distance , 1), -1);
            console.log(data)
            currentTransport.update_joy({joystickRX:0, joystickRY:0, joystickLX, joystickLY,
                                        joystickDUp:false, joystickDDown:false, joystickDRight:false, joystickDLeft:false,
                                        joystickButtonA:false, joystickButtonX:false, joystickButtonB:false, joystickButtonY:false, 
                                        joystickButtonR1:false, joystickButtonR2:false, joystickButtonL1:false, joystickButtonL2:false,
                                        joystickRSB:false, joystickLSB:false, joystickEdit:false});
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