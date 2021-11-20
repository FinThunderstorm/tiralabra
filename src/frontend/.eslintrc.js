module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', 'prettier'],
    rules: {
        'prettier/prettier': [
            'warn',
            { singleQuote: true, semi: false, tabWidth: 4 },
        ],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'no-console': 'off',
        'import/no-unresolved': 'off',
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@repositories', '../backend/repositories'],
                    ['@backend', '../backend'],
                    ['@pathfinder', '../pathfinder'],
                    ['@datastructures', '../datastructures'],
                    ['@config', '../config'],
                    ['@components', '../frontend/components'],
                    ['@frontend', '../frontend'],
                ],
            },
        },
    },
}
