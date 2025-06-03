import { useEffect, useMemo } from 'react';

import { atom, useAtomValue, useSetAtom } from 'jotai';

import { getRoomDoors } from '@door-world/model/dungeon/door';
import { getDungeonRoomById } from '@door-world/model/dungeon/helpers';
import { createLog } from '@helpers/log';

import { moveToRoomAtom } from '../actions/move-to-room';
import { addVisitedRoomAtom, applyNextRoomAtom } from '../actions/room-history';
import {
  getDungeonVisibleDoorsAtom,
  getDungeonVisibleRoomsAtom
} from '../actions/set-visible';
import {
  dungeonAtom,
  dungeonCurrentRoomAtom,
  dungeonNextDoorAtom,
  dungeonNextRoomAtom,
  dungeonVisibleDoorsAtom,
  dungeonVisibleRoomsAtom
} from '../atoms';

const log = createLog('useDungeonJourney');

const isInitialisedAtom = atom(false);

const initialiseDungeonJourneyAtom = atom(null, async (get, set) => {
  if (get(isInitialisedAtom)) {
    return;
  }

  // re-initialise the dungeon journey
  set(dungeonCurrentRoomAtom, 1);

  const dungeon = get(dungeonAtom);
  const currentRoomId = get(dungeonCurrentRoomAtom);

  const currentRoom = getDungeonRoomById(dungeon, currentRoomId);

  if (!currentRoom) {
    // throw new Error('Current room not found');
    return;
  }

  const visibleDoors = getRoomDoors(dungeon, currentRoom);

  set(dungeonVisibleRoomsAtom, [currentRoomId]);
  set(
    dungeonVisibleDoorsAtom,
    visibleDoors.map(door => door.id)
  );
  set(addVisitedRoomAtom, currentRoomId);
  set(applyNextRoomAtom);
  set(isInitialisedAtom, true);

  const nextRoomId = get(dungeonNextRoomAtom);

  log.debug('Dungeon journey initialised', { currentRoomId, nextRoomId });
});

export const useDungeonJourney = () => {
  const dungeon = useAtomValue(dungeonAtom);
  const initialiseDungeonJourney = useSetAtom(initialiseDungeonJourneyAtom);
  const doors = useAtomValue(getDungeonVisibleDoorsAtom);
  const rooms = useAtomValue(getDungeonVisibleRoomsAtom);
  const moveToRoom = useSetAtom(moveToRoomAtom);
  const currentRoomId = useAtomValue(dungeonCurrentRoomAtom);
  const currentRoom = useMemo(
    () => getDungeonRoomById(dungeon, currentRoomId),
    [dungeon, currentRoomId]
  );
  const nextDoorId = useAtomValue(dungeonNextDoorAtom);

  useEffect(() => {
    initialiseDungeonJourney();
  }, [initialiseDungeonJourney]);

  return {
    currentRoom,
    currentRoomId,
    doors,
    dungeon,
    moveToRoom,
    nextDoorId,
    rooms
  };
};
