import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript2 from 'rollup-plugin-typescript2';
import analyze from 'rollup-plugin-analyzer';
import pkg from './package.json';
import { builtinModules } from 'module';

const generalConfig = (moduleSystem) => ({
  input: 'src/index.ts',
  output: {
    dir: `dist/${moduleSystem}`,
    format: `${moduleSystem}`,
    sourcemap: false,
    exports: 'named',
  },
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.optionalDependencies),
    ...builtinModules,
  ],
  plugins: [
    commonjs(),
    resolve(),
    typescript2({
      tsconfig: `tsconfig.es.json`,
      typescript: require('ttypescript'),
    }),
    ...(moduleSystem === 'es' ? [analyze()] : []),
  ],
});

export default [generalConfig('cjs'), generalConfig('es')];
