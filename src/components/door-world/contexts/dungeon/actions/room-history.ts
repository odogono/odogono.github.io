import { atom } from 'jotai';

import type { RoomId } from '@door-world/model/dungeon';

import { dungeonVisitedRoomsAtom } from '../atoms';

export const addVisitedRoomAtom = atom(null, (get, set, roomId: RoomId) => {
  const visitedRooms = get(dungeonVisitedRoomsAtom);

  const newVisitedRooms = new Set([...visitedRooms, roomId]);

  set(dungeonVisitedRoomsAtom, Array.from(newVisitedRooms));
});

export const hasVisitedRoomAtom = atom(get => {
  const visitedRooms = get(dungeonVisitedRoomsAtom);

  return (roomId: RoomId) => visitedRooms.includes(roomId);
});
