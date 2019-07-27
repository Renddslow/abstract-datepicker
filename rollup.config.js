const resolve = require('rollup-plugin-node-resolve');
const flow = require('rollup-plugin-flow');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');

const pkg = require('./package');

module.exports = {
  input: './index.js',
  output: {
    name: 'abstract-datepicker',
    exports: 'named',
    file: 'dist/abstract-datepicker.js',
    format: 'es',
  },
  external: Object.keys(pkg.peerDependencies || {}),
  plugins: [
    resolve(),
    flow(),
    commonjs({ include: 'node_modules/**' }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      runtimeHelpers: true,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            loose: true
          }
        ],
        '@babel/preset-flow',
      ],
    })
  ]
};