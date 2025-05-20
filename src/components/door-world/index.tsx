import { createLog } from '@helpers/log';

import { World2D } from './components/world-2d';
import { World3D } from './components/world-3d';
import { DungeonViewProvider } from './contexts/dungeon-view/provider';
import { DungeonProvider } from './contexts/dungeon/provider';

// const World3D = (await import('./components/world-3d/index.tsx')).World3D;
// const World2D = (await import('./components/world-2d/index.tsx')).World2D;
// import { World3D } from './components/world-3d';

const log = createLog('DoorWorld');

console.debug('DoorWorld');
export const DoorWorld = () => {
  const dungeonView = '3d';

  // log.info('DoorWorld', { World3D });

  return (
    <>
      <DungeonProvider>
        <DungeonViewProvider>
          <div className="relative flex h-full w-full flex-col items-center gap-4 overflow-hidden">
            {dungeonView === '3d' ? <World3D /> : <World2D />}
          </div>
        </DungeonViewProvider>
      </DungeonProvider>
    </>
  );
};
