import antfu from '@antfu/eslint-config'

export default antfu(
  {
    stylistic: {
      indent: 2,
      quotes: 'single'
    },
    typescript: true,
    regexp: false,
    rules: {
      'no-console': 'off',
      'style/quote-props': ['error', 'as-needed'],
      'vue/singleline-html-element-content-newline': 'off',
      'style/comma-dangle': ['error', 'only-multiline'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'style/arrow-parens': ['error', 'always'],
      'no-new-func': 'off',
      'vue/block-order': 'off',
      'style/operator-linebreak': 'off',
      'style/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
      'vue/html-self-closing': 'off'
    }
  },
  {
    ignores: ['polyfills/*.js']
  }
)
