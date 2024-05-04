import globals from "globals";
import pluginVue from "eslint-plugin-vue";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});

export default [
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  ...compat.extends("airbnb-base"),
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      'import/prefer-default-export': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-extraneous-dependencies': ["error", {"devDependencies": true}],
      'no-alert': 'off',
      'no-restricted-globals': ['off', 'confirm'],
      'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
    },
  },
  {
    ignores: ['src/components/icons/*.vue'],
    rules: {
      'max-len': 'off'
    }
  }
];
