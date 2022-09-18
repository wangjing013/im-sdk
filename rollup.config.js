import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const commonPlugin = [
  resolve(), // so Rollup can find `ms`
  commonjs(),
  typescript(),
  terser(),
];

export default [
  // browser-friendly UMD build
  {
    input: "src/index.ts",
    output: {
      name: "NIM",
      file: pkg.browser,
      format: "umd",
      globals: {
        "@yxim/nim-web-sdk": "NIM",
      },
    },
    plugins: [...commonPlugin],
    external: ["@yxim/nim-web-sdk"],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.ts",
    external: ["ms"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [...commonPlugin],
    external: ["@yxim/nim-web-sdk"],
  },
];
