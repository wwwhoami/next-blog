import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tailwindcss from 'eslint-plugin-tailwindcss'
import unusedImports from 'eslint-plugin-unused-imports'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const patchedConfig = fixupConfigRules([
  ...compat.extends(
    'next',
    'next/core-web-vitals',
    'prettier',
    'plugin:tailwindcss/recommended',
  ),
])

const config = [
  ...patchedConfig,
  {
    plugins: {
      'unused-imports': unusedImports,
    },

    rules: {
      'unused-imports/no-unused-imports': 'error',

      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: [
            'ring\\-(primary|secondary|danger|success)',
            '(hover|focus)\\-ring\\-(primary|secondary|danger|success)',
          ],
        },
      ],
    },
    ignores: ['.next/*'],
  },
]

export default config
