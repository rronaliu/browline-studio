import {FaceLandmarker,FilesetResolver} from '@mediapipe/tasks-vision';
export async function createTracker(assetBase=''){
 const files=await FilesetResolver.forVisionTasks(`${assetBase}/wasm`);
 return FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:`${assetBase}/models/face_landmarker.task`,delegate:'CPU'},runningMode:'VIDEO',numFaces:1,outputFacialTransformationMatrixes:true,outputFaceBlendshapes:false});
}
export type {FaceLandmarker};
