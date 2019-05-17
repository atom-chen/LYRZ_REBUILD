'use strict';

var path = require('path');
var fs = require('fs');
var javaScriptObfuscator = require('javascript-obfuscator');
var imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var uglifyJS = require("uglify-js");

var path = require('path');
var fs = require('fs');
var localResTextrue2DUUIDs = [];
var subPackages = [];
var subPackageIndex = 0;
var rootPath = ''
var savedPaths = new Set();
var ignorePaths = new Set();

function onBuildFinish(options, callback) {
  Editor.log("onBuildFinish");

  if (options.platform != "wechatgame") {
    callback();
    return;
  }

  var srcDic = path.join(options.dest, "src/");
  var files = fs.readdirSync(srcDic);
  var projectJsPath = "";
  files.forEach(function (file) {
    if (file.indexOf("project") != -1) {
      projectJsPath = path.join(srcDic, file);
    }
  });

  var configStr = fs.readFileSync(options.dest + "/../../packages/wegamebuilder/config.json", 'utf8');
  let config = JSON.parse(configStr);

  if (config.obfuscate) {
    obfuscate(projectJsPath);
  }

  if (config.compressImage) {
    let imageDic = path.join(options.dest, "res/raw-assets");
    compressImage(imageDic);
  }

  if (config.subpackage) {
    buildSubPackages(options);
  }

  callback();
}

function obfuscate(filePath) {
  var script = fs.readFileSync(filePath, 'utf8');
  var obfuscationResult = javaScriptObfuscator.obfuscate(
    script,
    {
      compact: false,
      controlFlowFlattening: true
    }
  );
  fs.writeFileSync(filePath, obfuscationResult);
  var script = fs.readFileSync(filePath, 'utf8');
  var compressResult = uglifyJS.minify(script);
  Editor.log(compressResult.error);
  Editor.log(compressResult.code);
  fs.writeFileSync(filePath, compressResult.code);
  Editor.log("obfuscate over");
}

function compressImage(fileUrl) {
  var files = fs.readdirSync(fileUrl);
  files.forEach(function (file) {
    let subDic = path.join(fileUrl, file);
    console.log(subDic);
    var stats = fs.statSync(subDic);
    if (stats.isDirectory()) {
      (async () => {
        var files = await imagemin([subDic + '/*.png'], subDic, {
          plugins: [
            imageminPngquant({ quality: '65-80' })
          ]
        });
        for (fileInfo of files) {
          Editor.log("compressed:" + fileInfo.path);
        }
      })();
    }
  });
  Editor.log("compress over");
}

function getDependencies(options) {
  var prefabUrl = 'db://assets/scenes/load.fire';
  var prefabUuid = Editor.assetdb.urlToUuid(prefabUrl);

  // 通过 options.buildResults 访问 BuildResults
  var buildResults = options.buildResults;
  // 获得指定资源依赖的所有资源
  var depends = buildResults.getDependencies(prefabUuid);

  for (var i = 0; i < depends.length; ++i) {
    var uuid = depends[i];

    var url = Editor.assetdb.uuidToUrl(uuid);
    // 获取资源类型
    var type = buildResults.getAssetType(uuid);
    // 获得资源在项目中的绝对路径
    var path = Editor.assetdb.uuidToFspath(uuid);

    if (type == "cc.Texture2D" || type == "cc.AudioClip") {
      localResTextrue2DUUIDs.push(uuid);
    }
    else {
      Editor.log(type)
    }
  }
}

function buildSubPackages(options) {
  subPackages = [];
  subPackageIndex = 0;
  savedPaths = new Set();
  ignorePaths = new Set();

  var readIgnorePaths = function (fileUrl) {
    var files = fs.readdirSync(fileUrl);
    files.forEach(function (file) {
      var stats = fs.statSync(fileUrl + '/' + file);
      if (stats.isDirectory()) {
        readIgnorePaths(fileUrl + '/' + file);
      } else {
        if (localResTextrue2DUUIDs != null && localResTextrue2DUUIDs.length > 0) {
          for (let i = 0; i < localResTextrue2DUUIDs.length; i++) {
            if (file.indexOf(localResTextrue2DUUIDs[i]) != -1) {
              let ignorePath = 'res/raw-assets/' + file.substring(0, 2) + "/";
              if (!ignorePaths.has(ignorePath)) {
                ignorePaths.add(ignorePath);
                Editor.log("ignore:" + ignorePath);
              }
            }
          }
        }
      }
    });
  }

  var writeGameJs = function (fileUrl) {
    var files = fs.readdirSync(fileUrl);//读取该文件夹
    files.forEach(function (file) {
      var stats = fs.statSync(fileUrl + '/' + file);
      if (stats.isDirectory()) {
        writeGameJs(fileUrl + '/' + file);
      } else {
        if ((stats.size / 1024) > 100) {
          let filePath = 'res/raw-assets/' + file.substring(0, 2) + "/";
          if (!ignorePaths.has(filePath) && !savedPaths.has(filePath)) {
            let path = rootPath + '/res/raw-assets/' + file.substring(0, 2) + "/";
            let gameJs = path + 'game.js';
            fs.writeFileSync(gameJs, '');

            subPackageIndex++;
            subPackages.push({ "name": subPackageIndex + "", "root": filePath })
            savedPaths.add(filePath);
          }
        }
      }
    });
  }

  var editGameJs = function (dir) {

    let gamePath = path.join(dir, 'game.json');
    var data = fs.readFileSync(gamePath, 'utf-8');
    var gameJson = JSON.parse(data);
    if (gameJson) {
      gameJson.subpackages = subPackages;
    }
    Editor.log("total subpackge count:" + subPackageIndex);
    fs.writeFileSync(gamePath, JSON.stringify(gameJson));
  }

  var editMainJs = function (dir) {
    let gamePath = path.join(dir, 'game.js');
    var data = fs.readFileSync(gamePath, 'utf-8');
    data += '\n' + 'window.subpackageMaxIndex =' + subPackageIndex + ';';

    fs.writeFileSync(gamePath, data);
  }

  if (options.platform == "wechatgame") {
    rootPath = options.dest;
    let rawassetsUrl = path.join(options.dest, 'res', 'raw-assets');
    getDependencies(options);
    readIgnorePaths(rawassetsUrl);
    writeGameJs(rawassetsUrl);
    editGameJs(options.dest);
    editMainJs(options.dest);
    Editor.log("subpackage over");
  }
}

module.exports = {
  load() {
    Editor.Builder.on('build-finished', onBuildFinish);
  },

  unload() {
    Editor.Builder.removeListener('build-finished', onBuildFinish);
  },
}

