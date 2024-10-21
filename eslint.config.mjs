import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single'
  },
  typescript: true,
  regexp: false,
  rules: {
    'style/quote-props': ['error', 'as-needed'],
    'style/comma-dangle': ['error', 'only-multiline'],
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'style/arrow-parens': ['error', 'always'],
    'style/operator-linebreak': 'off',
    'style/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
    'no-new-func': 'off'
  }
})
