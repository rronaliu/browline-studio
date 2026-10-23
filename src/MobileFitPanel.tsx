import {useRef,useState} from 'react';
import type {Calibration} from './core/renderer';
const controls={size:{label:'Frame size',min:.1,max:3,step:.01},x:{label:'Horizontal',min:-.15,max:.15,step:.005},y:{label:'Vertical',min:-.3,max:.3,step:.005}} as const;
/** Demo UI only. Hosts can supply their own controls through TryOn's overlay slot. */
export function MobileFitPanel({value,onChange,onReset}:{value:Calibration;onChange:(value:Calibration)=>void;onReset:()=>void}){
 const [open,setOpen]=useState(false),[field,setField]=useState<keyof typeof controls>('size');const toggle=useRef<HTMLButtonElement>(null);const control=controls[field];
 return <section className="mobile-fit" aria-label="Mobile fit controls" data-open={open} onKeyDown={event=>{if(event.key==='Escape'&&open){setOpen(false);toggle.current?.focus();}}}>
 <div className="mobile-fit-bar"><button ref={toggle} type="button" aria-expanded={open} aria-controls="mobile-fit-settings" onClick={()=>setOpen(!open)}>{open?'Close fit controls':'Adjust fit'} <span aria-hidden="true">{open?'⌄':'⌃'}</span></button>{open&&<button type="button" className="mobile-fit-reset" onClick={onReset}>Reset fit</button>}</div>
 <div id="mobile-fit-settings" className="mobile-fit-row" hidden={!open}>
 <select aria-label="Fit adjustment" value={field} onChange={event=>setField(event.target.value as keyof typeof controls)}>{Object.entries(controls).map(([key,config])=><option key={key} value={key}>{config.label}</option>)}</select>
 <input key={field} aria-label={control.label} type="range" min={control.min} max={control.max} step={control.step} value={value[field]} onChange={event=>onChange({...value,[field]:+event.target.value})}/><output aria-hidden="true">{Math.round(value[field]*100)}%</output>
 </div></section>;
}
