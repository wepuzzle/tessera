import type { PlopTypes } from '@turbo/gen';
import { reactGenerator } from './react';

export default function gen(plop: PlopTypes.NodePlopAPI): void {
  plop.load('plop-pack-npm-install');
  reactGenerator(plop);
}
