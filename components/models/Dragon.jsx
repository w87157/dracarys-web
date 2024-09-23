import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

export function Model(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/models/dragon.glb');
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    
    actions[names[0]]?.play();
   
    return () => {
      names.forEach(name => actions[name]?.stop());
    };
  }, [actions, names]);

  
  const switchAnimation = (name) => {
    names.forEach(animationName => actions[animationName]?.stop()); 
    actions[name]?.play(); 
  };

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="AuxScene">
        <group name="Sketchfab_Scene">
          <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0.15, 0]} scale={3.829 * 4.2} position={[0, -7, -2]} >
            <group name="root">
              <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
                <group name="RootNode0_222" scale={0.01}>
                  <group name="skeletal3_221">
                    <group name="GLTF_created_0">
                      <primitive object={nodes.GLTF_created_0_rootJoint} />
                      <skinnedMesh
                        name="Object_8"
                        geometry={nodes.Object_8.geometry}
                        material={materials.Material_0}
                        skeleton={nodes.Object_8.skeleton}
                      />
                      <skinnedMesh
                        name="Object_9"
                        geometry={nodes.Object_9.geometry}
                        material={materials.Material_0}
                        skeleton={nodes.Object_9.skeleton}
                      />
                      <skinnedMesh
                        name="Object_10"
                        geometry={nodes.Object_10.geometry}
                        material={materials.Material_0}
                        skeleton={nodes.Object_10.skeleton}
                      />
                      <group name="dragon_wings22_220" />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/dragon.glb');
