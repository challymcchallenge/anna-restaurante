import * as migration_20261124_102321_initial from './20261124_102321_initial';
import * as migration_20261124_120825_f1_content_model from './20261124_120825_f1_content_model';
import * as migration_20261124_121500_f1_seed_starter from './20261124_121500_f1_seed_starter';
import * as migration_20261124_121504_f1_tenants_order from './20261124_121504_f1_tenants_order';

export const migrations = [
  {
    up: migration_20261124_102321_initial.up,
    down: migration_20261124_102321_initial.down,
    name: '20261124_102321_initial',
  },
  {
    up: migration_20261124_120825_f1_content_model.up,
    down: migration_20261124_120825_f1_content_model.down,
    name: '20261124_120825_f1_content_model',
  },
  {
    up: migration_20261124_121500_f1_seed_starter.up,
    down: migration_20261124_121500_f1_seed_starter.down,
    name: '20261124_121500_f1_seed_starter',
  },
  {
    up: migration_20261124_121504_f1_tenants_order.up,
    down: migration_20261124_121504_f1_tenants_order.down,
    name: '20261124_121504_f1_tenants_order'
  },
];
