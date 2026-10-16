import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Car({color,player=true,lane=0}:{color:string;player?:boolean;lane?:number}){
  const group=useRef<THREE.Group>(null)
  useFrame(({clock},dt)=>{if(!group.current)return;if(player){group.current.position.x=THREE.MathUtils.damp(group.current.position.x,lane*2.15,5,dt);group.current.rotation.z=THREE.MathUtils.damp(group.current.rotation.z,-(lane*2.15-group.current.position.x)*.12,4,dt)}else{group.current.position.z=((clock.elapsedTime*15)%88)-72}})
  return <group ref={group} position={[0,0,player?3:-36]}>
    <mesh position={[0,.36,0]} castShadow><boxGeometry args={[1.02,.46,1.62]}/><meshStandardMaterial color={color} metalness={.68} roughness={.24} emissive={color} emissiveIntensity={.45}/></mesh>
    <mesh position={[0,.67,-.12]} castShadow><boxGeometry args={[.73,.32,.72]}/><meshStandardMaterial color="#181426" metalness={.8} roughness={.2} emissive={color} emissiveIntensity={.12}/></mesh>
    {[-.36,.36].map(x=><mesh key={x} position={[x,.19,.51]}><boxGeometry args={[.18,.09,.035]}/><meshBasicMaterial color="#dffaff"/></mesh>)}
    {[-.42,.42].map(x=><mesh key={x} position={[x,.2,-.42]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.17,.17,.12,12]}/><meshStandardMaterial color="#080910" metalness={.2} roughness={.8}/></mesh>)}
    <pointLight position={[0,.5,-.9]} color={color} intensity={player?2.8:1.5} distance={6}/>
  </group>
}
function Road({color,active,playerLane}:{color:string;active:boolean;playerLane:number}){
  const marks=useRef<THREE.Group>(null),city=useRef<THREE.Group>(null),traffic=useRef<THREE.Group>(null)
  useFrame(({clock})=>{if(!active)return;const t=clock.elapsedTime;if(marks.current)marks.current.position.z=(t*19)%8;if(city.current)city.current.position.z=(t*12)%16;if(traffic.current)traffic.current.children.forEach((child,i)=>{child.position.z=((t*(13+i*1.6)+i*21)%92)-82})})
  const dashes=useMemo(()=>Array.from({length:18},(_,i)=>i),[]),blocks=useMemo(()=>Array.from({length:18},(_,i)=>({x:(i%2?1:-1)*(7+Math.random()*5),z:-i*9-10,h:3+Math.random()*10,w:1.2+Math.random()*2})),[])
  return <>
    <color attach="background" args={['#070910']}/><fog attach="fog" args={['#070910',25,90]}/>
    <ambientLight intensity={.52}/><pointLight position={[1,8,4]} color="#8b6fff" intensity={30}/><pointLight position={[-6,3,-8]} color="#39dcff" intensity={18}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.1,-35]}><planeGeometry args={[80,110]}/><meshStandardMaterial color="#070910"/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.045,-35]}><planeGeometry args={[13,100]}/><meshStandardMaterial color="#0b0d18" metalness={.43} roughness={.57}/></mesh>
    {[-5.25,-1.75,1.75,5.25].map((x,i)=><mesh key={x} position={[x,.02,-35]}><boxGeometry args={[.035,.035,100]}/><meshBasicMaterial color={i===0||i===3?color:'#394061'}/></mesh>)}
    <group ref={marks}>{dashes.flatMap((i)=>([-1.75,1.75].map((x,j)=><mesh key={`${i}-${j}`} position={[x,.025,-i*5]}><boxGeometry args={[.025,.018,2.4]}/><meshBasicMaterial color={color} transparent opacity={.65}/></mesh>)))}</group>
    <group ref={city}>{blocks.map((b,i)=><group key={i} position={[b.x,b.h/2-0.04,b.z]}><mesh><boxGeometry args={[b.w,b.h,2.3]}/><meshStandardMaterial color="#111326" metalness={.65} roughness={.37} emissive={i%2?'#16102b':'#0b2735'} emissiveIntensity={.48}/></mesh><mesh position={[0,0,1.17]}><boxGeometry args={[b.w*.6,b.h*.78,.025]}/><meshBasicMaterial color={i%2?'#a36aff':'#3be6ff'} transparent opacity={.19}/></mesh></group>)}</group>
    <group ref={traffic}>{[-1,0,1].map((lane,i)=><group key={lane} position={[lane*2.15,0,-i*27-18]}><Car color={i%2?'#ff558b':'#ffb660'} player={false}/></group>)}</group>
    <Car color={color} lane={playerLane}/>
    <mesh position={[0,7,-24]} rotation={[0,0,Math.PI/2]}><torusGeometry args={[8,.012,6,100]}/><meshBasicMaterial color={color} transparent opacity={.28}/></mesh>
  </>
}
export default function RacerWorld({color,active,playerLane}:{color:string;active:boolean;playerLane:number}){return <div className="racer-world"><Canvas frameloop={active?'always':'never'} dpr={[1,1.35]} camera={{position:[0,4.3,10],fov:61}} gl={{alpha:false,antialias:false,powerPreference:'low-power'}}><Road color={color} active={active} playerLane={playerLane}/></Canvas></div>}
