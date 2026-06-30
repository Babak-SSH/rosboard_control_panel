"use strict";

class MiniImageViewer extends Viewer {
  /**
    * Gets called when Viewer is first initialized.
    * @override
  **/
  onCreate() {
    this.viewerNode = $('<div></div>')
      .css({'font-size': '11pt'})
      .appendTo(this.card.content);

    this.card.title.remove();
    this.card.buttons.remove();

    this.img = $('<img id="mini-image"></img>')
    //   .css({"width": "100%"})
      .appendTo(this.viewerNode);

    this.img[0].addEventListener('click', function(){changeSource();}, false);
    super.onCreate();
  }

  onData(msg) {
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

MiniImageViewer.friendlyName = "MiniImage";

MiniImageViewer.supportedTypes = [
    "sensor_msgs/msg/Image",
    "sensor_msgs/msg/CompressedImage",
    "nav_msgs/msg/OccupancyGrid",
];

MiniImageViewer.maxUpdateRate = 24.0;

Viewer.registerViewer(MiniImageViewer);