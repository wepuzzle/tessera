import { execSync } from 'node:child_process';
import type { PlopTypes } from '@turbo/gen';
import { kebabCase } from 'lodash';

export const reactGenerator = (plop: PlopTypes.NodePlopAPI): void => {
  plop.setGenerator('react', {
    description: 'React scaffolder.',
    prompts: [
      {
        type: 'input',
        name: 'directory',
        message: 'directory',
        validate: (input) => {
          return /^(\/)?([^/\\0]+(\/)?)+$/.test(input) ?? 'Invalid directory.';
        },
      },
    ],
    actions: (answers) => {
      const { directory } = answers;
      const [context, ...parts] = directory.split('/');
      if (context !== 'apps') {
        throw new Error(
          'React apps must be placed within apps/ workspace directory.',
        );
      }

      const pkgKey = kebabCase(parts.join('/'));
      const pkg = `@tessera/${pkgKey}`;
      const destination = `apps/${pkgKey}`;
      const tplPath = 'react/tpl';

      return [
        {
          type: 'addMany',
          destination,
          base: tplPath,
          templateFiles: `${tplPath}/**`,
          data: {
            packageName: pkg,
          },
        },
        {
          type: 'npmInstall',
          path: process.cwd(),
          verbose: true,
        },
        async function lint() {
          console.log('Formatting files...');
          execSync('turbo run lint:fix');
          return 'Formatting completed.';
        },
      ];
    },
  });
};
