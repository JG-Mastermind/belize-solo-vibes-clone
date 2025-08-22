module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['babel-plugin-transform-import-meta', {
      'env': {
        'VITE_SUPABASE_URL': 'https://test.supabase.co',
        'VITE_SUPABASE_ANON_KEY': 'test-anon-key',
        'DEV': false
      }
    }]
  ]
};