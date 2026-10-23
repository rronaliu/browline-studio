import {useEffect,useRef,useState,type ReactNode} from 'react';
import {importModel} from './core/importModel';
import {disposeObject} from './core/frame';
import {CameraSession} from './core/camera';
import {containRect} from './core/layout';
import {createTracker,type FaceLandmarker} from './core/tracker';
import {TryOnRenderer,type Calibration} from './core/renderer';
export type TryOnProps={overlay?:ReactNode;calibration:Calibration;mirror:boolean;onStatus:(s:string)=>void;active:boolean;onError:(s:string)=>void;assetBase?:string;modelFile?:File|null;onModelStatus?:(s:string)=>void};
export function TryOn({calibration,mirror,onStatus,active,onError,assetBase=import.meta.env.BASE_URL.replace(/\/$/,''),modelFile=null,onModelStatus,overlay}:TryOnProps){
 const host=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null),canvas=useRef<HTMLCanvasElement>(null),rendererRef=useRef<TryOnRenderer|null>(null);
 const settings=useRef(calibration);settings.current=calibration;
 const [source,setSource]=useState({width:16,height:10}),[viewport,setViewport]=useState({width:0,height:0}),[loading,setLoading]=useState(false);
 // Safari can update camera dimensions after play() and again after device rotation.
 useEffect(()=>{const v=video.current!;const update=()=>{if(v.videoWidth>0&&v.videoHeight>0)setSource({width:v.videoWidth,height:v.videoHeight});};
 for(const event of ['loadedmetadata','loadeddata','resize'])v.addEventListener(event,update);
 return()=>{for(const event of ['loadedmetadata','loadeddata','resize'])v.removeEventListener(event,update);};},[]);
 useEffect(()=>{const element=host.current!;const measure=()=>{const width=element.clientWidth;const height=Math.min(width*source.height/source.width,window.innerHeight*.7);setViewport({width,height});};
 const observer=new ResizeObserver(measure);observer.observe(element);window.addEventListener('resize',measure);measure();return()=>{observer.disconnect();window.removeEventListener('resize',measure);};},[source]);
 const rect=containRect(source.width,source.height,viewport.width,viewport.height);const rectRef=useRef(rect);rectRef.current=rect;
 useEffect(()=>{rendererRef.current?.resize(rect.width,rect.height);},[rect.width,rect.height]);
 useEffect(()=>{
 let cancelled=false,raf=0,tracker:FaceLandmarker|undefined,renderer:TryOnRenderer|undefined,last=-1,lastDetect=0,startupTimer:ReturnType<typeof setTimeout>|undefined;
 const session=new CameraSession(),abort=new AbortController();const v=video.current!,c=canvas.current!;
 const fail=(error:unknown)=>{if(cancelled)return;cancelled=true;clearTimeout(startupTimer);cancelAnimationFrame(raf);abort.abort();session.stop();v.pause();v.srcObject=null;tracker?.close();tracker=undefined;renderer?.render(null,settings.current,false);setLoading(false);
 const detail=error&&typeof error==='object'?error as {name?:string;message?:string}:{};
 onError(detail.name==='NotAllowedError'?'Camera permission denied. You can allow it in browser settings or use model preview.':detail.name==='NotFoundError'?'No camera found. Model preview is available.':detail.message??'Unable to start try-on.');};
 const loop=(time:number)=>{if(cancelled)return;try{if(!active)renderer!.render(null,settings.current,true,time);else if(tracker&&v.readyState>=2&&v.currentTime!==last&&time-lastDetect>45){last=v.currentTime;lastDetect=time;const result=tracker.detectForVideo(v,time);renderer!.render(result,settings.current);onStatus(result.faceLandmarks.length?'Live · face tracked':'Face lost · look toward the camera');}raf=requestAnimationFrame(loop);}catch(error){fail(error);}};
 const start=async()=>{try{
 renderer=new TryOnRenderer(c);rendererRef.current=renderer;renderer.resize(rectRef.current.width,rectRef.current.height);renderer.render(null,settings.current,false);setLoading(active);
 if(!active){setSource({width:16,height:10});onStatus('Model preview · camera off');raf=requestAnimationFrame(loop);return;}
 if(!navigator.mediaDevices?.getUserMedia)throw Error('Camera unavailable. Use HTTPS in a supported browser.');
 onStatus('Requesting camera permission…');const stream=await session.start();if(cancelled||!stream)return;
 // Bound metadata/play/model startup, but never time out the user's permission decision.
 startupTimer=setTimeout(()=>fail(Error('Camera/tracker startup timed out. Check your connection, then retry Start camera.')),45000);
 v.srcObject=stream;await v.play();if(cancelled)return;
 if(v.videoWidth>0&&v.videoHeight>0)setSource({width:v.videoWidth,height:v.videoHeight});
 const loaded=await createTracker(assetBase,abort.signal,s=>{if(!cancelled)onStatus(s);});if(cancelled){loaded.close();return;}tracker=loaded;clearTimeout(startupTimer);setLoading(false);onStatus('Looking for a face…');raf=requestAnimationFrame(loop);
 }catch(error){fail(error);}};void start();
 return()=>{cancelled=true;clearTimeout(startupTimer);abort.abort();cancelAnimationFrame(raf);session.stop();v.pause();v.srcObject=null;tracker?.close();renderer?.dispose();rendererRef.current=null;};
 },[active,assetBase,onStatus,onError]);
 useEffect(()=>{let stale=false;const renderer=rendererRef.current;if(!renderer)return;
 if(!modelFile){renderer.setModel(null);onModelStatus?.('Original browline frame');return;}
 onModelStatus?.('Loading local model…');void importModel(modelFile).then(model=>{if(stale){disposeObject(model);return;}renderer.setModel(model);onModelStatus?.(`Imported: ${modelFile.name}`);}).catch(error=>{if(!stale)onModelStatus?.(`Import failed: ${error instanceof Error?error.message:'Invalid model'}`);});return()=>{stale=true;};
 },[modelFile,active,assetBase,onModelStatus]);
 return <div ref={host} className="viewport" style={{height:viewport.height||undefined}} data-source-width={source.width} data-source-height={source.height}>
 <div className="layers" style={{left:rect.x,top:rect.y,width:rect.width,height:rect.height,transform:mirror&&active?'scaleX(-1)':undefined}}><video ref={video} muted playsInline style={{visibility:active?'visible':'hidden'}}/><canvas ref={canvas} style={{visibility:active&&loading?'hidden':'visible'}}/></div>
 {active&&loading&&<span className="loading-label" role="status">Preparing camera &amp; face tracking…<br/>The frame appears after a face is detected.</span>}
 {!active&&<span className="preview-label">3D MODEL PREVIEW</span>}{overlay}</div>;
}
