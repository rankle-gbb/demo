/**
 * fs模块，文件操作
 */
const fs = require("fs");

let firstRun = true; // getDirTree首次执行

/**
 * 主体函数，获取目录下的文件树
 * @param {读取的路径} dir
 * @returns 返回 dir目录下的文件树
 */
function getDirTree(dir) {
  // console.log("dir",dir);
  let obj = {
    dir: dir,
    childFiles: [],
    childDir: {},
  };

  let objStr = JSON.stringify(obj);

  if (firstRun && isFile(dir)) {
    return console.log(`${dir}: 不是文件夹`.redBG);
  }

  let files = readDir(dir);

  firstRun = false;
// /Users/user/test
  // 遍历文件
  files.forEach((file) => {
    let tempDir = `${dir}\\${file}`;
    let dirname = getDirName(tempDir);
    let fullDir = `${dir}/${file}`;
    let stats = getAttribute(fullDir)
    let createTime = stats.birthtime.toLocaleString();
    let lastVisitedTime = stats.atime.toLocaleString();
    let lastWriteTime = stats.mtime.toLocaleString();

    if (isFile(fullDir)) {
      let fileArr =filterFiles(file,'pdf,doc,docx,ppt,pptx,txt')
      console.log('fileArr',fileArr);
      if(fileArr){
        let fileDirs = `${dir}/${fileArr}`;
        obj.childFiles.push({
          short: fileArr, // 文件名
          full: fileDirs, // 完整路径
          createTime: createTime,
          lastVisitedTime: lastVisitedTime,
          lastWriteTime: lastWriteTime
        });
      }
    } else {
      // 在当前文件夹的对象下 childDir 属性(1)，以文件夹名作为key(2)，
      // (2)的值是该目录下 路径dir、childFiles子文件、childDir子文件夹组成的对象或null
      obj.childDir[dirname] = getDirTree(`${dir}/${file}`);
    }
  });

  return JSON.stringify(obj) === objStr ? null : obj;
}

/**
 * 读取路径下的文件、文件夹
 * @param {读取的路径} dir
 * @returns 返回 dir目录下的文件
 */
function readDir(dir) {
  return fs.readdirSync(dir, (err, files) => {
    if (err) throw err;
    if (firstRun && !files.length) console.log(`${dir}: 文件夹为空`.redBG);
    return files;
  });
}
/**
 * 过滤文件类型
 * @param {文件名+后缀} file
 * @types 需要的类型
 * @returns 返回 文件
 */
function filterFiles(file,types) {
  let typeArr = null;
  // 判断types 类型
  if(!types){
    typeArr = [];
  }else if(typeof types === 'string'){
    typeArr = types.replace(/\s+/g, '').split(',');
  }else if(Object.prototype.toString.call(types) === '[object,Array]'){
    typeArr = types.slice();
    for (let i = 0; i < typeArr.length; i++) {
      typeArr[i] = typeArr[i].toString();
    }
  }else {
    typeArr = types.toString().replace(/\s+/g, '').split(',');
  }
  let index = file.lastIndexOf('.');
  let fileType = file.substr(index + 1);
  let fileArr
  typeArr.filter(ele => {
    if(ele === fileType){
      fileArr = file
    }
  })
  return fileArr;
}
/**
 * 读取文件的属性
 * @param {读取的路径} dir
 * @returns 返回文件属性
 */
function getAttribute(dir) {
  return fs.statSync(dir,(err,stats) => {
    return stats
  })
}
/**
 * 判断制定路径是否是文件
 * @param {读取的路径} dir
 * @returns boolean
 */
function isFile(dir) {
  return fs.statSync(dir).isFile();
}

/**
 * 获取目录名
 * @param {读取的路径} dir
 * @returns 目录名
 */
function getDirName(dir) {
  return dir.substr(dir.lastIndexOf("\\") + 1, dir.length);
}

module.exports = {
  getDirTree,
  readDir,
  isFile,
  getDirName,
};
