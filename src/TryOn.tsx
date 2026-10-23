import {useEffect,useRef,useState} from 'react';
import {importModel} from './core/importModel';
import {disposeObject} from './core/frame';
import {CameraSession} from './core/camera';
import {createTracker,type FaceLandmarker} from './core/tracker';
import {TryOnRenderer,type Calibration} from './core/renderer';
export type TryOnProps={calibration:Calibration;mirror:boolean;onStatus:(s:string)=>void;active:boolean;onError:(s:string)=>void;assetBase?:string;modelFile?:File|null;onModelStatus?:(s:string)=>void};
export function TryOn({calibration,mirror,onStatus,active,onError,assetBase=import.meta.env.BASE_URL.replace(/\/$/,''),modelFile=null,onModelStatus}:TryOnProps){
 const rendererRef=useRef<TryOnRenderer|null>(null);
 const video=useRef<HTMLVideoElement>(null),canvas=useRef<HTMLCanvasElement>(null);const settings=useRef(calibration);settings.current=calibration;const [ratio,setRatio]=useState(16/10);
 useEffect(()=>{let cancelled=false,raf=0,tracker:FaceLandmarker|undefined,renderer:TryOnRenderer|undefined,last=-1,lastDetect=0;const session=new CameraSession();const v=video.current!,c=canvas.current!;
 const observer=new ResizeObserver(()=>{const r=c.getBoundingClientRect();renderer?.resize(r.width,r.height);});
 const start=async()=>{try{renderer=new TryOnRenderer(c);rendererRef.current=renderer;observer.observe(c);const r=c.getBoundingClientRect();renderer.resize(r.width,r.height);
 if(active){if(!navigator.mediaDevices?.getUserMedia)throw new Error('Camera unavailable. Use localhost or HTTPS in a supported browser.');onStatus('Requesting camera permission…');const stream=await session.start();if(cancelled||!stream)return;v.srcObject=stream;await v.play();if(cancelled)return;setRatio(v.videoWidth/v.videoHeight);onStatus('Loading local face tracker…');tracker=await createTracker(assetBase);if(cancelled){tracker.close();tracker=undefined;return;}onStatus('Looking for a face…');}else{setRatio(16/10);onStatus('Model preview · camera off');}
 const loop=(time:number)=>{if(cancelled)return;try{if(!active)renderer!.render(null,settings.current,true,time);else if(tracker&&v.readyState>=2&&v.currentTime!==last&&time-lastDetect>45){last=v.currentTime;lastDetect=time;const result=tracker.detectForVideo(v,time);renderer!.render(result,settings.current);onStatus(result.faceLandmarks.length?'Live · face tracked':'Face lost · look toward the camera');}raf=requestAnimationFrame(loop);}catch(e){fail(e);}};raf=requestAnimationFrame(loop);
 }catch(e){fail(e);}};
 const fail=(e:unknown)=>{if(cancelled)return;session.stop();v.srcObject=null;tracker?.close();tracker=undefined;const name=e instanceof Error?e.name:'';onError(name==='NotAllowedError'?'Camera permission denied. You can allow it in browser settings or use model preview.':name==='NotFoundError'?'No camera found. Model preview is available.':e instanceof Error?e.message:'Unable to start try-on.');};void start();
 return()=>{cancelled=true;cancelAnimationFrame(raf);session.stop();v.pause();v.srcObject=null;tracker?.close();observer.disconnect();renderer?.dispose();rendererRef.current=null;};
 },[active,assetBase,onStatus,onError]);
 useEffect(()=>{let stale=false;const renderer=rendererRef.current;if(!renderer)return;
 if(!modelFile){renderer.setModel(null);onModelStatus?.('Original browline frame');return;}
 onModelStatus?.('Loading local model…');void importModel(modelFile).then(model=>{if(stale){disposeObject(model);return;}renderer.setModel(model);onModelStatus?.(`Imported: ${modelFile.name}`);}).catch(e=>{if(!stale)onModelStatus?.(`Import failed: ${e instanceof Error?e.message:'Invalid model'}`);});return()=>{stale=true;};
 },[modelFile,active,assetBase,onModelStatus]);
 return <div className="viewport" style={{aspectRatio:ratio}}><div className="layers" style={{transform:mirror&&active?'scaleX(-1)':undefined}}><video ref={video} muted playsInline style={{visibility:active?'visible':'hidden'}}/><canvas ref={canvas}/></div>{!active&&<span className="preview-label">3D MODEL PREVIEW</span>}</div>;
}
