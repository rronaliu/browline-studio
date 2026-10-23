import * as T from 'three';
/** Original procedural design; arbitrary display units, not optical dimensions. */
export function createFrame(){
 const group=new T.Group(); const dark=new T.MeshStandardMaterial({color:'#201d19',roughness:.3}); const gold=new T.MeshStandardMaterial({color:'#c69b55',metalness:.85,roughness:.25});
 const tube=(pts:T.Vector3[],radius:number,mat:T.Material)=>{const mesh=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),64,radius,8,false),mat);group.add(mesh);};
 for(const side of [-1,1]){const cx=side*.61;const arc=(a:number,b:number)=>Array.from({length:33},(_,i)=>{const t=a+(b-a)*i/32;return new T.Vector3(cx+.51*Math.cos(t),.35*Math.sin(t),0);});tube(arc(0,Math.PI),.055,dark);tube(arc(Math.PI,Math.PI*2),.018,gold);
 tube([new T.Vector3(side*1.12,.02,0),new T.Vector3(side*1.16,.02,-.4),new T.Vector3(side*1.09,-.1,-1.15)],.032,dark);
 const lens=new T.Mesh(new T.CircleGeometry(1,48),new T.MeshPhysicalMaterial({color:'#d9ece9',transparent:true,opacity:.10,roughness:.08,side:T.DoubleSide,depthWrite:false}));lens.scale.set(.49,.33,1);lens.position.set(cx,0,-.01);group.add(lens);
 const rivet=new T.Mesh(new T.SphereGeometry(.025,12,8),gold);rivet.position.set(side*1.01,.15,.055);group.add(rivet);}
 tube([new T.Vector3(-.12,.04,0),new T.Vector3(0,.12,.015),new T.Vector3(.12,.04,0)],.025,gold);return group;
}
export function disposeObject(group:T.Object3D){
 const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();
 group.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});
 for(const m of materials){for(const value of Object.values(m))if(value instanceof T.Texture)textures.add(value);m.dispose();}
 for(const t of textures){const image=t.image;if(typeof ImageBitmap!=='undefined'&&image instanceof ImageBitmap)image.close();t.dispose();}for(const g of geometries)g.dispose();
}
