import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import { dts } from 'rollup-plugin-dts';

import packageJson from '../package.json' with { type: 'json' };

import tsConfig from './tsconfig.base.json' with { type: 'json' };

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const PATH_INPUT_FILE = 'src/index.ts';
const PATH_TSCONFIG_BUILD = 'scripts/tsconfig.build.json';

const rollupConfig = defineConfig([
  {
    input: PATH_INPUT_FILE,
    output: [
      {
        file: packageJson.main,
        name: packageJson.name,
        format: 'umd',
        sourcemap: !IS_PRODUCTION,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-tabs': 'react-tabs',
          'react-syntax-highlighter': 'react-syntax-highlighter',
          '@rehooks/local-storage': '@rehooks/local-storage',
          'react/jsx-runtime': 'jsxRuntime',
          'react-syntax-highlighter/dist/esm/styles/prism': 'prism',
        },
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: !IS_PRODUCTION,
      },
    ],
    plugins: [
      commonjs(),
      typescript({
        tsconfig: PATH_TSCONFIG_BUILD,
        sourceMap: !IS_PRODUCTION,
      }),
      terser({
        output: { comments: false },
        compress: {
          pure_getters: true,
        },
        toplevel: true,
      }),
      image(),
    ],
    external: [
      // Ensure dependencies are not bundled with the library
      ...Object.keys(packageJson.peerDependencies),
      ...Object.keys(packageJson.dependencies),
      'react-tabs/style/react-tabs.css',
      'react/jsx-runtime',
      'react-syntax-highlighter/dist/esm/styles/prism',
    ],
  },
  {
    input: PATH_INPUT_FILE,
    output: { file: packageJson.types, format: 'esm' },
    plugins: [
      dts({
        compilerOptions: {
          baseUrl: './src',
          paths: tsConfig.compilerOptions.paths,
        },
      }),
    ],
    external: ['react-tabs/style/react-tabs.css'],
  },
]);

// eslint-disable-next-line import-x/no-default-export
export default rollupConfig;
