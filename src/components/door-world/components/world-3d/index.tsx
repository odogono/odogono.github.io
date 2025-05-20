import { useCallback, useRef } from 'react';

import { useDungeon } from '@door-world/contexts/dungeon/use-dungeon';
import { createLog } from '@helpers/log';
import { Canvas } from '@react-three/fiber';

import { MiniMap } from '../world-2d/components/mini-map';
import { Dungeon } from './components/dungeon';
import {
  IsometricCamera,
  type IsometricCameraMoveToProps,
  type IsometricCameraRef
} from './components/isometric-camera';

const log = createLog('World3D');

interface World3DProps {
  showMiniMap: boolean;
}

export const World3D = ({ showMiniMap }: World3DProps) => {
  const cameraRef = useRef<IsometricCameraRef>(null);

  const handleMoveCameraTo = useCallback(
    async (props: IsometricCameraMoveToProps) => {
      await cameraRef.current?.moveTo(props);
    },
    []
  );

  return (
    <>
      <Canvas gl={{ localClippingEnabled: true }}>
        <IsometricCamera
          initialPosition={[0, 0, -2]}
          initialZoom={100}
          ref={cameraRef}
        />

        {/* <XYZAxis /> */}
        <Dungeon moveCameraTo={handleMoveCameraTo} />

        {/* <Grid
          cellSize={0.1}
          infiniteGrid
          renderOrder={3}
          sectionColor="black"
          sectionSize={1}
        /> */}

        <ambientLight intensity={0.1} />
        <directionalLight intensity={2} position={[10, 10, 5]} />
      </Canvas>
      {showMiniMap && <DungeonMiniMap />}
    </>
  );
};

const DungeonMiniMap = () => {
  const { dungeon } = useDungeon();

  return <MiniMap dungeon={dungeon} />;
};
