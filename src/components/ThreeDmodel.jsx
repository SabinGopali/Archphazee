import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds, Center } from '@react-three/drei';

function Model({ path }) {
  const { scene } = useGLTF(path);

  return (
    <Center>
      <primitive object={scene} rotation={[-0.2, 0, 0]} />
    </Center>
  );
}

export default function ThreeDModel({ modelPath }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768); // you can adjust breakpoint as needed
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="w-full h-[60vh] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]"
      style={{
        // On mobile disable pointer events to make canvas untouchable (like image)
        pointerEvents: isMobile ? 'none' : 'auto',
        maxWidth: '730px',
        maxHeight: '600px',
      }}
    >
      <Canvas
        camera={{ position: [0, 1.2, 6], fov: 45 }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Suspense fallback={null}>
          <Bounds fit margin={1}>
            <Model path={modelPath} />
          </Bounds>
        </Suspense>

        {/* Only enable OrbitControls if not mobile */}
        {!isMobile && (
          <OrbitControls
            enablePan={true}
            enableZoom={false}
            enableRotate={true}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        )}
      </Canvas>
    </div>
  );
}
