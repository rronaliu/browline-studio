/** One contain rectangle shared by video and 3D projection; no stretched pixels. */
export function containRect(sourceWidth:number,sourceHeight:number,width:number,height:number){
 if(![sourceWidth,sourceHeight,width,height].every(v=>Number.isFinite(v)&&v>0))return {x:0,y:0,width:0,height:0};
 const scale=Math.min(width/sourceWidth,height/sourceHeight);const w=sourceWidth*scale,h=sourceHeight*scale;
 return{x:(width-w)/2,y:(height-h)/2,width:w,height:h};
}
