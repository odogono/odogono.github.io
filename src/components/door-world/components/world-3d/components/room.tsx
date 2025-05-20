import { useMemo, useRef, type Ref } from 'react';

import { Vector3 } from 'three';

import { useDungeon } from '@door-world/contexts/dungeon/use-dungeon';
import { useTheme } from '@door-world/contexts/theme/context';
import { FloorType, type Room as RoomModel } from '@door-world/model/dungeon';
import {
  darkenColor,
  getComputedColor,
  getContrastColor
} from '@helpers/colour';
import { createLog } from '@helpers/log';
import { animated } from '@react-spring/three';
import { Plane } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';

import { GroundText, type GroundTextRef } from './ground-text';
import { useMounted } from './hooks/useMounted';
import { type EntityRef } from './types';

const log = createLog('Room');

export type RoomRef = EntityRef;

export interface RoomTouchEvent {
  local: Vector3;
  room: RoomModel;
  world: Vector3;
}

interface RoomProps {
  mountDuration?: number;
  onTouch?: (event: RoomTouchEvent) => void;
  ref?: Ref<RoomRef>;
  renderOrder?: number;
  room?: RoomModel;
}

const SCALE = 0.06;

export const Room = ({
  mountDuration = 500,
  onTouch,
  ref,
  renderOrder,
  room
}: RoomProps) => {
  const { dungeon } = useDungeon();
  const textRef = useRef<GroundTextRef>(null);
  const { springs } = useMounted({
    mountDuration,
    onMount: async () =>
      // log.debug('Mounted', room?.id);

      // runAfter(3000, () => textRef.current?.unmount());
      true,
    onUnmount: () => {
      if (textRef.current) {
        return textRef.current.unmount();
      }
      return Promise.resolve(true);
    },
    ref
  });

  const position = useMemo(() => {
    if (!room) {
      return null;
    }
    const { height, width, x, y } = room.area;

    return new Vector3(
      x * SCALE + (width * SCALE) / 2,
      -0.001,
      y * SCALE + (height * SCALE) / 2
    );

    // return new Vector3(room.area.x, 0, room.area.y);
  }, [room]);

  const handleTouch = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    const local = new Vector3(event.point.x, 0, event.point.z);
    const world = local; // local.add(position!);

    if (onTouch) {
      onTouch({ local, room: room!, world });
    }
  };

  const { groundColor, groundOpacity, textColor } = useRoomColors(room);

  if (!room || !position) {
    return null;
  }

  const { area, floorText, id } = room;

  const text = floorText ?? `Room ${id}`;

  const [width, height] = [area.width, area.height];

  return (
    <group>
      <Plane
        args={[width * SCALE, height * SCALE]}
        onClick={handleTouch}
        position={position}
        renderOrder={renderOrder}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <animated.meshStandardMaterial
          color={groundColor}
          opacity={groundOpacity}
          transparent
        />
      </Plane>
      <GroundText
        color={textColor}
        mountDuration={200}
        position={position}
        ref={textRef}
        text={text}
      />
    </group>
  );
};

const useRoomColors = (room: RoomModel | undefined) => {
  const { dungeon } = useDungeon();
  const { theme } = useTheme();
  const { maxDepth } = dungeon ?? { maxDepth: 1 };
  const roomDepth = room?.depth ?? 1;
  const floorType = room?.floorType ?? FloorType.SOLID;
  // const { depth: roomDepth, floorType } = room;

  const groundOpacity = floorType === FloorType.TRANSPARENT ? 0 : undefined;

  const groundColor = useMemo(() => {
    if (floorType === FloorType.TRANSPARENT) {
      return getComputedColor('--background');
    }
    const baseColor = theme === 'dark' ? '#e0e0e0' : '#8A8782';
    const depth = roomDepth || 0;
    const colourIncrement = 1 / maxDepth;
    return darkenColor(baseColor, depth * colourIncrement);
  }, [floorType, roomDepth, maxDepth, theme]);

  const textColor = useMemo(() => {
    if (floorType === FloorType.TRANSPARENT) {
      const fgColor = getComputedColor('--foreground');
      return fgColor;
    }

    const contrastColor = getContrastColor(groundColor);
    return contrastColor;
  }, [groundColor, floorType]);

  return {
    groundColor,
    groundOpacity,
    textColor
  };
};
