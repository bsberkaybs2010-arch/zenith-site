import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Space(){
  const points=useRef<THREE.Points>(null),group=useRef<THREE.Group>(null),[mobile,setMobile]=useState(false),[visible,setVisible]=useState(true)
  useEffect(()=>{const check=()=>setMobile(innerWidth<720);check();addEventListener('resize',check);return()=>removeEventListener('resize',check)},[])
  useEffect(()=>{const target=document.querySelector('.hero-webgl');if(!target)return;const io=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'120px'});io.observe(target);return()=>io.disconnect()},[])
  const positions=useMemo(()=>{const a=new Float32Array(1500*3);for(let i=0;i<1500;i++){a[i*3]=(Math.random()-.5)*45;a[i*3+1]=(Math.random()-.5)*28;a[i*3+2]=(Math.random()-.5)*30}return a},[])
  useFrame(({pointer,clock})=>{if(points.current){points.current.rotation.y=clock.elapsedTime*.008;points.current.rotation.x=pointer.y*.018}if(group.current){group.current.rotation.y+=.0015;group.current.rotation.x=Math.sin(clock.elapsedTime*.12)*.08;group.current.position.x=pointer.x*(mobile?.05:.18);group.current.position.y=pointer.y*(mobile?.04:.12)}})
  return <Canvas frameloop={visible?'always':'never'} dpr={mobile?1:[1,1.4]} camera={{position:[0,0,8],fov:48}} gl={{alpha:true,antialias:false,powerPreference:'low-power'}}>
    <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color="#d7e5ff" size={mobile?.04:.036} transparent opacity={.92} sizeAttenuation/></points>
    <group ref={group} position={[2.9,.1,-1]} scale={mobile?.72:1}>
      <mesh rotation={[.35,.3,.15]}><icosahedronGeometry args={[1.55,2]}/><meshStandardMaterial color="#453085" metalness={.68} roughness={.29} emissive="#653bc1" emissiveIntensity={.7} flatShading/></mesh>
      <mesh rotation={[.35,.3,.15]}><icosahedronGeometry args={[1.58,2]}/><meshBasicMaterial color="#a17aff" wireframe transparent opacity={.46}/></mesh>
      <mesh rotation={[1.15,.25,.1]}><torusGeometry args={[2.15,.012,8,150]}/><meshBasicMaterial color="#49dfff" transparent opacity={.9}/></mesh>
      <mesh rotation={[.3,1.1,.8]}><torusGeometry args={[2.38,.009,8,150]}/><meshBasicMaterial color="#ba75ff" transparent opacity={.55}/></mesh>
    </group>
    <ambientLight intensity={.65}/><pointLight position={[1,2,4]} color="#9582ff" intensity={18}/><pointLight position={[-4,-2,1]} color="#16d9fa" intensity={11}/>
  </Canvas>
}
