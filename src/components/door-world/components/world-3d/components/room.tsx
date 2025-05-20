import { useEffect, useMemo, useRef, useState, type Ref } from 'react';

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
import { clearRunAfterMs, runAfterMs, type TimeoutId } from '@helpers/time';
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
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const textTransitionTimeoutId = useRef<TimeoutId | null>(null);

  const runTextTransition = () => {
    setIsTransitioning(false);
    clearRunAfterMs(textTransitionTimeoutId.current);
    textTransitionTimeoutId.current = runAfterMs(3000, () =>
      setIsTransitioning(true)
    );
  };

  const { springs } = useMounted({
    mountDuration,
    onMount: async () => {
      // Start the text cycling after initial mount
      runTextTransition();

      return true;
    },
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

  // Handle text cycling
  useEffect(() => {
    if (!room || !isTransitioning) {
      return;
    }

    const text = room.floorText ?? `Room ${room.id}`;
    const textScript = [text, 'This is Message 1', 'This is Message 2'];

    const cycleText = async () => {
      // Unmount current text
      if (textRef.current) {
        await textRef.current.unmount();
      }

      // Update to next text index
      // log.debug('Updating text index', {
      //   currentTextIndex,
      //   nextTextIndex: (currentTextIndex + 1) % textScript.length
      // });
      setCurrentTextIndex(prev => (prev + 1) % textScript.length);

      // Mount new text
      if (textRef.current) {
        await textRef.current.mount();
      }

      // Schedule next transition
      runTextTransition();
    };

    cycleText();
  }, [isTransitioning, room]);

  if (!room || !position) {
    return null;
  }

  const { area, floorText, id } = room;
  const text = floorText ?? `Room ${id}`;
  const textScript = [text, 'This is Message 1', 'This is Message 2'];
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
          opacity={groundOpacity ?? springs.opacity}
          transparent
        />
      </Plane>
      <GroundText
        color={textColor}
        maxWidth={Math.min(3, width * SCALE * 0.8)}
        mountDuration={1000}
        position={position}
        ref={textRef}
        text={textScript[currentTextIndex]}
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
