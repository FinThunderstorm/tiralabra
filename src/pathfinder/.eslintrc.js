module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['airbnb-base', 'prettier'],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': [
            'warn',
            { singleQuote: true, semi: false, tabWidth: 4 },
        ],
    },
}
