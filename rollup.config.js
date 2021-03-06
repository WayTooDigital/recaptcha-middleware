import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import json from "rollup-plugin-json";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
      exports: "auto"
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
      exports: "auto"
    },
  ],
  plugins: [
    external(),
    url({ exclude: ["**/*.svg"] }),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-env"],
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            regenerator: true,
          },
        ],
      ],
      runtimeHelpers: true,
    }),
    commonjs(),
    json(),
    resolve(),
  ],
  external: ["axios"],
};
