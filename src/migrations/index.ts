import * as migration_20261124_102321_initial from './20261124_102321_initial';

export const migrations = [
  {
    up: migration_20261124_102321_initial.up,
    down: migration_20261124_102321_initial.down,
    name: '20261124_102321_initial'
  },
];
