
import { HandPrediction } from './HandPrediction'
import camConfig from './CameraConfig'
import * as utils from './utils/util'


// store a reference to the device video
let deviceVideo
const $deviceVideo = document.querySelector('#player-video')

let isMirror = false;

export const fingerIds = [ 
    { start: 13, end: 14 }, // ring finger
    { start: 9, end: 10 },  // middle finger
    { start: 5, end: 6 },   // index finger
    { start: 17, end: 18 },  // pinky finger
]

let fid = 0; // current finger id

async function initDeviceVideo(constraints) {
  // get cam video stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  $deviceVideo.srcObject = stream

  console.log(stream)

  const track = stream.getVideoTracks()[0];
  console.log("Video constraints", JSON.stringify(track.getConstraints()))

  window.track = track

  return new Promise((resolve) => {
    $deviceVideo.onloadedmetadata = () => {

      // $debugText.textContent = "Actual video: " + $deviceVideo.videoWidth + "  " + $deviceVideo.videoHeight;

      // setVideoDimensions( $deviceVideo.videoWidth, $deviceVideo.videoHeight )

      $deviceVideo.onloadeddata = () => {
        resolve($deviceVideo)
      }
    }
  })
}

// setup & initialization
// -----------------------------------------------------------------------------
async function onInit() { 
  // UI.init()
  // UI.setStatusMessage('Initializing - Please wait a moment')

  // let device = deviceDetection()
  // console.log("Device:", device)

  let isMobile = utils.isMobile()

  let config = camConfig.pc
  if (isMobile) config = camConfig.mobile

  const videoPromise = initDeviceVideo(config)
  // const predictPromise = Prediction.init(); // uncommit for hand gesture prediction
  const handPredictionPromise = HandPrediction.init()

  // const gesturePredictionPromise = Prediction.init()

  utils.log('Initialize ar try-on app...')

  Promise.all([videoPromise, handPredictionPromise]).then((result) => {
    // result[0] will contain the initialized video element
    deviceVideo = result[0]
    deviceVideo.play()
    // ThreeEngine.setupScene(deviceVideo)
    // ThreeEngine.makeCylinders()
    startDetection()
  })
}
//-----

// ar try-on logic
// -----------------------------------------------------------------------------
// function waitForUser() {
//   UI.isMobile() === true
//     ? UI.setStatusMessage('Touch the screen to start')
//     : UI.setStatusMessage('Press any key to start')

//   UI.startAnimateMessage()

//   const startTryOnAR = () => {
//     UI.stopAnimateMessage()
//     UI.setStatusMessage('Place your hand in the center')
//     startDetection()
//     //TODO: Start running the animate function here.
//   }

//   // wait for player to press any key
//   UI.isMobile() === true
//     ? document.addEventListener('touchstart', startTryOnAR, { once: true })
//     : window.addEventListener('keypress', startTryOnAR, { once: true })
// }

// function startAR() {
//   UI.stopAnimateMessage()
//   UI.setStatusMessage('Place your hand in the center')
//   startDetection()
// }

async function startDetection() {
  // start detecting user hand
  // required duration 150ms-20ms~ 4-5 camera frames
  detectUserHand() // get hand data
  // detectUserGesture(10)
}

// export function setMirrorState(value) {
//   UI.mirrorCameraVideo(value)
//   isMirror = value
// }

function detectUserHand() {
  const predictHandNonblocking = () => {
    // TODO: Run TensorFlow.js as web worker threads to not block the main thread
    setTimeout(() => {
      HandPrediction.predictHand(deviceVideo, { isFlipHorizontal: isMirror }).then((handData) => {

        if (handData !== "none") {
          // console.log(handData)
        }

        predictHandNonblocking()
        // Checking if hand in frame or not by getting the hand data keypoints
        if (handData[0].keypoints != undefined) {

          utils.log(handData[0].keypoints[5].name + ' x: ' + handData[0].keypoints[5].x + '  y: ' + handData[0].keypoints[5].y)

          // UI.setStatusMessage('Hand found in frame')
          // UI.hideIconHand();
          
          // ThreeJS set model pos / rot / scale logic
          // -----------------------------------------------------------------------------
          // #Each finger `start` is the first dot on that finger (mcp). `end` is the second dot for that finger.
          // Based on the mediapipe chart: https://mediapipe.dev/images/mobile/hand_landmarks.png

          // ThreeEngine.updateFilter(handData[0])

          // ThreeEngine.updateHandedness(handData[0].handedness)

          // // ThreeEngine.setRingPosition( handData[0].keypoints3D[13], handData[0].keypoints3D[14])

          // ThreeEngine.setRingPosition( fingerIds[fid].start, fingerIds[fid].end )

          // ThreeEngine.setRingRotation( fingerIds[fid].start, fingerIds[fid].end )

          // ThreeEngine.setRingScale(handData[0].keypoints)

          // ThreeEngine.updateCylinders()

        } else {
          // UI.setStatusMessage('Hand not found in frame, please center it')
          // UI.showIconHand();
        }
      })

    }, 0)
  }

  predictHandNonblocking()
}

onInit()
