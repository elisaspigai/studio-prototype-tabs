import assert from 'node:assert/strict';
import { getSubheaderModeConfig } from '../app-mode.js';

assert.deepEqual(getSubheaderModeConfig('chat'), {
  overviewHidden: true,
  allTabLabel: 'All chats',
});

assert.deepEqual(getSubheaderModeConfig('design'), {
  overviewHidden: false,
  allTabLabel: 'All projects',
});

assert.deepEqual(getSubheaderModeConfig('code'), {
  overviewHidden: false,
  allTabLabel: 'All projects',
});

assert.deepEqual(getSubheaderModeConfig(undefined), {
  overviewHidden: false,
  allTabLabel: 'All projects',
});

console.log('app-mode tests passed');
