import {FaceLandmarker,FilesetResolver} from '@mediapipe/tasks-vision';
export async function createTracker(assetBase='',signal?:AbortSignal,onProgress?:(s:string)=>void){
 const root=new URL(`${assetBase}/`,document.baseURI);
 onProgress?.('Downloading local face model…');
 const response=await fetch(new URL('models/face_landmarker.task',root),{signal});
 if(!response.ok)throw Error(`Face model could not load (HTTP ${response.status}). Check your connection and retry.`);
 const model=new Uint8Array(await response.arrayBuffer());signal?.throwIfAborted();
 onProgress?.('Starting face tracker…');
 const files=await FilesetResolver.forVisionTasks(new URL('wasm',root).href);signal?.throwIfAborted();
 const tracker=await FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetBuffer:model,delegate:'CPU'},runningMode:'VIDEO',numFaces:1,outputFacialTransformationMatrixes:true,outputFaceBlendshapes:false});
 if(signal?.aborted){tracker.close();throw signal.reason;}
 return tracker;
}
export type {FaceLandmarker};
