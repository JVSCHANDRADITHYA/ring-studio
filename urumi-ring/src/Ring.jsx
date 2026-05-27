import { useGLTF } from "@react-three/drei"
import { useEffect } from "react"
import * as THREE from "three"

const METALS = {

white:{
color:"#ECECEC",
roughness:0.16,
env:2.2
},

yellow:{
color:"#d4af37",
roughness:0.10,
env:3.6
},

rose:{
color:"#D89A8D",
roughness:0.12,
env:3.2
},

platinum:{
color:"#D1D4D9",
roughness:0.18,
env:2.6
},

palladium:{
color:"#BFC2C6",
roughness:0.24,
env:2.1
}

}



export default function Ring({

metal,
stone

}){

const {
scene
}
=
useGLTF(
"/ring_4.glb"
)



useEffect(()=>{


scene.traverse((obj)=>{


// -----------------------------------
// STONE VISIBILITY
// -----------------------------------

if(
obj.name==="StoneRound"
){

obj.visible=
stone==="round"

}

if(
obj.name==="StoneOval"
){

obj.visible=
stone==="oval"

}

if(
obj.name==="StonePear"
){

obj.visible=
stone==="pear"

}

if(
obj.name==="StonePrincess"
){

obj.visible=
stone==="princess"

}



// -----------------------------------
// ONLY MESHES BELOW
// -----------------------------------

if(!obj.isMesh)
return




// -----------------------------------
// METAL
// -----------------------------------

if(
obj.name==="RingRoot"
){

obj.material=
obj.material.clone()

obj.material.color.set(
METALS[
metal
].color
)

obj.material.metalness=
0.9

obj.material.roughness=
METALS[
metal
].roughness

obj.material.envMapIntensity=
METALS[
metal
].env

obj.material.clearcoat=
1

obj.material.clearcoatRoughness=
0.02

}




// -----------------------------------
// DIAMONDS
// -----------------------------------

if(

obj.name==="StoneOval"
||
obj.name==="StoneRound"
||
obj.name==="StonePear"
||
obj.name==="StonePrincess"

){

obj.material =
new THREE.MeshPhysicalMaterial({

color:"#f7f7f7",

transmission:0.92,

ior:2.42,

thickness:0.3,

roughness:0,

metalness:0,

clearcoat:1,

clearcoatRoughness:0,

envMapIntensity:3,

transparent:true,

side:THREE.DoubleSide,

attenuationDistance:0.35,

attenuationColor:"#ffffff"

})

}

})

},
[
metal,
stone,
scene
]
)



return(

<primitive
object={
scene
}
/>

)

}