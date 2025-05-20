import { Suspense, useMemo, type Ref } from 'react';

import { Vector3, type Vector3Tuple } from 'three';

import { animated } from '@react-spring/three';
import { Text } from '@react-three/drei';

import { useMounted } from './hooks/useMounted';
import { type EntityRef } from './types';

export type GroundTextRef = EntityRef;

interface GroundTextProps {
  color?: string;
  // Path to the font file relative to the public directory
  font?: string;
  mountDuration?: number;
  onEnterSpeed?: number;
  position: Vector3 | Vector3Tuple;
  ref?: Ref<GroundTextRef>;
  text: string;
}

// GroundText component to display text aligned with the ground
export const GroundText = ({
  color = '#555',
  font = '/fonts/Nohemi-Light-BF6438cc5702321.woff',
  mountDuration = 500,
  position,
  ref,
  text
}: GroundTextProps) => {
  const { springs } = useMounted({
    mountDuration,
    ref
  });

  const pos = useMemo(
    () =>
      Array.isArray(position)
        ? new Vector3(position[0], position[1], position[2])
        : position,
    [position]
  );
  // const posRef = useRef(pos);

  // const [opacity, setOpacity] = useState(0);
  // const materialRef = useRef<MeshStandardMaterial>(null);

  // useEffect(() => {
  //   if (!posRef.current.equals(pos)) {
  //     setOpacity(0);
  //     posRef.current.copy(pos);
  //   }
  // }, [pos]);

  // useFrame(() => {
  //   if (opacity < 1) {
  //     setOpacity(prev => Math.min(prev + onEnterSpeed, 1));
  //   }
  // });

  return (
    <Suspense fallback={null}>
      <Text
        anchorX="center"
        anchorY="middle"
        color={color}
        font={font}
        fontSize={0.5}
        maxWidth={3}
        position={[pos.x, 0.1, pos.z]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        textAlign="center"
      >
        {text}
        <animated.meshStandardMaterial
          color={color}
          opacity={springs.opacity}
        />
      </Text>
    </Suspense>
  );
};
