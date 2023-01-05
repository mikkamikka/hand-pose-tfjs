
import { HandPrediction } from './HandPrediction'
import camConfig from './CameraConfig'
import * as utils from './utils/util'


// store a reference to the device video
let deviceVideo, video
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

  await new Promise((resolve) => {
    $deviceVideo.onloadedmetadata = (args) => {

      // $debugText.textContent = "Actual video: " + $deviceVideo.videoWidth + "  " + $deviceVideo.videoHeight;

      // setVideoDimensions( $deviceVideo.videoWidth, $deviceVideo.videoHeight )

      console.log(args)

      resolve()

      // $deviceVideo.onloadeddata = () => {
      //   // resolve()
      // }
    }
  })

  

  // $deviceVideo.play();

  return $deviceVideo

}

// setup & initialization
// -----------------------------------------------------------------------------
async function onInit() { 

  let isMobile = utils.isMobile()

  let config = camConfig.pc
  if (isMobile) config = camConfig.mobile

  video = await initDeviceVideo(config)

  video.play()

  video.width = video.videoWidth;
  video.height = video.videoHeight;


  const handPredictionPromise = await HandPrediction.init()


  utils.log('Initialize ar try-on app...')

  // Promise.all([videoPromise, handPredictionPromise]).then((result) => {
  //   // result[0] will contain the initialized video element
  //   deviceVideo = result[0]
  //   deviceVideo.play()
  //   startDetection()
  // })

  console.log(video)

  startDetection()

}
//-----

async function startDetection() {
  // start detecting user hand
  // required duration 150ms-20ms~ 4-5 camera frames
  detectUserHand() // get hand data

}


function detectUserHand() {
  const predictHandNonblocking = () => {
    // TODO: Run TensorFlow.js as web worker threads to not block the main thread
    setTimeout(() => {
      HandPrediction.predictHand(video, { isFlipHorizontal: isMirror }).then((handData) => {

        if (handData !== "none") {
          // console.log(handData)
        }

        predictHandNonblocking()
        // Checking if hand in frame or not by getting the hand data keypoints
        if (handData[0].keypoints != undefined) {

          utils.log(handData[0].keypoints[5].name + ' x: ' + handData[0].keypoints[5].x + '  y: ' + handData[0].keypoints[5].y)

        } else {
          
        }
      })

    }, 0)
  }

  predictHandNonblocking()
}

onInit()
