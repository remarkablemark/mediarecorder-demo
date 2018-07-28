// get user media with constraints
var userMedia = navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
});

// success
userMedia.then(function handleSuccess(mediaStream) {
  console.log('SUCCESS: navigator.getUserMedia:', mediaStream);
  var videoTracks = mediaStream.getVideoTracks();
  console.log('SUCCESS: using video device:', videoTracks[0].label);
  var video = document.querySelector('video');
  video.srcObject = mediaStream;
});

// error
userMedia.catch(function handleError(error) {
  console.error('ERROR: navigator.getUserMedia:', error);
});
