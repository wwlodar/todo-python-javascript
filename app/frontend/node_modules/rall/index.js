#!/usr/bin/env node

const {mapSeries} = require('p-iteration')
const {exec} = require('child_process')
module.exports = async function () {
  let cmds = []
  let args = process.argv.splice(2)
  args.forEach(arg => {
    cmds.push('npx ' + arg)
  })
  return mapSeries(cmds, cmd => {
    return new Promise ((resolve, reject) => {
      let child = exec('npx ' + cmd, {env: process.env, cwd: process.cwd()})
      child.stderr.pipe(process.stderr)
      child.stdout.pipe(process.stdout)
      process.stdin.pipe(child.stdin)
      child.on('exit', (statusCode) => {
        process.stdin.unpipe(child.stdin)
        if (statusCode === 0) {
          resolve()
        } else {
          reject(statusCode)
        }
      })
    })
  })
}

if (!module.parent) {
  module.exports()
    .then(() => process.exit(0))
    .catch(statusCode => { process.exit(statusCode) })
}
