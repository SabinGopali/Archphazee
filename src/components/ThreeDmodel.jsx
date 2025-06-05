import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds, Center } from '@react-three/drei';

function Model({ path }) {
  const { scene } = useGLTF(path);

  return (
    <Center>
      {/* Rotate model slightly upward (around X axis) */}
      <primitive object={scene} rotation={[-0.2, 0, 0]} />
    </Center>
  );
}

export default function ThreeDModel({ modelPath }) {
  return (
    <div className="w-full h-[60vh] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]">
      <Canvas
        // Lower Y position from 2 to 1.2 for more upward facing camera
        camera={{ position: [0, 1.2, 6], fov: 45 }}
        style={{ width: '730px', height: '600px', background: 'transparent' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Suspense fallback={null}>
          <Bounds fit margin={1}>
            <Model path={modelPath} />
          </Bounds>
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
}
