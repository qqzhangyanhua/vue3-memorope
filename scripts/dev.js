// 只针对具体的某个包打包
// 打包所有的包

const fs = require("fs");
const execa = require("execa"); //开启子进程打包
const targets = fs.readdirSync('packages').filter(f => {
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false;
    }
    return true
});
console.log(targets)
async function build(source) {
    console.log('source', source)
    await execa('rollup', ['-c', '--environment', `TARGET:${source}`], {
        stdio: 'inherit'
    }) //子进程的打包信息共享给父进程
}

function runParallel(targets, fn) {
    const res = []
    for (const target of targets) {
        const p = fn(target)
        res.push(p)
    }
    return Promise.all(res)
}
runParallel(targets, build)