import { useTheme } from '@helpers/theme';
import { DoorWorld } from '@odogono/door-world';

// Door World lives in github.com/odogono/door-world; this site supplies
// its Floor Text and follows the site theme
export const DoorWorldIsland = () => {
  const { theme } = useTheme();

  return <DoorWorld floorText="Open Door Go North" theme={theme} />;
};
