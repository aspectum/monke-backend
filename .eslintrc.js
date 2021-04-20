module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 12,
    },
    ignorePatterns: ['/database', '/node_modules', '/dist', '.eslintrc.js'], // directories to ignore
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'airbnb-typescript/base', // no react
        'plugin:prettier/recommended',
        'plugin:node/recommended',
    ],
    rules: {
        'node/no-missing-import': [
            'error',
            {
                tryExtensions: ['.ts', '.js'],
            },
        ],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
        'no-underscore-dangle': ['error', { allow: ['_id'] }],
        'import/prefer-default-export': 'off',
        'prettier/prettier': 'error',
        'node/no-unsupported-features/es-syntax': 'off',
    },
};
