import * as T from 'three';
import {createFrame,disposeObject} from './frame';
import type {FaceLandmarkerResult} from '@mediapipe/tasks-vision';
export type Calibration={size:number;x:number;y:number;rx?:number;ry?:number;rz?:number};
/** Unmirrored source coordinates. Mirror the entire video/canvas pair in the host. */
export class TryOnRenderer {
 private renderer:T.WebGLRenderer;private scene=new T.Scene();private camera=new T.OrthographicCamera(-1,1,1,-1,.1,20000);private frame=new T.Group();private model=createFrame();private width=1;private height=1;
 constructor(canvas:HTMLCanvasElement){this.renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.camera.position.z=10000;this.scene.add(new T.HemisphereLight(0xffffff,0x665544,3));const light=new T.DirectionalLight(0xffffff,4);light.position.set(2,3,5);this.frame.add(this.model);this.scene.add(light,this.frame);}
 /** Transfers ownership of model geometry/materials to the renderer. */
 setModel(model:T.Group|null){this.frame.remove(this.model);disposeObject(this.model);this.model=model??createFrame();this.frame.add(this.model);}
 resize(w:number,h:number){this.width=w;this.height=h;this.renderer.setSize(w,h,false);this.camera.left=-w/2;this.camera.right=w/2;this.camera.top=h/2;this.camera.bottom=-h/2;this.camera.updateProjectionMatrix();}
 render(result:FaceLandmarkerResult|null,c:Calibration,preview=false,time=0){const points=result?.faceLandmarks[0];this.frame.visible=preview||!!points;
 if(preview){this.frame.position.set(c.x*this.width,c.y*this.height,0);this.frame.scale.setScalar(this.width*.32/2.3*c.size);this.frame.rotation.set(.08,Math.sin(time/2200)*.35,0);}
 else if(points){const a=points[33],b=points[263];const distance=Math.hypot((a.x-b.x)*this.width,(a.y-b.y)*this.height);this.frame.scale.setScalar(distance/1.82*c.size);this.frame.position.set(((a.x+b.x)/2-.5+c.x)*this.width,(.5-(a.y+b.y)/2+c.y)*this.height,0);
 const matrix=result?.facialTransformationMatrixes[0];if(matrix){const m=new T.Matrix4().fromArray(matrix.data);const q=new T.Quaternion();m.decompose(new T.Vector3(),q,new T.Vector3());this.frame.quaternion.copy(q);}else this.frame.rotation.set(0,0,-Math.atan2((b.y-a.y)*this.height,(b.x-a.x)*this.width));}
 this.model.rotation.set(T.MathUtils.degToRad(c.rx??0),T.MathUtils.degToRad(c.ry??0),T.MathUtils.degToRad(c.rz??0));
 this.renderer.render(this.scene,this.camera);}
 dispose(){disposeObject(this.frame);this.renderer.dispose();}
}
