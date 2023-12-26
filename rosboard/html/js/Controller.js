const gamepadAPI = {
    connected: false,
    controller: {},
    controlHandler: null,
    connect: function(e) {
        toggleGamepadStatus();
        changeGamepad();
        gamepadAPI.connected = true;
        gamepadAPI.addgamepad(e.gamepad);
        gamepadAPI.enableControl();
    },
    addgamepad: function(gamepad) {
        var gamepads = navigator.getGamepads()
        gamepadAPI.controller = gamepads[0];

        console.log(
            "Gamepad connected at index %d: %s. %d buttons, %d axes.",
            gamepad.index,
            gamepad.id,
            gamepad.buttons.length,
            gamepad.axes.length,
        );
        console.log(gamepad.buttons);
        console.log(gamepad.axes);
        if (mobileCheck()) {
            gamepadAPI.buttons = gamepadAPI.phone_buttons;
        }else {
            gamepadAPI.buttons = gamepadAPI.computer_buttons;
        }
    },
    disconnect: function(e) {
        toggleGamepadStatus();
        changeGamepad();
        clearInterval(gamepadAPI.controlHandler);
        gamepadAPI.connected = false;
        gamepadAPI.removegamepad();
    },
    removegamepad: function() {
        console.log("gamepad removed");
        delete gamepadAPI.controller;
    },
    update: function() {
        // some browsers add by polling (e.g chrome), others by event
        var gamepads = navigator.getGamepads()
        gamepadAPI.controller = gamepads[0];

		gamepadAPI.buttonsCache = [];
		for(var k=0; k<gamepadAPI.buttonsStatus.length; k++) {
			gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
		}
		gamepadAPI.buttonsStatus = [];
		var c = gamepadAPI.controller || {};
		var pressed = [];
		if(c.buttons) {
			for(var b=0,t=c.buttons.length; b<t; b++) {
				if(c.buttons[b].pressed) {
					pressed.push(gamepadAPI.buttons[b]);
				}
			}
		}
		var axes = [];
		if(c.axes) {
			for(var a=0,x=c.axes.length; a<x; a++) {
				axes.push(c.axes[a].toFixed(2));
			}
		}
		gamepadAPI.axesStatus = axes;
		gamepadAPI.buttonsStatus = pressed;
		return pressed;
	},
	buttonPressed: function(button, hold) {
		var newPress = false;
		for(var i=0,s=gamepadAPI.buttonsStatus.length; i<s; i++) {
			if(gamepadAPI.buttonsStatus[i] == button) {
				newPress = true;
				if(!hold) {
					for(var j=0,p=gamepadAPI.buttonsCache.length; j<p; j++) {
						if(gamepadAPI.buttonsCache[j] == button) {
							newPress = false;
						}
					}
				}
			}
		}
		return newPress;
	},
    enableControl: function() { 
        gamepadAPI.controlHandler = setInterval(() => {
            gamepadAPI.update();

            let joystickButtonA = gamepadAPI.buttonPressed('A', 'hold')
            let joystickButtonX = gamepadAPI.buttonPressed('X', 'hold')
            let joystickButtonB = gamepadAPI.buttonPressed('B', 'hold')
            let joystickButtonY = gamepadAPI.buttonPressed('Y', 'hold')
            let joystickButtonR1 = gamepadAPI.buttonPressed('R1', 'hold')
            let joystickX = parseFloat(gamepadAPI.axesStatus[2]);
            let joystickY = parseFloat(gamepadAPI.axesStatus[3]);
            let joystickR = parseFloat(gamepadAPI.axesStatus[0]);

            currentTransport.update_joy({joystickX, joystickY, joystickR, joystickButtonA, joystickButtonX, joystickButtonB, joystickButtonY, joystickButtonR1});
    }, 100)},
    buttons: [],
	computer_buttons: [ // TSCO layout
        // axes layout: 
        // right stick-> up-down=3 right-left=2 / 
        // left stick-> up-down=1 right-left=0 / 
        // Dpad -> up-down=7 right-left=6/
		'A','B','None','X','Y',
		'None','L1','R1','L2','R2',
		'None','Edit','None','LStick-Button','RStick-Button'
	],
    phone_buttons: [ // TSCO layout
        // axes layout: 
        // right stick-> up-down=3 right-left=2 / 
        // left stick-> up-down=1 right-left=0 / 
		'A','B','X','Y','L1',
		'R1','L2','R2','None','Edit',
		'LStick-Button','RStick-Button','DPad-up','DPad-down','DPad-left', 'DPad-right' 
	],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: [],
};

window.addEventListener("gamepadconnected", gamepadAPI.connect);
window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);
