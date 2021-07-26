var fs = require("fs");
var path = require("path");
var join = require("path").join;

window.onload = function () {
  /**

 * 

 * @param startPath  起始目录文件夹路径

 * @returns {Array}

 */
var btn = this.document.querySelector('#btn');
var text = this.document.getElementById('textarea')
function findSync(startPath) {
  let result = [];

  function finder(path) {
    let files = fs.readdirSync(path);

    files.forEach((val, index) => {
      let fPath = join(path, val);
      let stats = fs.statSync(fPath);
      if (stats.isDirectory()) finder(fPath);
      if (stats.isFile()) result.push(fPath);
    });
  }
  finder(startPath);

  return result;
}
var str = ''
console.log("text",text);
let fileNames = findSync("/Users/user/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/029B8667E85F1403F6A9F1060112E5E7/Caches/Files/2020-09/3b0f378f5b40e97e78fa0d8b93c2769b");
fileNames.map(item => {
  str+=`
    <div id="tree" data-url="${item}"> ${path.basename(item)}</div>
  `
  // $('#text').html(str);
  text.innerHTML = str;
  
})
var tree = this.document.querySelectorAll('#tree')
console.log(tree);

text.onclick = () => {
  let url = tree[1].getAttribute('data-url');
  console.log("url: ", url);
  fs.readFile(url,"utf-8",(err, data) => {
    console.log("fd",data);
    if(err) {console.log("err",err);}
});
}
// btn.onclick = function(){
//   text.innerHTML = fileNames;
// }
}