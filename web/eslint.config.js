import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration[async=false][id.name=/Async$/]',
          message: "Function ending in 'Async' must be declared async"
        },
        {
          selector: 'FunctionDeclaration[async=true][id.name!=/Async$/]',
          message: "Async function name must end in 'Async'"
        },
        {
          selector: 'MethodDefinition[value.async=false][key.name=/Async$/]',
          message: "Method ending in 'Async' must be declared async"
        },
        {
          selector: 'MethodDefinition[value.async=true][key.name!=/Async$/]',
          message: "Async method name must end in 'Async'"
        },
        {
          selector:
            'Property[value.type=/FunctionExpression$/][value.async=false][key.name=/Async$/]',
          message: "Function ending in 'Async' must be declared async"
        },
        {
          selector:
            'Property[value.type=/FunctionExpression$/][value.async=true][key.name!=/Async$/]',
          message: "Async function name must end in 'Async'"
        },
        {
          selector:
            'VariableDeclarator[init.type=/FunctionExpression$/][init.async=false][id.name=/Async$/]',
          message: "Function ending in 'Async' must be declared async"
        },
        {
          selector:
            'VariableDeclarator[init.type=/FunctionExpression$/][init.async=true][id.name!=/Async$/]',
          message: "Async function name must end in 'Async'"
        }
      ]
    }
  }
);
