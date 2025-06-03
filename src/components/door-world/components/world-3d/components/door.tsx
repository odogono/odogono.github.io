import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type Ref
} from 'react';

import { Plane as ThreePlane, Vector3, type Vector3Tuple } from 'three';

import {
  applyClippingPlanesToObject,
  applyColor
} from '@door-world/helpers/three';
import { createLog } from '@helpers/log';
import { animated, easings, useSpring } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';

import { useMounted } from './hooks/use-mounted';
import type { EntityRef } from './types';

interface DoorProps {
  doorColor?: string;
  frameColor?: string;
  id: string;
  isMounted?: boolean;
  isOpen?: boolean;
  mountDuration?: number;
  onTouch?: (event: ThreeEvent<MouseEvent>) => void;
  openDuration?: number;
  position: Vector3;
  ref: Ref<DoorRef>;
  rotationY?: number;
  scale?: Vector3Tuple;
}

export type DoorRef = EntityRef & {
  open: () => Promise<boolean>;
  setOpen: (open: boolean) => Promise<boolean>;
  toggleOpen: () => Promise<boolean>;
};

const log = createLog('Door');

export const Door = ({
  doorColor = '#83D5FF',
  frameColor = '#FFF',
  id,
  isMounted: isMountedProp = false,
  isOpen: isOpenProp = false,
  mountDuration = 500,
  onTouch,
  openDuration = 750,
  position = new Vector3(0, 0, 0),
  ref,
  rotationY = -Math.PI / 2,
  scale = [1, 1, 1]
}: DoorProps) => {
  const gltf = useGLTF('/door-world/vbasic.door.glb');

  // clone the scene to avoid mutating the original
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  const doorObject = useMemo(() => scene.getObjectByName('door'), [scene]);
  const frameObject = useMemo(
    () => scene.getObjectByName('door-frame'),
    [scene]
  );

  const localClippingPlane = useMemo(
    () => new ThreePlane(new Vector3(0, 1, 0), 0),
    []
  );

  const isOpen = useRef(isOpenProp);

  const [openDoorSpring, openDoorApi] = useSpring(() => ({
    rotation: [0, isOpen.current ? Math.PI / 2 : 0, 0]
  }));

  const { springs: mountingSpring, startTransitionAnimation } = useMounted({
    initialValues: (isMounted: boolean) => ({
      opacity: isMounted ? 1 : 0,
      position: [position.x, isMounted ? 0 : -1.1, position.z]
    }),
    ref,
    targetValues: (isMounted: boolean) => ({
      duration: isMounted ? mountDuration / 2 : mountDuration,
      opacity: isMounted ? 0 : 1,
      position: [position.x, isMounted ? -1.1 : 0, position.z]
    })
  });

  const startDoorAnimation = useCallback(
    (open: boolean) =>
      new Promise<boolean>(resolve => {
        if (isOpen.current === open) {
          resolve(isOpen.current);
          return;
        }

        const targetRotation = isOpen.current ? 0 : Math.PI / 2;

        const duration = open ? openDuration : openDuration / 2;

        openDoorApi.start({
          config: { duration, easing: easings.easeInOutSine },
          onRest: () => {
            isOpen.current = open;
            resolve(isOpen.current);
          },
          rotation: [0, targetRotation, 0]
        });
      }),
    [openDuration, openDoorApi]
  );

  useImperativeHandle(ref, () => ({
    close: () => startDoorAnimation(false),
    // annoying that the mount/unmount methods have to be redefined here
    mount: () => startTransitionAnimation(true),
    open: () => startDoorAnimation(true),
    setOpen: (isOpen: boolean) => startDoorAnimation(isOpen),
    toggleOpen: () => startDoorAnimation(!isOpen.current),
    unmount: () => startTransitionAnimation(false)
  }));

  useEffect(() => {
    if (!doorObject || !frameObject) {
      log.debug('Door or frame node not found');
      return;
    }

    applyColor(doorObject, doorColor);

    applyColor(frameObject, frameColor);

    applyClippingPlanesToObject(frameObject, [localClippingPlane]);
    applyClippingPlanesToObject(doorObject, [localClippingPlane]);
  }, [
    scene,
    frameColor,
    doorColor,
    localClippingPlane,
    doorObject,
    frameObject
  ]);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      onTouch?.(event);
    },
    [onTouch]
  );

  // log.debug('door', id, { isOpenProp });
  return (
    <animated.group position={mountingSpring.position}>
      <group position={[0, 0.5, 0]} rotation={[0, rotationY, 0]} scale={scale}>
        {frameObject && (
          <animated.primitive
            dispose={null}
            material-opacity={mountingSpring.opacity}
            material-transparent={true}
            object={frameObject}
          />
        )}
        {doorObject && (
          <animated.primitive
            dispose={null}
            material-opacity={mountingSpring.opacity}
            material-transparent={true}
            object={doorObject}
            rotation={openDoorSpring.rotation}
          />
        )}
      </group>
      <mesh onClick={handleClick} position={[0, 0.5, 0]} visible={false}>
        <boxGeometry args={[0.8, 1, 0.4]} />
      </mesh>
    </animated.group>
  );
};

// Preload the model
// useGLTF.preload('/vbasic.door.glb');
