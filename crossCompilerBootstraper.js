var fs = require('fs');
var file = fs.readFileSync(process.argv[2], 'utf8');


function inQuotes(str, subStr) {
  var startQuote = "potato";
  var startIndex = -1;
  var endIndex = -1;
  for (var i = 0; i < str.length; i++) {
    if (str[i] == startQuote) {
      endIndex = i;
      break;
    }
    if (str[i] == "'") {
      startQuote = "'";
      startIndex = i;
    }
    if (str[i] == '"') {
      startQuote = '"';
      startIndex = i;
    }
  }
  if(str.substring(startIndex,endIndex +1).indexOf(subStr) > -1){return true;}
  return false;
}


var outputText = '#!/bin/python\n';
/*
what is
a muliline comment
*/
file = file.split("\n");
// console.log(file);
var inComment = false;
var indentLevel = 0;
for (var i in file) {
  var text = file[i].replace('\t', '').replace(/  /g, '');
  if (text.endsWith(";")) {
    text = text.substring(0, text.length - 1);
  }
  outputText += "  ".repeat(indentLevel);
  //single line comments
  if (text.startsWith("//") && !inQuotes(text,"//")) {
    outputText += text.replace("//", "#") + "\n";
    continue;
  }
  //multi line comments
  inComment = text.startsWith("/*") ? true : inComment;
  if (inComment) {
    outputText += "#" + text.replace("/*", "").replace("*/", "") + "\n";
    inComment = text.endsWith("*/") ? false : inComment;
    continue;
  }
  //requiring / import external libs
  if (text.search(/.*(?= = require)/) > -1 && text.startsWith('var')) {
    //console.log(text.replace(/(= require)\(.*\)/,'').substring(4)+ " L" + (Number.parseInt(i)+1));
    outputText += "import " + text.substring(text.indexOf('(') + 2, text.length - 2) + " as " + text.substring(4, text.indexOf("=")) + "\n";
    continue;
  }
  //vars
  if(text.startsWith("for")) {
    text = text.replace(/(\(|\))/g,"");
  }
  text = text.replace(/var ?/, "").replace(/function/,"def").replace(/&&/g,"and").replace(/\|\|/g,"or").replace("false","False").replace("true","True");
  text = text.replace(/.substring/,"");
  if (text.endsWith("{")) {
    outputText += text.substring(0,text.lastIndexOf("{")) + ":" + "\n";
    indentLevel++;
    continue;
  }
  if (text.endsWith("}")) {
    outputText += text.replace("}", "\n");
    indentLevel--;
    continue;
  }
  //console.log(text + " L" + (Number.parseInt(i)+1));
  //default output
  outputText += text + "\n";
}
console.log(outputText);
