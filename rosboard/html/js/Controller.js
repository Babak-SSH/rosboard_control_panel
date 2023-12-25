const haveEvents = "ongamepadconnected" in window;
const controllers = {};

function connecthandler(e) {
  var gt = document.getElementById("gamepad-toggle");
  gt.className = "gamepad-on-icon";
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;

console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    gamepad.index,
    gamepad.id,
    gamepad.buttons.length,
    gamepad.axes.length,
  );
//   const start = document.getElementById("start");
//   if (start) {
    // start.style.display = "none";
//   }
}

function disconnecthandler(e) {
    var gt = document.getElementById("gamepad-toggle");
    gt.className = "gamepad-off-icon";
    removegamepad(e.gamepad);
}
  
function removegamepad(gamepad) {
    console.log("gamepad removed");
    delete controllers[gamepad.index];
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);
