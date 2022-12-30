import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import vShaderTint from './shaders/stone/vertexShader.glsl'
import fShaderTint from './shaders/stone/fragmentShader.glsl'
// import { RotateMatrix, MultiplyMatrices, Translate, ScaleMatrix, InvertMatrix } from './calculations/calculations';
import { Calculations } from '../utils/calculations/Calculations'

let model
let stoneModel
let stoneMaterial
let stoneModelLoaded = false
let uniforms
let modelsAll = []

export const getModelsAll = () => { return modelsAll }

export const ModelsLoader = {
  loadModel: (ringPartType, modelPath, matcapTextureWhite, manager) => {
    const loaderModel = new GLTFLoader(manager)
    
    loaderModel.load(
      modelPath,
      (gltf) => {
        model = gltf.scene.children[0]
        //   model.position.set(0, 0, 0);
        model.name = ringPartType
        // ringPartType === 'shank' ? model.position.set(0, 0, 0) : model.position.set(0, 2, 0)
        // ringPartType === 'shank' ? model.scale.set(1, 1, 0) : model.scale.set(0, 0, 0)

        const material2 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          matcap: matcapTextureWhite,
          transparent: true,
          opacity: 1.0
        })
        model.traverse((o) => {
          if (o.isMesh) o.material = material2
        })
        //ringGroup.add(model)
        //threeScene.add(gltf.scene, ringGroup)
        modelsAll.push(model);
      }//,
      // (xhr) => {
      //   console.log((xhr.loaded / xhr.total) * 100 + `% loaded ${modelPath}`)
      // },
      // (error) => {
      //   console.log(`Error in loading shank model:  + ${error}`)
      // }
    )
    return model
  },

  loadStoneModel: (modelPath, viewPos, viewPos2, viewPos3, matrixModel, manager) => {
    let shapeTexturePath = '/assets/shapeTexture/shapeTexture_RND_100.png'
    let hdriPath = '/assets/hdri/HDRI5.png'

    // -------------------- REFLECTION CUBE --------------------
    // [link to create a cubemap from a simple image https://jaxry.github.io/panorama-to-cubemap/]
    // Responsibele for the Model (Shank + Head)
    const pathModel = '/assets/panoramas/cubemap_05/'
    const format = '.jpg'
    const modelPanorama = [
      pathModel + 'px' + format,
      pathModel + 'nx' + format,
      pathModel + 'py' + format,
      pathModel + 'ny' + format,
      pathModel + 'pz' + format,
      pathModel + 'nz' + format,
    ]
    const reflectionCube = new THREE.CubeTextureLoader().load(modelPanorama)

    const loaderStoneModel = new GLTFLoader(manager)

    let shaderParams = {
      contrast: 0.8,
      postExposure: 0.85,
      power: 1.0,
      brightness: 1.075,
      spec: 0.4,
      dispersion: 0.3,
      colorIntensity: 1.0,
      refractiveIndex: 2.47,
      lightTransmission: 0.253,
      baseReflection: 0.4,
    }
    let stonesShapeTexureValues = {
      RND: {
        x: 8,
        y: 8,
        planeCount: 57.0,
        scale: 0.526, //0.3570238,
      },
      ASH: {
        x: 16,
        y: 16,
        planeCount: 65.0,
        scale: 0.526, //0.3476178, // 0.003476178
      },
      CSH: {
        x: 8,
        y: 8,
        planeCount: 53.0,
        scale: 0.526, //0.3481907,
      },
      EMR: {
        x: 16,
        y: 16,
        planeCount: 65.0,
        scale: 0.526, //0.4082697,
      },
      MRQ: {
        x: 8,
        y: 8,
        planeCount: 56.0,
        scale: 0.526, //0.5302359,
      },
      OVL: {
        x: 8,
        y: 8,
        planeCount: 55.0,
        scale: 0.526, //0.4276057,
      },
      PER: {
        x: 8,
        y: 8,
        planeCount: 57.0,
        scale: 0.526, //0.4144538,
      },
      PRNC: {
        x: 8,
        y: 8,
        planeCount: 50.0,
        scale: 0.526, //0.4312665,
      },
      RAD: {
        x: 16,
        y: 16,
        planeCount: 83.0,
        scale: 0.526, //0.3612907,
      },
    }
    let modelParams = {
      stone: 'RND',
    }

    // Uploading HDRI texture for reflections and refractions inside the stone
    let textureHdri = new THREE.TextureLoader().load(hdriPath)
    textureHdri.minFilter = THREE.NearestFilter
    textureHdri.magFilter = THREE.NearestFilter

    // Loading a texture with model data
    const _ShapeTexture = new THREE.TextureLoader().load(shapeTexturePath)
    loaderStoneModel.load(
      modelPath,
      (gltf) => {
        // Loading a stone model
        // The stone is a single object because we need to calculate the matrix for it correctly
        stoneModel = gltf.scene.children[0]
        stoneModel.name = 'stone'
        // stoneModel.position.y = 2.15

        // console.log(stoneModel.geometry)

        viewPos2.copy(viewPos)
        viewPos3.copy(viewPos)

        // Variables that are passed to the shader
        uniforms = {
          _ShapeTex: { type: 't', value: _ShapeTexture }, // assigning a texture for with data
          CameraPos_: { value: viewPos2 }, // I assign the camera position, in the future it will change with a matrix
          _LocalSpaceCameraPos: { value: viewPos3 }, // I assign the camera position, in the future it will change with a matrix
          Matr2: { value: matrixModel }, // filling in the model matrix
          _Environment2: { type: 't', value: textureHdri }, // assigning an HDRI texture
          reflectionCube: { value: reflectionCube }, // I assign an HDRI texture for external reflections
          Contrast: { value: shaderParams.contrast }, // test for changing the float with gui
          PostExposure: { value: shaderParams.postExposure },
          Power: { value: shaderParams.power },
          Brightness: { value: shaderParams.brightness },
          Spec: { value: shaderParams.spec },
          Dispersion: { value: shaderParams.dispersion },
          ColorIntensity: { value: shaderParams.colorIntensity },
          _RefractiveIndex: { value: shaderParams.refractiveIndex },
          _SizeX: { value: stonesShapeTexureValues[modelParams.stone].x },
          _SizeY: { value: stonesShapeTexureValues[modelParams.stone].y },
          _PlaneCount: {
            value: stonesShapeTexureValues[modelParams.stone].planeCount,
          },
          _Scale: { value: stonesShapeTexureValues[modelParams.stone].scale },
          lighttransmission: { value: shaderParams.lightTransmission },
          _BaseReflection: { value: shaderParams.baseReflection },
        }

        // Creating a material with a stone shader
        // stoneMaterial = new THREE.ShaderMaterial({
        //   uniforms: uniforms, // Assigning variables
        //   vertexShader: vShaderTint,
        //   fragmentShader: fShaderTint,
        //   transparent: true,
        //   opacity: 1.0
        // })

        stoneMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000
        })

        stoneModel.traverse((o) => {
          if (o.isMesh) o.material = stoneMaterial
        })
        //ringGroup.add(stoneModel)
        //threeScene.add(gltf.scene, ringGroup)
        stoneModelLoaded = true
        modelsAll.push(stoneModel)
      }//,
      // (xhr) => {
      //   console.log((xhr.loaded / xhr.total) * 100 + `% loaded ${modelPath}`)
      // },
      // (error) => {
      //   console.log(`Error in loading shank model:  + ${error}`)
      // }
    )
    return stoneModel
  },

  runShaderLogic: (object, viewPos, viewPos2, viewPos3, matrixModel, matrixModel2) => {

            // viewPos2.copy( camera.position );

            // matrixModel = RotateMatrix( matrixModel, object.quaternion );

            // matrixModel.multiply( new THREE.Matrix4().makeRotationFromQuaternion( object.quaternion ) );

            // matrixModel.scale( object.scale );

            // let mat = new THREE.Matrix4();

            // mat.set( matrixModel.m00, matrixModel.m01, matrixModel.m02, matrixModel.m03,
            //     matrixModel.m10, matrixModel.m11, matrixModel.m12, matrixModel.m13,
            //     matrixModel.m20, matrixModel.m21, matrixModel.m22, matrixModel.m23,
            //     matrixModel.m30, matrixModel.m31, matrixModel.m32, matrixModel.m33);

            // // InvertMatrix(m);

            // mat.invert();

            // viewPos2.applyMatrix4( mat );
            
            // gem.material.uniforms.CameraPos_.value = viewPos2;

    if (stoneModelLoaded) {
      viewPos2.copy(viewPos)
      viewPos3.copy(viewPos)
      // Calculating the rotation of the model matrix
      matrixModel = Calculations.rotateMatrix(matrixModel, object.quaternion)
      // Calculating the position and size of the model matrix
      matrixModel = Calculations.multiplyMatrices(
        Calculations.translate(object.position),
        Calculations.multiplyMatrices(matrixModel, Calculations.scaleMatrix(object.scale))
      )
      const externalReflectionMatrix = new THREE.Matrix4() // creating a new matrix for external reflections

      externalReflectionMatrix.set(
        matrixModel.m00,
        matrixModel.m01,
        matrixModel.m02,
        matrixModel.m03, // I copy the first matrix into the new one
        matrixModel.m10,
        matrixModel.m11,
        matrixModel.m12,
        matrixModel.m13,
        matrixModel.m20,
        matrixModel.m21,
        matrixModel.m22,
        matrixModel.m23,
        matrixModel.m30,
        matrixModel.m31,
        matrixModel.m32,
        matrixModel.m33
      )

      // Inverting the matrix
      Calculations.invertMatrix(externalReflectionMatrix)
      // Transform the camera position using an inverted matrix
      viewPos2.applyMatrix4(externalReflectionMatrix)

      // Calculating the rotation of the model matrix
      matrixModel2 = Calculations.rotateMatrix(matrixModel2, object.quaternion)
      //  Calculating the size of the model matrix, but I leave the position as in the old matrix
      matrixModel2 = Calculations.multiplyMatrices(
        matrixModel2,
        Calculations.scaleMatrix(object.scale)
      )
      const m2 = new THREE.Matrix4()
      m2.set(
        matrixModel2.m00,
        matrixModel2.m01,
        matrixModel2.m02,
        matrixModel2.m03, // I copy the second matrix into another new matrix
        matrixModel2.m10,
        matrixModel2.m11,
        matrixModel2.m12,
        matrixModel2.m13,
        matrixModel2.m20,
        matrixModel2.m21,
        matrixModel2.m22,
        matrixModel2.m23,
        matrixModel2.m30,
        matrixModel2.m31,
        matrixModel2.m32,
        matrixModel2.m33
      )
      Calculations.invertMatrix(m2)
      viewPos3.applyMatrix4(m2)

      // Be sure to assign the following values to this function
      // I pass the model matrix to the shader for correct refractions
      stoneMaterial.uniforms.Matr2.value = m2
      // I pass the converted camera position to the shader
      stoneMaterial.uniforms.CameraPos_.value = viewPos2
      // I pass the converted camera position in the local position to the shader
      stoneMaterial.uniforms._LocalSpaceCameraPos.value = viewPos3
    }
  },
}
