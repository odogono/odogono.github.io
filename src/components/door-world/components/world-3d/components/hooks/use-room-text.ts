import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';

import { type Room as RoomModel } from '@door-world/model/dungeon';
import { clearRunAfterMs, runAfterMs, type TimeoutId } from '@helpers/time';

import type { EntityRef } from '../types';

interface RoomTextProps {
  room: RoomModel | undefined;
  textRef: RefObject<EntityRef | null>;
}

const TEXT_CYCLE_INTERVAL = 6000;
const TEXT_TRANSITION_DURATION = 1000;

export const useRoomText = ({ room, textRef }: RoomTextProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const textTransitionTimeoutId = useRef<TimeoutId | null>(null);

  const textScript = useMemo(() => {
    if (!room) {
      return [];
    }

    const { floorText } = room;

    if (!floorText) {
      return [];
    }

    return [floorText];
  }, [room]);

  const runTextTransition = () => {
    setIsTransitioning(true);
    clearRunAfterMs(textTransitionTimeoutId.current);
    textTransitionTimeoutId.current = runAfterMs(TEXT_CYCLE_INTERVAL, () =>
      setIsTransitioning(false)
    );
  };

  // Handle text cycling
  useEffect(() => {
    if (!room || !isTransitioning) {
      return;
    }

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
  }, [room, isTransitioning, textRef, textScript]);

  return {
    runTextTransition,
    text: textScript[currentTextIndex]
  };
};
