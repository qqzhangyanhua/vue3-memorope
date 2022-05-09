import path from 'path';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2';
// console.log('rollup==', process.env.TARGET)
const packagesDir = path.resolve(__dirname, 'packages'); //找到目录
const packageDir = path.resolve(packagesDir, process.env.TARGET) //找到要打包的包

const resolve = (p) => path.resolve(packageDir, p)
const pkg = require(resolve('package.json'))
const name = path.basename(packageDir) //取文件名
const outputConfig = {
    "esm-bundler": {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    "cjs": {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    "global": {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife', //立即执行函数
    }
}

const options = pkg.buildOptions //自己在package.json里配置的buildOptions
function createConfig(format, output) {
    output.name = options.name
    output.version = options.version
    output.sourcemap = true;
    return {
        input: resolve('src/index.ts'),
        output: output,
        plugins: [
            json(),
            ts({
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            nodeResolve()
        ]
    }

}
// rollup 最终需要导出配置
export default options.formats.map(format => createConfig(format, outputConfig[format]))

// console.log('pkg=====', pkg)