import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {disposeObject} from './frame';
export const MAX_MODEL_BYTES=20*1024*1024;
const allowedData=/^data:(application\/(octet-stream|gltf-buffer)|image\/(png|jpeg|webp));base64,/i;
/** Validate before the loader can fetch dependencies. Only embedded GLB/glTF is accepted. */
export function validateModel(data:ArrayBuffer,name:string){
 if(data.byteLength>MAX_MODEL_BYTES)throw Error('Model exceeds the 20 MB limit.');
 let json:string;
 if(name.toLowerCase().endsWith('.glb')){
  if(data.byteLength<20)throw Error('Invalid GLB header.');const view=new DataView(data);
  if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==data.byteLength)throw Error('Invalid GLB 2.0 file.');
  const length=view.getUint32(12,true);if(view.getUint32(16,true)!==0x4e4f534a||20+length>data.byteLength)throw Error('Invalid GLB JSON chunk.');json=new TextDecoder().decode(data.slice(20,20+length));
 }else if(name.toLowerCase().endsWith('.gltf'))json=new TextDecoder().decode(data);else throw Error('Choose a .glb or self-contained .gltf file.');
 let doc:Record<string,unknown>;try{doc=JSON.parse(json);}catch{throw Error('Model JSON is invalid.');}
 if(!doc||typeof doc!=='object'||(doc.asset as {version?:string})?.version!=='2.0')throw Error('Only glTF 2.0 models are supported.');
 const visit=(v:unknown)=>{if(Array.isArray(v)){v.forEach(visit);return;}if(v&&typeof v==='object')for(const[key,value]of Object.entries(v)){if(key==='uri'&&(typeof value!=='string'||!allowedData.test(value)))throw Error('External asset URIs are blocked. Embed all buffers and PNG/JPEG/WebP textures in one file.');visit(value);}};visit(doc);
 if((doc.extensionsRequired as string[]|undefined)?.some(v=>!['KHR_materials_unlit','KHR_materials_clearcoat','KHR_materials_transmission','KHR_materials_ior','KHR_materials_specular'].includes(v)))throw Error('This model requires an unsupported extension. Export without compression or external decoders.');
 for(const[key,max]of [['scenes',1],['nodes',512],['meshes',128],['materials',128],['textures',64]] as const)if(Array.isArray(doc[key])&&doc[key].length>max)throw Error(`Model has too many ${key} (limit ${max}).`);
 const accessors=doc.accessors as {count?:number}[]|undefined;if(accessors?.some(a=>!Number.isFinite(a.count)||a.count!<0||a.count!>600000))throw Error('Model geometry is too large or invalid.');
 const images=doc.images as {mimeType?:string}[]|undefined;if(images?.some(i=>i.mimeType&&!['image/png','image/jpeg','image/webp'].includes(i.mimeType)))throw Error('Use embedded PNG, JPEG or WebP textures.');
 return json;
}
export async function importModel(file:File):Promise<T.Group>{
 if(file.size>MAX_MODEL_BYTES)throw Error('Model exceeds the 20 MB limit.');const data=await file.arrayBuffer();const json=validateModel(data,file.name);
 const manager=new T.LoadingManager();manager.setURLModifier(url=>{if(allowedData.test(url)||url.startsWith('blob:'))return url;throw Error('External model resource fetch blocked.');});
 const loader=new GLTFLoader(manager);const gltf=await loader.parseAsync(file.name.toLowerCase().endsWith('.glb')?data:json,'');
 const group=new T.Group();group.add(gltf.scene);
 try{let vertices=0,triangles=0;group.traverse(o=>{if(o instanceof T.Mesh){vertices+=o.geometry.getAttribute('position')?.count??0;triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position')?.count??0)/3;for(const material of Array.isArray(o.material)?o.material:[o.material])for(const value of Object.values(material))if(value instanceof T.Texture){const image=value.image;if(image&&(image.width>4096||image.height>4096))throw Error('Textures must be no larger than 4096 × 4096.');}}});
 if(vertices>200000||triangles>200000)throw Error('Model must contain at most 200,000 vertices and triangles.');
 const box=new T.Box3().setFromObject(group),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());if(!vertices||!Number.isFinite(size.length())||size.x<1e-7||size.length()>1e12)throw Error('Model needs finite, visible mesh geometry with a nonzero width.');
 // Normalize longest dimension to match the original frame. Host calibration handles orientation.
 gltf.scene.position.sub(center);group.scale.setScalar(2.3/Math.max(size.x,size.y,size.z));const normalized=new T.Group();normalized.add(group);return normalized;
 }catch(error){disposeObject(group);throw error;}
}
