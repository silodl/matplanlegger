import {generateSW} from 'workbox-build';

generateSW({
  swDest: './dist/sw.ts',
  globDirectory: './dist',
  globPatterns: [
    '**/*.ts',
    '**/*.tsx',
    '**/*.css',
    '**/*.svg'
  ]
});