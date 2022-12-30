import { UI } from '../UI'
const $videoElement = document.querySelector('#player-video')
const $snapshotBtnImg = document.querySelector('#snapshot-img');
const $snapshotCanvas = document.querySelector('#snapshot-canvas')
const $snapshotContainer = document.querySelector('#snapshot-container')

let ctx;
let aspectRatio;
let videoW;
let videoH;
let snapCanvasElement;
let savedImg;
export const SnapShot = {

    
    createSnapShot: () => {
        console.log("createSnapShot !")
        // Initialize shanpshots draw element
        snapCanvasElement = $snapshotCanvas;
        ctx = snapCanvasElement.getContext('2d');

        // Set the snapshot canvas size to be as video dimensions (640X480).
        $videoElement.onloadedmetadata = () => {
            $videoElement.onloadeddata = () => {
                videoW = $videoElement.videoWidth;
                videoH = $videoElement.videoHeight;
                aspectRatio = videoH / videoW;
            }
        }
        // Draw the snapshot
        if(!$videoElement.paused) {
            // Fix draw Image to fit the screen size
            if(UI.isMobile() == true) {
                snapCanvasElement.width = videoW;
                snapCanvasElement.height = videoH;
                ctx.drawImage($videoElement, 0, 0, snapCanvasElement.width, snapCanvasElement.height);
            } else {
                snapCanvasElement.height = $videoElement.offsetHeight;
                snapCanvasElement.width = $videoElement.offsetWidth;
                ctx.drawImage($videoElement, 0, 0, snapCanvasElement.width, snapCanvasElement.height);
            }
        }
        $snapshotContainer.style = 'display: block'
        $snapshotBtnImg.src = 'assets/retry-camera.png'
        //TODO: Add current Three.js model position/rotation/scale + some post processing effects

    },

    clearSnapShot: () => {
        console.log("clearSnapShot...")
        ctx.clearRect(0,0, $snapshotCanvas.width, $snapshotCanvas.height)
        $snapshotContainer.style = 'display: none'
        $snapshotBtnImg.src = 'assets/snapshot.png'
        savedImg = null;
    },

    saveSnapShot: () => {
        savedImg = snapCanvasElement.toDataURL("image/jpeg", 1.0).replace("image/octet-stream");
        window.location.href = savedImg;
    }

}
