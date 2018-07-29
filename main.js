'use strict';

var mediaRecorder;
var recordedBlobs;
var stream;

var startRecordingButton = document.querySelector('.js-start-recording');
var stopRecordingButton = document.querySelector('.js-stop-recording');

var recordingVideo = document.querySelector('.js-video-recording');
var streamVideo = document.querySelector('.js-video-stream');

/**
 * MediaStream.
 */

// get user media with constraints
var userMedia = navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
});

// success
userMedia.then(onUserMediaSuccess);

/**
 * @param {MediaStream} mediaStream
 */
function onUserMediaSuccess(mediaStream) {
  console.info('getUserMedia: Stream:', mediaStream); // eslint-disable-line no-console
  var videoTracks = mediaStream.getVideoTracks();
  console.info('getUserMedia: Using video device:', videoTracks[0].label); // eslint-disable-line no-console
  streamVideo.srcObject = mediaStream;
  stream = mediaStream;
}

// error
userMedia.catch(onUserMediaError);

/**
 * @param {Error} error
 */
function onUserMediaError(error) {
  console.error('getUserMedia:', error); // eslint-disable-line no-console
  alert('getUserMedia exception. See console for more details.'); // eslint-disable-line no-alert
}

/**
 * MediaRecorder.
 */

// click to start recording
startRecordingButton.addEventListener('click', startRecording);

function startRecording() {
  recordedBlobs = [];
  var mimeType = 'video/webm;codecs=vp9';

  if (!MediaRecorder.isTypeSupported(mimeType)) {
    console.warn('MediaRecorder:', mimeType, 'is not supported');
    mimeType = 'video/webm';
  }

  if (!MediaRecorder.isTypeSupported(mimeType)) {
    console.warn('MediaRecorder:', mimeType, 'is not supported'); // eslint-disable-line no-console
    mimeType = '';
  }

  var options = {
    mimeType: mimeType
  };

  try {
    mediaRecorder = new MediaRecorder(stream, options);
    console.info('MediaRecorder: Options:', options); // eslint-disable-line no-console
  } catch (error) {
    console.error('MediaRecorder:', error); // eslint-disable-line no-console
    console.error('MediaRecorder exception. See console for more details.'); // eslint-disable-line no-console
    return;
  }

  /**
   * @param {Event}  event
   * @param {Object} event.data
   * @param {Number} event.data.size
   */
  mediaRecorder.ondataavailable = function handleDataAvailable(event) {
    var data = event.data;
    if (data && data.size > 0) {
      recordedBlobs.push(data);
    }
  };

  /**
   * @param {Event} event
   */
  mediaRecorder.onstop = function handleStop(event) {
    console.info('MediaRecorder: Stopped:', event); // eslint-disable-line no-console
  };
  mediaRecorder.start(0); // collect 0ms of data
  console.info('MediaRecorder: Started:', mediaRecorder); // eslint-disable-line no-console

  startRecordingButton.disabled = true;
  stopRecordingButton.disabled = false;
}

// click to stop recording
stopRecordingButton.addEventListener('click', stopRecording);

function stopRecording() {
  mediaRecorder.stop();
  var superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
  recordingVideo.src = URL.createObjectURL(superBuffer);

  startRecordingButton.disabled = false;
  stopRecordingButton.disabled = true;
  console.info('MediaRecorder: Recorded blobs:', recordedBlobs); // eslint-disable-line no-console
}
