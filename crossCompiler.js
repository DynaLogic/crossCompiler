var re = require('re');
var sys = require('sys');

var file = open(sys.argv[1],'r').read().splitlines();
var outputText = '';

function inQuotes(str, subStr) {
  var startQuote = "potato";
  var startIndex = -1;
  var endIndex = -1;
  for (var i in range(0,str.length)) {
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
  if(str.substring(startIndex,endIndex +1).indexOf(subStr) > -1){
    return true;
  }
  return false;
}

// console.log(file);
var inComment = false;
var indentLevel = 0;
for (var i in file) {
  var text = i.replace('\t', '').replace("  ", '').replace(";","");
  outputText += "  " *indentLevel;
  //single line comments
  if (text.startswith("//")) {
    outputText += text.replace("//", "#") + "\n";
    continue;
  }
  //multi line comments
  if(text.startswith("/*")) {
    inComment = true;
  }
  if (inComment) {
    outputText += "#" + text.replace("/*", "").replace("*/", "") + "\n";
    if (text.endswith("*/")) {
      inComment = false;
    }
    continue;
  }
  //requiring / import external libs
  if (re.search('.*(?= = require)',text) && text.startswith('var')) {
    //console.log(text.replace(/(= require)\(.*\)/,'').substring(4)+ " L" + (Number.parseInt(i)+1));
    outputText += "import " + text[text.index('(') + 2:len(text) - 3] + " as " + re.sub('(= require)\(.*\);', '',text)[4:] + "\n";
    continue;
  }
  //vars
  if (text.startswith("var ")) {
    outputText += text[4:].replace(";", "") + "\n";
    continue;
  }

  if (text.endswith("{")) {
    outputText += text.replace("{", ":") + "\n";
    indentLevel+=1;
    continue;
  }
  if (text.endswith("}")) {
    outputText += text.replace("}", "\n");
    indentLevel-=1;
    continue;
  }
  //console.log(text + " L" + (Number.parseInt(i)+1));
  //default output
  outputText += text + "\n";
}
print(outputText);