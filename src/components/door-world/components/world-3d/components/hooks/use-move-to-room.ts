import { useCallback, useRef } from 'react';

import { useDungeonJourney } from '@door-world/contexts/dungeon/hooks/use-dungeon-journey';
import type { DoorId } from '@door-world/model/dungeon';
import type { Position } from '@door-world/model/dungeon/types';
import { createLog } from '@helpers/log';

import type { DoorRef } from '../door';
import { dungeonPositionToVector3 } from '../helpers';
import type { IsometricCameraMoveToProps } from '../isometric-camera';
import type { RoomRef } from '../room';

const log = createLog('useMoveToRoom');

interface UseMoveToRoomProps {
  moveCameraTo: (props: IsometricCameraMoveToProps) => Promise<void>;
}

export const useMoveToRoom = ({ moveCameraTo }: UseMoveToRoomProps) => {
  const { currentRoom, doors, dungeon, moveToRoom, rooms } =
    useDungeonJourney();
  const isMoving = useRef(false);

  // Store refs for all doors and rooms
  const doorRefs = useRef<Map<string, DoorRef>>(new Map());
  const roomRefs = useRef<Map<number, RoomRef>>(new Map());

  const moveThroughDoor = useCallback(
    async (doorId: DoorId) => {
      const doorRef = doorRefs.current.get(doorId);

      if (!doorRef) {
        log.error('Missing refs for door transition', { doorId });
        return;
      }

      if (isMoving.current) {
        log.debug('Already moving');
        return;
      }

      isMoving.current = true;

      await moveToRoom({
        doorAction: async (doorId: string, open: boolean) => {
          const doorRef = doorRefs.current.get(doorId);

          if (!doorRef) {
            log.error('Missing refs for door transition', { doorId });
            return false;
          }

          // log.debug('Setting door open', { doorId, open });
          await doorRef.setOpen(open);

          // log.debug('Door set open', { doorId, open });
          return true;
        },
        doorId,
        moveCameraAction: (position: Position | null) =>
          moveCameraTo({
            position: dungeonPositionToVector3(position)!
          }),
        unmountRoomAction: (roomId: number, doorIds: string[]) => {
          const roomRef = roomRefs.current.get(roomId);

          if (!roomRef) {
            log.debug('[unmountRoomAction] Missing room ref', { roomId });
            return Promise.resolve(false);
          }

          const refs = doorIds.map(id => doorRefs.current.get(id)) as DoorRef[];

          return Promise.all([
            roomRef.unmount(),
            ...refs.map(ref => ref.unmount())
          ])
            .then(() => true)
            .catch(error => {
              log.error('[unmountRoomAction] Error unmounting room', {
                error,
                roomId
              });
              return false;
            });
        }
      });

      log.debug('Moved to room', { roomId: doorId });

      isMoving.current = false;
    },
    [moveToRoom, moveCameraTo]
  );

  return { doorRefs, moveThroughDoor, roomRefs };
};
