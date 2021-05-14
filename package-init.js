/**
 * 初始化项目配置文件
 * 创建或还原.gitonly的配置文件到本地
 * filename.gitonly ===>  filename
 * filename ===>  filename.gitonly
 * 本地的配置文件随便折腾，不会提交到版本库了
 * Created by siven on 2020-03-31
 */

const fs = require("fs");
const exec = require('child_process').exec;
const arguments = process.argv.splice(2);
const isForce = arguments[0] === '--force';
// .gitignore文件
const ignoreFile = './.gitignore'
// 需要执行的文件
const pathFiles = [
    './vue.config.js',
    './src/config/env/test.js',
    './src/config/env/production.js',
    './src/config/env/development.js',
]

// 忽略文件并从git版本库删除
function doIgnoreFile (file) {
    const cmdStr = 'git rm ' + file + ' --cached'

    exec(cmdStr, function(err, stdout, stderr){
        if (err) {
            console.log('===> 执行Git脚本错误')
            console.log('===>', err.message)
        } else {
            console.log('===> 执行Git脚本成功')
            console.log('===>', cmdStr)
        }
    })
}
// 写入gitignore文件
function addIgnoreFile (file) {
    const array = (file + '').split('/')
    const fileName = array[array.length - 1]
    fs.writeFile(ignoreFile, fileName + '\r\n', {encoding : 'utf8', mode : '0666', flag : 'a'},  function(err) {
        if (err) {
            console.log('===> 写入ignore文件失败')
            console.log('===>', err.message)
        } else {
            console.log('===> 写入ignore文件成功')
            console.log('===>', file)
        }
    })
}

// 还原.gitonly文件
function doReductGitonlyFile (file) {
    console.log(isForce,'isForce');
    const gitonlyFile = file + '.gitonly';
    // 检查文件是否存在
    fs.exists(file, exist => {
        if (exist && !isForce) {
            console.log('===> 本地已存在该文件，跳过不执行')
            console.log('===>', file)
            return
        } else {
            fs.exists(gitonlyFile, exist => {
                if (!exist) {
                    console.log('===> Gitonly文件不存在，跳过不执行')
                    console.log('===>', gitonlyFile)
                    return
                } else {
                    // 开始拷贝生成文件
                    fs.copyFile(gitonlyFile, file, err => {
                        if (err) {
                            console.log('===> Gitonly文件还原失败！')
                            console.log(err)
                            console.log('===>', file)
                        } else {
                            console.log('===> Gitonly文件还原成功！')
                            console.log('===>', file)
                        }
                    })
                }
            })
        }
    })
}
// 生成.gitonly文件
function doCreateGitonlyFile (file) {
    const gitonlyFile = file + '.gitonly';
    // 检查文件是否存在
    fs.exists(file, exist => {
        if (!exist) {
            console.log('===> 本地不存在该文件，跳过不执行')
            console.log('===>', file)
            return
        } else {
            fs.exists(gitonlyFile, exist => {
                if (exist) {
                    console.log('===> Gitonly文件已存在，跳过不执行')
                    console.log('===>', gitonlyFile)
                    return
                } else {
                    // 开始拷贝生成文件
                    fs.copyFile(file, gitonlyFile, err => {
                        if (err) {
                            console.log('===> Gitonly文件创建失败！')
                            console.log(err)
                            console.log('===>', gitonlyFile)
                        } else {
                            console.log('===> Gitonly文件创建成功！')
                            console.log('===>', gitonlyFile)
                        }
                    })
                }
            })
        }
    })
}

function run () {
    const task = function (file, index) {
        setTimeout(function(){
            console.log('=====================START====================')
            //doCreateGitonlyFile(file)
            doReductGitonlyFile(file)
            //doIgnoreFile(file)
            //addIgnoreFile(file)
        }, index * 200)
    }
    // 遍历执行
    pathFiles.forEach((file, index) => task(file, index))
}

run()
