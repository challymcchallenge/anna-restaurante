// eslint-config-next 16 exportă direct configurația „flat” (fără @eslint/eslintrc).
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    // ADR-004: imaginile site-ului public sunt variantele AVIF/WebP generate la încărcare, servite cu
    // <picture> și srcset, fără transformare la cerere (next/image ar cere optimizare pe Vercel).
    files: ['src/components/site/**'],
    rules: { '@next/next/no-img-element': 'off' },
  },
  {
    ignores: [
      '.next/',
      'src/payload-types.ts',
      'src/payload-generated-schema.ts',
      'src/app/(payload)/admin/importMap.js',
      'public/spike/',
      'test-results/',
      'playwright-report/',
    ],
  },
]

export default eslintConfig
