import { createLog } from '@helpers/log';

import { DungeonViewProvider } from './contexts/dungeon-view/provider';
import { DungeonProvider } from './contexts/dungeon/provider';

const World3D = (await import('./components/world-3d/index.tsx')).World3D;
const World2D = (await import('./components/world-2d/index.tsx')).World2D;

const log = createLog('DoorWorld');

export const DoorWorld = () => {
  const dungeonView = '3d';

  // log.info('DoorWorld', { World3D });

  return (
    <>
      <DungeonProvider>
        <DungeonViewProvider>
          <div className="world-container relative flex h-full w-[90%] flex-col items-center gap-4 overflow-hidden">
            {dungeonView === '3d' ? (
              <World3D showMiniMap={false} />
            ) : (
              <World2D />
            )}
          </div>
        </DungeonViewProvider>
      </DungeonProvider>
    </>
  );
};
