/** Race-safe acquisition: stopping during a permission prompt releases any late stream. */
export class CameraSession {
 private generation=0; private stream?:MediaStream;
 constructor(private acquire:(c:MediaStreamConstraints)=>Promise<MediaStream>=c=>navigator.mediaDevices.getUserMedia(c)){}
 async start(){this.stop();const id=this.generation;const stream=await this.acquire({video:{facingMode:'user',width:{ideal:1280},height:{ideal:720}},audio:false});if(id!==this.generation){stream.getTracks().forEach(t=>t.stop());return null;}this.stream=stream;return stream;}
 stop(){this.generation++;this.stream?.getTracks().forEach(t=>t.stop());this.stream=undefined;}
}
