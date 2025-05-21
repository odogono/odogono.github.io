import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import {
  type Door,
  type DoorId,
  type DungeonData,
  type Room,
  type RoomId,
  type StrategyType
} from '@door-world/model/dungeon';

export const dungeonAtom = atomWithStorage<DungeonData | null>('dungeon', null);

export const dungeonSeedAtom = atomWithStorage<number>('dungeonSeed', 1974);

export const dungeonStrategyAtom = atomWithStorage<StrategyType>(
  'dungeonStrategy',
  'random'
);

export const dungeonCurrentRoomAtom = atomWithStorage<RoomId>('dungeonRoom', 1);

export const dungeonVisibleRoomsAtom = atom<Room[]>([]);
export const dungeonVisibleDoorsAtom = atom<Door[]>([]);

export const dungeonVisitedRoomsAtom = atom<RoomId[]>([]);

export const dungeonRoomHistoryAtom = atom<RoomId[]>([]);

export const dungeonNextRoomAtom = atom<RoomId | null>(null);
export const dungeonNextDoorAtom = atom<DoorId | null>(null);
