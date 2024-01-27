"use strict";

importJsOnce("js/viewers/meta/Viewer.js");
importJsOnce("js/viewers/meta/Space2DViewer.js");
importJsOnce("js/viewers/meta/Space3DViewer.js");

importJsOnce("js/viewers/ImageViewer.js");
importJsOnce("js/viewers/LogViewer.js");
importJsOnce("js/viewers/ProcessListViewer.js");
importJsOnce("js/viewers/MapViewer.js");
importJsOnce("js/viewers/LaserScanViewer.js");
importJsOnce("js/viewers/GeometryViewer.js");
importJsOnce("js/viewers/PolygonViewer.js");
importJsOnce("js/viewers/DiagnosticViewer.js");
importJsOnce("js/viewers/TimeSeriesPlotViewer.js");
importJsOnce("js/viewers/PointCloud2Viewer.js");
// importJsOnce("js/viewers/JoystickController.js");
importJsOnce("js/viewers/ControllerViewer.js");

// GenericViewer must be last
importJsOnce("js/viewers/GenericViewer.js");

importJsOnce("js/transports/WebSocketV1Transport.js");
importJsOnce("js/config.js");

importJsOnce("js/Controller.js");


// Dont deploy This APi KEY or upload on to github
const API_KEY = MyApiKey;
const API_URL = "https://api.openai.com/v1/chat/completions";

const submitButton   = document.querySelector('#submit');
const outPutElement  = document.querySelector('#result');
const inputElement   = document.querySelector('input');
const buttonElement  = document.querySelector('button');

// supported Language List
var langList = ['en', 'fa'];
// Get browser Language
var userLang = navigator.language || navigator.userLanguage;
// extract Language (en-US => en)
userLang = userLang.substring(0, 2);
changeLang(userLang);

function changeLang(lang) {
    userLang = lang;
    langList.forEach((langEle) => {
    if (langEle == lang) {
        var langElems = document.querySelectorAll('.' + langEle)
        langElems.forEach((elem) => {
            elem.style.display = "block"
        })
    }
    else {
        hideLang(langEle)
    }
  })
}

function hideLang(lang) {
    var langElems = document.querySelectorAll('.' + lang)
    langElems.forEach((elem) => {
        elem.style.display = "none"
    })
}

function changeInput(value) {
    const inputElement = document.querySelector('input');
    inputElement.value = value;
}

let synth = speechSynthesis,
  isSpeaking = true;

voices();

function voices() {
  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option);
  }
}


async function getMessage() {
    var lang;
    if (userLang == "en") {
        lang = "english";
    } else if (userLang == "fa") {
        lang = "persian";
    }
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type' : 'application/json'
        }, 
        body : JSON.stringify({
            model : "gpt-3.5-turbo",
            messages: [
            	{role: "system", content: "you are a helpful asssistant which will answer the questions about the custom quadruped made in IUST (Iran university of science and technology) robotics lab and will respond in " + lang + " language."},
            	
            	{role: "assistant", content: "this quadruped is based on MIT's mini cheetah, the actuators are same on all four legs and the software is developed based on minicheetah's software. the main processor is a UPboard 2 which will be the brain of the robot and will have realsense d435i as camera on it. robot's name is marvin and is being developed in IUST university."},
            	{role: "user", content: inputElement.value},],
            max_tokens: 100
        })
    }
    try {
        const response = await fetch(API_URL, options);
        const data = await response.clone().json();
        console.log(data);
        outPutElement.textContent = data.choices[0].message.content;
        // textToSpeech(data.choices[0].message.content);
    if ('speechSynthesis' in window) {
    }else{
      alert("Sorry, your browser doesn't support text to speech!");
    }
    console.log("speaking");
    // var response = new SpeechSynthesisUtterance();
    // response.text = text;
    // response.lang = 'fa'
    // window.speechSynthesis.speak(response);

  // Create a new SpeechSynthesisUtterance object
  let utterance = new SpeechSynthesisUtterance();

//   utterance.lang = 'fa';
// utterance.voice = 'fa';
  // Set the text and voice of the utterance
  utterance.text = data.choices[0].message.content;
  console.log(data.choices[0].message.content);
  for (let voice of synth.getVoices()) {
    // console.log(voice.name);
    if (voice.name === "Persian") {
        console.log(voice.name);
      utterance.voice = voice;
    }
  }
//   setTimeout(() => {
//     console.log(window.speechSynthesis.getVoices());
// }, 50);
    // const voices = utterance.getVoices();
    // console.log(voices);
// utterance.text = "hello there";
//   utterance.voice = window.speechSynthesis.getVoices()[0];

  // Speak the utterance
  synth.speak(utterance);
 
            if (data.choices[0].message.content && inputElement.value) {
                const pElement = document.createElement('p');
                pElement.textContent = inputElement.value;
                pElement.addEventListener('click', () => changeInput());
            }
    } catch (error) {
        console.error(error);
    }
}

function textToSpeech(text) {
    if ('speechSynthesis' in window) {
    }else{
      alert("Sorry, your browser doesn't support text to speech!");
    }

    console.log("speaking");
    // var response = new SpeechSynthesisUtterance();
    // response.text = text;
    // response.lang = 'fa'
    // window.speechSynthesis.speak(response);

  // Create a new SpeechSynthesisUtterance object
  let utterance = new SpeechSynthesisUtterance();

  // Set the text and voice of the utterance
  utterance.text = text;
  utterance.lang = 'fa';
  utterance.voice = window.speechSynthesis.getVoices()[0];

  // Speak the utterance
  window.speechSynthesis.speak(utterance);
    
}

submitButton.addEventListener('click', getMessage);

function clearInput() {
    inputElement.value = '';
}

buttonElement.addEventListener('click', clearInput);

const GetDrawer = () => {
    var drawer = document.querySelector('.mdl-layout');
    drawer.MaterialLayout.toggleDrawer();
}

const ToggleTabMenu = () => {
    var header = document.getElementById("mdl-header");
    if (header.style.display == "flex") {
        header.style.display = "none";
    } else {
        header.style.display = "flex";
    }
}

const GetSpeech = () => {
    console.log("clicked microphone");
    // To enable the SpeechRecognition in Firefox Nightly > 72, go to about:config and switch 
    // the flags media.webspeech.recognition.enable and media.webspeech.recognition.force_enable to true.
    const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
   
    let recognition = new SpeechRecognition();
    recognition.lang = 'fa-IR'

        var intxt = document.getElementById("input-text");
        recognition.onstart = () => {
            console.log("starting listening, speak in microphone");
        }
        recognition.onspeechend = () => {
            console.log("stopped listening");
            recognition.stop();
        }
        recognition.onresult = (result) => {
            console.log(result.results[0][0].transcript);
            intxt.value += result.results[0][0].transcript;
         }
     
         recognition.start();
}

function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function vbClick(butt) {
    if (butt == 1) {
        currentTransport.update_joy({joystickRX:0, joystickRY:0, joystickLX:0, joystickLY:0,
                                      joystickDUp:false, joystickDDown:false, joystickDRight:false, joystickDLeft:false,
                                      joystickButtonA:true, joystickButtonX:false, joystickButtonB:false, joystickButtonY:false, 
                                      joystickButtonR1:false, joystickButtonR2:false, joystickButtonL1:false, joystickButtonL2:false,
                                      joystickRSB:false, joystickLSB:false, joystickEdit:false});
    } else if (butt == 2) {
        currentTransport.update_joy({joystickRX:0, joystickRY:0, joystickLX:0, joystickLY:0,
                                      joystickDUp:false, joystickDDown:false, joystickDRight:false, joystickDLeft:false,
                                      joystickButtonA:false, joystickButtonX:false, joystickButtonB:true, joystickButtonY:false, 
                                      joystickButtonR1:false, joystickButtonR2:false, joystickButtonL1:false, joystickButtonL2:false,
                                      joystickRSB:false, joystickLSB:false, joystickEdit:false});
    } else if (butt == 3) {
        currentTransport.update_joy({joystickRX:0, joystickRY:0, joystickLX:0, joystickLY:0,
                                      joystickDUp:false, joystickDDown:false, joystickDRight:false, joystickDLeft:false,
                                      joystickButtonA:false, joystickButtonX:true, joystickButtonB:false, joystickButtonY:false, 
                                      joystickButtonR1:false, joystickButtonR2:false, joystickButtonL1:false, joystickButtonL2:false,
                                      joystickRSB:false, joystickLSB:false, joystickEdit:false});
    }
}

function toggleGamepadStatus() {
    var gt = document.getElementById("gamepad-toggle");
    if (gt.className == "gamepad-on-icon") {
        gt.className = "gamepad-off-icon";
    } else {
        gt.className = "gamepad-on-icon";
    }
};

function changeGamepad() {
    var virtualJoystickR = document.getElementById("joyRight");
    var virtualJoystickL = document.getElementById("joyLeft");
    var virtualButtonA = document.getElementById("Abutton");
    var virtualButtonB = document.getElementById("Bbutton");
    var virtualButtonX = document.getElementById("Xbutton");
    if (virtualJoystickR.style.display == "none") {
        virtualJoystickR.style.display = "block";
        virtualJoystickL.style.display = "block";
        virtualButtonA.style.display = "block";
        virtualButtonB.style.display = "block";
        virtualButtonX.style.display = "block";
    } else {
        virtualJoystickR.style.display = "none";
        virtualJoystickL.style.display = "none";
        virtualButtonA.style.display = "none";
        virtualButtonB.style.display = "none";
        virtualButtonX.style.display = "none";
    }
}

if (document.fullscreenEnabled) {
    const fullscreen_button = document.createElement("button");
    fullscreen_button.classList.add("corner-button")
    fullscreen_button.setAttribute('id','fullscreen-button');
    fullscreen_button.addEventListener("click", toggle_fullscreen);
    fullscreen_button.innerHTML  = `
        <svg viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 
            7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
        </svg>
        <svg viewBox="0 0 24 24">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 
            11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
        </svg>
    `;
    document.body.appendChild(fullscreen_button);
}

function toggle_fullscreen() {
    let elem = document.body;
    // let controller = document.getElementById("controller-img")
    if (!document.fullscreenElement) {
        // controller.style = "controller-img-windowed";
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen();
        }
        document.body.setAttribute("fullscreen",""); 
    } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
        }
        document.body.removeAttribute("fullscreen"); 
    }
} 

let controller_tab = document.getElementById("tab2");
controller_tab.addEventListener("click", get_controller);
function get_controller() {
    initSubscribe({topicName: "/d435/color/image_raw", topicType: "sensor_msgs/Image"});
    document.body.style.overflow='hidden';
}

var snackbarContainer = document.querySelector('#demo-toast-example');

let subscriptions = {};

if(window.localStorage && window.localStorage.subscriptions) {
  if(window.location.search && window.location.search.indexOf("reset") !== -1) {
    subscriptions = {};
    updateStoredSubscriptions();
    window.location.href = "?";
  } else {
    try {
      subscriptions = JSON.parse(window.localStorage.subscriptions);
    } catch(e) {
      console.log(e);
      subscriptions = {};
    }
  }
}

let $grid = null;
$(() => {
  $grid = $('.status-grid').masonry({
    itemSelector: '.card',
    gutter: 10,
    percentPosition: true,
  });
  $grid.masonry("layout");
});

let $controller_grid = null;
$(() => {
    $controller_grid = $('.controller-grid').masonry({
        itemSelector: '.controller-card',
        // gutter: 10,
        // percentPosition: true,
    });
});

setInterval(() => {
    $grid.masonry("reloadItems");
    $grid.masonry();
  }, 500);

setInterval(() => {
  if(currentTransport && !currentTransport.isConnected()) {
    console.log("attempting to reconnect ...");
    currentTransport.connect();
  }
}, 5000);

function updateStoredSubscriptions() {
  if(window.localStorage) {
    let storedSubscriptions = {};
    for(let topicName in subscriptions) {
      storedSubscriptions[topicName] = {
        topicType: subscriptions[topicName].topicType,
      };
    }
    window.localStorage['subscriptions'] = JSON.stringify(storedSubscriptions);
  }
}

function newCard() {
  // creates a new card, adds it to the grid, and returns it.
  let card = $("<div></div>").addClass('card')
    .appendTo($('.status-grid'));
  return card;
}

function newController() {
    // creates controller, adds it to the grid, and returns it.
    let card= $("<div></div>").addClass('controller-card')
        .appendTo($('#controller-content'));
    return card;
}

let onOpen = function() {
  for(let topic_name in subscriptions) {
    console.log("Re-subscribing to " + topic_name);
    initSubscribe({topicName: topic_name, topicType: subscriptions[topic_name].topicType});
  }
}

let onSystem = function(system) {
  if(system.hostname) {
    console.log("hostname: " + system.hostname);
    $('.mdl-layout-title').text("Control Panel: " + system.hostname);
  }

  if(system.version) {
    console.log("server version: " + system.version);
    versionCheck(system.version);
  }
}

let onMsg = function(msg) {
  if(!subscriptions[msg._topic_name]) {
    console.log("Received unsolicited message", msg);
  } else if(!subscriptions[msg._topic_name].viewer) {
    console.log("Received msg but no viewer", msg);
  } else {
    subscriptions[msg._topic_name].viewer.update(msg);
  }
}

let currentTopics = {};
let currentTopicsStr = "";

let onTopics = function(topics) {
  
  // check if topics has actually changed, if not, don't do anything
  // lazy shortcut to deep compares, might possibly even be faster than
  // implementing a deep compare due to
  // native optimization of JSON.stringify
  let newTopicsStr = JSON.stringify(topics);
  if(newTopicsStr === currentTopicsStr) return;
  currentTopics = topics;
  currentTopicsStr = newTopicsStr;
  
  let topicTree = treeifyPaths(Object.keys(topics));
  
  $("#topics-nav-ros").empty();
  $("#topics-nav-system").empty();
  
  addTopicTreeToNav(topicTree[0], $('#topics-nav-ros'));

  $('<a></a>')
  .addClass("mdl-navigation__link")
  .click(() => { initSubscribe({topicName: "_dmesg", topicType: "rcl_interfaces/msg/Log"}); })
  .text("dmesg")
  .appendTo($("#topics-nav-system"));

  $('<a></a>')
  .addClass("mdl-navigation__link")
  .click(() => { initSubscribe({topicName: "_top", topicType: "rosboard_msgs/msg/ProcessList"}); })
  .text("Processes")
  .appendTo($("#topics-nav-system"));

  $('<a></a>')
  .addClass("mdl-navigation__link")
  .click(() => { initSubscribe({topicName: "_system_stats", topicType: "rosboard_msgs/msg/SystemStats"}); })
  .text("System stats")
  .appendTo($("#topics-nav-system"));
}

function addTopicTreeToNav(topicTree, el, level = 0, path = "") {
  topicTree.children.sort((a, b) => {
    if(a.name>b.name) return 1;
    if(a.name<b.name) return -1;
    return 0;
  });
  topicTree.children.forEach((subTree, i) => {
    let subEl = $('<div></div>')
    .css(level < 1 ? {} : {
      "padding-left": "0pt",
      "margin-left": "12pt",
      "border-left": "1px dashed #808080",
    })
    .appendTo(el);
    let fullTopicName = path + "/" + subTree.name;
    let topicType = currentTopics[fullTopicName];
    if(topicType) {
      $('<a></a>')
        .addClass("mdl-navigation__link")
        .css({
          "padding-left": "12pt",
          "margin-left": 0,
        })
        .click(() => { initSubscribe({topicName: fullTopicName, topicType: topicType}); })
        .text(subTree.name)
        .appendTo(subEl);
    } else {
      $('<a></a>')
      .addClass("mdl-navigation__link")
      .attr("disabled", "disabled")
      .css({
        "padding-left": "12pt",
        "margin-left": 0,
        opacity: 0.5,
      })
      .text(subTree.name)
      .appendTo(subEl);
    }
    addTopicTreeToNav(subTree, subEl, level + 1, path + "/" + subTree.name);
  });
}

function initSubscribe({topicName, topicType}) {
  // creates a subscriber for topicName
  // and also initializes a viewer (if it doesn't already exist)
  // in advance of arrival of the first data
  // this way the user gets a snappy UI response because the viewer appears immediately
  if(!subscriptions[topicName]) {
    subscriptions[topicName] = {
      topicType: topicType,
    }
  }  
  currentTransport.subscribe({topicName: topicName});
  if(!subscriptions[topicName].viewer) {
    let card;
    if (topicName == "/d435/color/image_raw"){
       card = newController(); 
    } else {
        card = newCard();
    }

    let viewer = Viewer.getDefaultViewerForType(topicName, topicType);
    try {
      subscriptions[topicName].viewer = new viewer(card, topicName, topicType);
    } catch(e) {
      console.log(e);
      card.remove();
    }
    if (topicName == "/d435/color/image_raw"){
        // $controller_grid.masonry("appended", card);
    } else {
        $grid.masonry("appended", card);
        $grid.masonry("layout");
    }
  }
  updateStoredSubscriptions();
}

let currentTransport = null;

function initDefaultTransport() {
  currentTransport = new WebSocketV1Transport({
    path: "/rosboard/v1",
    onOpen: onOpen,
    onMsg: onMsg,
    onTopics: onTopics,
    onSystem: onSystem,
  });
  currentTransport.connect();
}

function treeifyPaths(paths) {
  // turn a bunch of ros topics into a tree
  let result = [];
  let level = {result};

  paths.forEach(path => {
    path.split('/').reduce((r, name, i, a) => {
      if(!r[name]) {
        r[name] = {result: []};
        r.result.push({name, children: r[name].result})
      }
      
      return r[name];
    }, level)
  });
  return result;
}

let lastBotherTime = 0.0;
function versionCheck(currentVersionText) {
  $.get("https://raw.githubusercontent.com/dheera/rosboard/release/setup.py").done((data) => {
    let matches = data.match(/version='(.*)'/);
    if(matches.length < 2) return;
    let latestVersion = matches[1].split(".").map(num => parseInt(num, 10));
    let currentVersion = currentVersionText.split(".").map(num => parseInt(num, 10));
    let latestVersionInt = latestVersion[0] * 1000000 + latestVersion[1] * 1000 + latestVersion[2];
    let currentVersionInt = currentVersion[0] * 1000000 + currentVersion[1] * 1000 + currentVersion[2];
    if(currentVersion < latestVersion && Date.now() - lastBotherTime > 1800000) {
      lastBotherTime = Date.now();
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "New version of ROSboard available (" + currentVersionText + " -> " + matches[1] + ").",
        actionText: "Check it out",
        actionHandler: ()=> {window.location.href="https://github.com/dheera/rosboard/"},
      });
    }
  });
}

$(() => {
  if(window.location.href.indexOf("rosboard.com") === -1) {
    initDefaultTransport();
  }
});

Viewer.onClose = function(viewerInstance) {
  let topicName = viewerInstance.topicName;
  let topicType = viewerInstance.topicType;
  currentTransport.unsubscribe({topicName:topicName});
  $grid.masonry("remove", viewerInstance.card);
  $grid.masonry("layout");
  delete(subscriptions[topicName].viewer);
  delete(subscriptions[topicName]);
  updateStoredSubscriptions();
}

Viewer.onSwitchViewer = (viewerInstance, newViewerType) => {
  let topicName = viewerInstance.topicName;
  let topicType = viewerInstance.topicType;
  if(!subscriptions[topicName].viewer === viewerInstance) console.error("viewerInstance does not match subscribed instance");
  let card = subscriptions[topicName].viewer.card;
  subscriptions[topicName].viewer.destroy();
  delete(subscriptions[topicName].viewer);
  subscriptions[topicName].viewer = new newViewerType(card, topicName, topicType);
};
