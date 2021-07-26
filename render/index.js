const fs = require("fs");
const join = require("path").join;
const {shell} = require('electron');
const homeDir = require('os').homedir();
const dir = `${homeDir}\\Documents`

window.onload = function () {

  let currentTime = Date.parse(new Date());
  let text = this.document.getElementById('textarea')
  let weChatUrl;
  let wxWorkUrl;
  let weChatdata =[];
  let wxWork = []
  weChatUrl = testUrl(dir,'WeChat Files')
  wxWorkUrl = testUrl(dir,'WXWork')
  
  if(weChatUrl){
    weChatdata = getFileName(weChatUrl)
  }else {
    weChatdata = []
  }

  if(wxWorkUrl){
    wxWork = getWxWorkFileName(wxWorkUrl)
  }else{
    wxWork = []
  }
  let datas = []
  if (weChatdata.length > 0) {
    weChatdata.map(item => {
      let res = findSync(item)
      datas.push(...res)
    })
  }

  let wxWorkData = []
  if (wxWork.length > 0) {
    wxWork.map(item => {
      let res = findSync(item)
      wxWorkData.push(...res)
    })
  }

  /**
  * @param startPath  起始目录文件夹路径
  * @returns {Array}
  */
  function findSync(startPath) {
    let result = [];
    let obj = {
      data: []
    }
    function finder(path) {
      let files = fs.readdirSync(path);
      files.forEach((val, index) => {
        let fPath = join(path, val);
        let stats = fs.statSync(fPath);
        let createTime = stats.birthtime.toLocaleString(); //文件创建时间
        let lastVisitedTime = stats.atime.toLocaleString(); //最后访问时间
        let lastWriteTime = stats.mtime.toLocaleString(); //最后修改时间
        let lastWrite =dateToMs(stats.mtime) //记录最后修改时间时间戳 用于计算筛选三个月内的文件
        if (stats.isDirectory()) {
          finder(fPath)
        } else {
          let fileArr = filterFiles(val, 'ppt,doc,docx,pdf,pptx,txt,xls,xlsx,zip');
          if (fileArr) {
            obj.data.push({
              fileName: fileArr,
              dirName: fPath,
              createTime: createTime,
              lastWriteTime: lastWriteTime,
              lastVisitedTime: lastVisitedTime,
              lastWrite:lastWrite
            })
            result = obj.data
          }
        }

      });
    }
    finder(startPath);
    return result;
  }
  let str = ''
  // 企业微信下所有账号文件夹 微信所有账号文件合并
  if (datas.length > 0 && wxWorkData.length > 0) {
    fileContent = [...datas, ...wxWorkData]
  } else if (wxWorkData.length > 0 && datas.length <= 0) {
    fileContent = wxWorkData
  } else if (wxWorkData.length <= 0 && datas.length > 0) {
    fileContent = datas
  } else if (wxWorkData.length <= 0 && datas.length <= 0) {
    fileContent = [{}]
  }

  fileContent.map(item => {
    //三月内的文件
    if(item.lastWrite >= currentTime - 7796220000){
      str += `
      <div class="tree" data-url="${item.dirName}">
        <div class="fileContent">
          <div class="fileName" data-url="${item.dirName}"> ${item.fileName} </div>
          <div class="time">更新时间: ${item.lastWriteTime}</div>
        </div>
        <div class="dirname" data-url="${item.dirName}">路径: ${item.dirName}</div>
      </div>
    `
      text.innerHTML = str;
    }

  })
  let tree = this.document.querySelectorAll('.tree')
  console.log(tree);
  text.addEventListener('click', (e) => {
    var e = e || window.event;
    // 调用电脑默认软件打开相应类型文件
    shell.openExternal(e.target.dataset.url)
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
 * 判断制定路径是有微信文件夹
 * @param {读取的路径} dir
 * @returns Array
 */
function getFileName(dir) {
  let files = fs.readdirSync(dir);
  let data = []
  files.forEach((item) => {
    if (!isFile(`${dir}\\${item}`)) {
      if (item.includes('wxid')) {
        data.push(`${dir}\\${item}\\FileStorage\\File`)
      }
    }
  })
  return data
}
/**
 * 判断制定路径是有企业微信文件夹
 * @param {读取的路径} dir
 * @returns Array
 */
function getWxWorkFileName(dir) {
  let files = fs.readdirSync(dir);
  let data = [];
  files.forEach((item) => {
    if (!isFile(`${dir}\\${item}`)) {
      if (item.includes('1688854')) {
        data.push(`${dir}\\${item}\\Cache\\File`)
      }
    }
  })
  return data
}

/**
 * 检测路径下面是否有某个文件夹
 * @param {读取的路径} dir
 * @returns String
 */
function testUrl(dir,fileName){
  let files =fs.readdirSync(dir);
  let data;
  files.forEach((item) => {
    if (!isFile(`${dir}\\${item}`)) {
      if (item == fileName) {
        data = `${dir}\\${item}`
      }
    }
  })
  return data
}

/**
 * 过滤文件类型
 * @param {文件名+后缀} file
 * @types 需要的类型
 * @returns 返回 文件
 */
function filterFiles(file, types) {
  let typeArr = null;
  // 判断types 类型
  if (!types) {
    typeArr = [];
  } else if (typeof types === 'string') {
    typeArr = types.replace(/\s+/g, '').split(',');
  } else if (Object.prototype.toString.call(types) === '[object,Array]') {
    typeArr = types.slice();
    for (let i = 0; i < typeArr.length; i++) {
      typeArr[i] = typeArr[i].toString();
    }
  } else {
    typeArr = types.toString().replace(/\s+/g, '').split(',');
  }
  let index = file.lastIndexOf('.');
  let fileType = file.substr(index + 1);
  let fileArr
  typeArr.filter(ele => {
    if (ele === fileType) {
      fileArr = file
    }
  })
  return fileArr;
}

/**
 * @function 中国标准时间转化为时间戳
 * @param {string} date
 * @returns {number} 时间戳
 * */
 function dateToMs(date) {
  let result = new Date(date).getTime();
  return result;
}