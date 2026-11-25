import * as migration_20261124_102321_initial from './20261124_102321_initial';
import * as migration_20261124_120825_f1_content_model from './20261124_120825_f1_content_model';
import * as migration_20261124_121504_f1_tenants_order from './20261124_121504_f1_tenants_order';
import * as migration_20261124_122707_f1_starter_flag from './20261124_122707_f1_starter_flag';
import * as migration_20261124_125150_gate1_reasons_seed_log from './20261124_125150_gate1_reasons_seed_log';
import * as migration_20261124_143006_f2_theme from './20261124_143006_f2_theme';
import * as migration_20261124_180408_f3_vinuri_logo_grup from './20261124_180408_f3_vinuri_logo_grup';
import * as migration_20261124_210257_f3_hotel_receptie from './20261124_210257_f3_hotel_receptie';
import * as migration_20261124_211206_f3_telefon_pizza from './20261124_211206_f3_telefon_pizza';
import * as migration_20261124_221615_f3_recenzii_limba from './20261124_221615_f3_recenzii_limba';
import * as migration_20261124_231318_f3_meniu_navigare from './20261124_231318_f3_meniu_navigare';
import * as migration_20261125_002159_f3_decor from './20261125_002159_f3_decor';
import * as migration_20261125_044503_f4_traduceri from './20261125_044503_f4_traduceri';
import * as migration_20261125_065151_d67_categorii_clip from './20261125_065151_d67_categorii_clip';
import * as migration_20261125_075251_d69_pdf_vinuri from './20261125_075251_d69_pdf_vinuri';
import * as migration_20261125_083644_d71_slideshow_clip_acasa from './20261125_083644_d71_slideshow_clip_acasa';

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
    up: migration_20261124_121504_f1_tenants_order.up,
    down: migration_20261124_121504_f1_tenants_order.down,
    name: '20261124_121504_f1_tenants_order',
  },
  {
    up: migration_20261124_122707_f1_starter_flag.up,
    down: migration_20261124_122707_f1_starter_flag.down,
    name: '20261124_122707_f1_starter_flag',
  },
  {
    up: migration_20261124_125150_gate1_reasons_seed_log.up,
    down: migration_20261124_125150_gate1_reasons_seed_log.down,
    name: '20261124_125150_gate1_reasons_seed_log',
  },
  {
    up: migration_20261124_143006_f2_theme.up,
    down: migration_20261124_143006_f2_theme.down,
    name: '20261124_143006_f2_theme',
  },
  {
    up: migration_20261124_180408_f3_vinuri_logo_grup.up,
    down: migration_20261124_180408_f3_vinuri_logo_grup.down,
    name: '20261124_180408_f3_vinuri_logo_grup',
  },
  {
    up: migration_20261124_210257_f3_hotel_receptie.up,
    down: migration_20261124_210257_f3_hotel_receptie.down,
    name: '20261124_210257_f3_hotel_receptie',
  },
  {
    up: migration_20261124_211206_f3_telefon_pizza.up,
    down: migration_20261124_211206_f3_telefon_pizza.down,
    name: '20261124_211206_f3_telefon_pizza',
  },
  {
    up: migration_20261124_221615_f3_recenzii_limba.up,
    down: migration_20261124_221615_f3_recenzii_limba.down,
    name: '20261124_221615_f3_recenzii_limba',
  },
  {
    up: migration_20261124_231318_f3_meniu_navigare.up,
    down: migration_20261124_231318_f3_meniu_navigare.down,
    name: '20261124_231318_f3_meniu_navigare',
  },
  {
    up: migration_20261125_002159_f3_decor.up,
    down: migration_20261125_002159_f3_decor.down,
    name: '20261125_002159_f3_decor',
  },
  {
    up: migration_20261125_044503_f4_traduceri.up,
    down: migration_20261125_044503_f4_traduceri.down,
    name: '20261125_044503_f4_traduceri',
  },
  {
    up: migration_20261125_065151_d67_categorii_clip.up,
    down: migration_20261125_065151_d67_categorii_clip.down,
    name: '20261125_065151_d67_categorii_clip',
  },
  {
    up: migration_20261125_075251_d69_pdf_vinuri.up,
    down: migration_20261125_075251_d69_pdf_vinuri.down,
    name: '20261125_075251_d69_pdf_vinuri',
  },
  {
    up: migration_20261125_083644_d71_slideshow_clip_acasa.up,
    down: migration_20261125_083644_d71_slideshow_clip_acasa.down,
    name: '20261125_083644_d71_slideshow_clip_acasa'
  },
];
