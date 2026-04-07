import * as migration_20260407_060924_add_feature_cards_layout from './20260407_060924_add_feature_cards_layout';
import * as migration_20260407_063000_cleanup_invalid_header_child_pages from './20260407_063000_cleanup_invalid_header_child_pages';
import * as migration_20260407_115828 from './20260407_115828';

export const migrations = [
  {
    up: migration_20260407_060924_add_feature_cards_layout.up,
    down: migration_20260407_060924_add_feature_cards_layout.down,
    name: '20260407_060924_add_feature_cards_layout',
  },
  {
    up: migration_20260407_063000_cleanup_invalid_header_child_pages.up,
    down: migration_20260407_063000_cleanup_invalid_header_child_pages.down,
    name: '20260407_063000_cleanup_invalid_header_child_pages',
  },
  {
    up: migration_20260407_115828.up,
    down: migration_20260407_115828.down,
    name: '20260407_115828'
  },
];
