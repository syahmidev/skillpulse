module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Inline Drizzle .sql migration files as strings instead of parsing them as JS.
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
