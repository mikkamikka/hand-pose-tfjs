import * as handPoseDetection from '@tensorflow-models/hand-pose-detection'
import * as tf from '@tensorflow/tfjs-core'
// import * as core from '@tensorflow/tfjs-core'

// Register WebGL backend.
// import * as webgl from '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-webgl'

import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';

import '@mediapipe/hands'

// ml detector params
import { RUNTIME } from './utils/params/MlParams'
import { STATE } from './utils/params/MlParams'

import * as utils from './utils/util'

tfjsWasm.setWasmPaths(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${
        tfjsWasm.version_wasm}/dist/`);

// store references
let handDetector
let handData = null

let runtime
let detectorConfig
let statsDetector
let startInferenceTime
let numInferences = 0
let inferenceTimeSum = 0
let lastPanelUpdate = 0

export const HandPrediction = {
  init: async () => {
    // load handpose model with spesific configuration
    const model = handPoseDetection.SupportedModels.MediaPipeHands
    console.log('Loading @tensorflow-models/hand-pose-detection (mediaPipe) model...')
    runtime = utils.isMobile() ? RUNTIME.tf : RUNTIME.mp

    await utils.setBackendAndEnvFlags(STATE.flags, 'tfjs-webgl');

    //test
    // runtime = RUNTIME.mp

    // PC config
    if (runtime === 'mediapipe') {
      detectorConfig = {
        runtime,
        modelType: STATE.modelConfig.full,
        maxHands: STATE.maxHands,
        solutionPath: STATE.solutionPath,
      }
      handDetector = await handPoseDetection.createDetector(model, detectorConfig)
      console.log(`mediapipe env: gpu`)
    }
    // Mobile config
    // For mobile IOS we will use webgl, for mobile android we probaly will use WASM.
    // For old phones we that not support webgl, we also gonna use WASM.
    else if (runtime === 'tfjs') {
      detectorConfig = {
        // runtime,
        // modelType: STATE.modelConfig.lite,
        // maxHands: STATE.maxHands,
        // solutionPath: STATE.solutionPath,
        runtime: 'tfjs',
        // modelType: 'full',
        // maxHands: 1,
        // solutionPath: STATE.solutionPath,
        // solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
      }
      handDetector = await handPoseDetection.createDetector(model, detectorConfig)
      console.log(
        `tensorflow env: ${tf.getBackend()}, core: ${tf.version_core}, webgl-version: ${
          "..."
        }`
      )
    }
    console.log(`HandDetector ${runtime} detector loaded.`)

    // Make one prediction on a sample image,
    // This is to "warm up" the model so there won't be a delay before the actual predictions later
    // console.log(`Warm up ${runtime} HandDetector...`)
    // const sample = await SampleImage.create()
    // let sampletest = await handDetector.estimateHands(sample)
    // console.log(`HandDetector ${runtime} is ready to use !`)
    // console.log(sampletest)

    window.tf = tf

    // statsDetector = UI.setupMLStats()
  },

  predictHand: async function (sourceElement, paramsData) {
    // FPS only counts the time it takes to finish estimateHands.
    HandPrediction.beginEstimateHandsStats()

    let isFlipHorizontal = false;
    if (paramsData != undefined && paramsData.isFlipHorizontal != undefined) isFlipHorizontal = paramsData.isFlipHorizontal;

    

    try {
      handData = await handDetector.estimateHands(sourceElement, 
        {flipHorizontal: isFlipHorizontal}         // flipHorizontal: false, if we want the result to flip horizontaly. Defaults is set to false.
      ) 
      
    } catch (error) {
      handDetector.dispose()
      handDetector = null
      alert(error)
    }

    

    HandPrediction.endEstimateHandsStats()    

    

    if (handData && handData.length > 0) {
      // console.log(isFlipHorizontal)

      console.log(handData)
      
      return handData
    } else {
      return 'none'
    }
    
  },

  beginEstimateHandsStats: () => {
    startInferenceTime = (performance || Date).now()
  },

  endEstimateHandsStats: () => {
    const endInferenceTime = (performance || Date).now()
    inferenceTimeSum += endInferenceTime - startInferenceTime
    ++numInferences

    const panelUpdateMilliseconds = 1000
    if (endInferenceTime - lastPanelUpdate >= panelUpdateMilliseconds) {
      const averageInferenceTime = inferenceTimeSum / numInferences
      inferenceTimeSum = 0
      numInferences = 0
      // statsDetector.customMLPanel.update(1000.0 / averageInferenceTime, 120 /* maxValue */)
      lastPanelUpdate = endInferenceTime
    }
  },
}
