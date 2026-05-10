export default function (plop) {
  plop.setGenerator('package', {
    description: 'Create a new package in packages/*',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Package name (kebab-case, without @monorepo/):',
        validate: (value) =>
          /^[a-z][a-z0-9-]*$/.test(value) ||
          'Allowed characters: a-z, 0-9, hyphen. First character must be a-z.',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Short package description:',
        default: '',
      },
      {
        type: 'confirm',
        name: 'buildable',
        message: 'Should this package be built with tsdown?',
        default: true,
      },
    ],
    actions: (data) => {
      const actions = [
        {
          type: 'addMany',
          destination: 'packages/{{name}}',
          base: 'plop-templates/package/common',
          templateFiles: 'plop-templates/package/common/**/*',
          globOptions: { dot: true },
        },
      ];

      if (data.buildable) {
        actions.push({
          type: 'addMany',
          destination: 'packages/{{name}}',
          base: 'plop-templates/package/buildable',
          templateFiles: 'plop-templates/package/buildable/**/*',
          globOptions: { dot: true },
        });
      } else {
        actions.push({
          type: 'addMany',
          destination: 'packages/{{name}}',
          base: 'plop-templates/package/non-buildable',
          templateFiles: 'plop-templates/package/non-buildable/**/*',
          globOptions: { dot: true },
        });
      }

      return actions;
    },
  });
}
