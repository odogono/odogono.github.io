import { atom } from 'jotai';

import type { Door, DoorId, Room, RoomId } from '@door-world/model/dungeon';

import {
  dungeonAtom,
  dungeonVisibleDoorsAtom,
  dungeonVisibleRoomsAtom
} from '../atoms';

const mergeUniqueById = <T extends string | number>(
  arr1: T[],
  arr2: T[]
): T[] => {
  const ids = new Set(arr1);
  return [...arr1, ...arr2.filter(id => !ids.has(id))];
};

interface SetDungeonVisibleProps {
  clear?: boolean;
  doors: Door[];
  rooms: Room[];
}

export const setDungeonVisibleAtom = atom(
  null,
  (get, set, props: SetDungeonVisibleProps) => {
    const { clear = false, doors, rooms } = props;

    const roomIds: RoomId[] = rooms.map(room => room.id);
    const doorIds: DoorId[] = doors.map(door => door.id);

    if (clear) {
      set(dungeonVisibleRoomsAtom, roomIds);
      set(dungeonVisibleDoorsAtom, doorIds);
    }

    const newRooms = mergeUniqueById(get(dungeonVisibleRoomsAtom), roomIds);
    set(dungeonVisibleRoomsAtom, newRooms);

    const newDoors = mergeUniqueById(get(dungeonVisibleDoorsAtom), doorIds);
    set(dungeonVisibleDoorsAtom, newDoors);
  }
);

/**
 * Returns a list of Room objects that are currently visible in the dungeon
 */
export const getDungeonVisibleRoomsAtom = atom(get => {
  const roomIds = get(dungeonVisibleRoomsAtom);
  const dungeon = get(dungeonAtom);
  if (!dungeon) {
    return [];
  }
  return dungeon.rooms.filter(room => roomIds.includes(room.id));
});

/**
 * Returns a list of Door objects that are currently visible in the dungeon
 */
export const getDungeonVisibleDoorsAtom = atom(get => {
  const doorIds = get(dungeonVisibleDoorsAtom);
  const dungeon = get(dungeonAtom);
  if (!dungeon) {
    return [];
  }
  return dungeon.doors.filter(door => doorIds.includes(door.id));
});
