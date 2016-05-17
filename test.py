#!/bin/python
import re as re 
import sys as sys 

file = open(sys.argv[1],'r').read().splitlines()
outputText = ''

def inQuotes(str, subStr) :
  startQuote = "potato"
  startIndex = -1
  endIndex = -1
  for i in range0,str.length :
    if (str[i] == startQuote) :
      endIndex = i
      break
      
    if (str[i] == "'") :
      startQuote = "'"
      startIndex = i
      
    if (str[i] == '"') :
      startQuote = '"'
      startIndex = i
      
    
  if(str(startIndex,endIndex +1).indexOf(subStr) > -1):
    return True
    
  return False
  

# console.log(file)
inComment = False
indentLevel = 0
for i in file :
  text = i.replace('\t', '').replace("", '').replace(";","")
  outputText += "" *indentLevel
  #single line comments
  if (text.startswith("//")) :
    outputText += text.replace("//", "#") + "\n"
    continue
    
  #multi line comments
  if(text.startswith("/*")) :
    inComment = True
    
  if (inComment) :
    outputText += "#" + text.replace("/*", "").replace("*/", "") + "\n"
    if (text.endswith("*/")) :
      inComment = False
      
    continue
    
  #requiring / import external libs
  if (re.search('.*(?= = require)',text) and text.startswith('')) :
    #console.log(text.replace(/(= require)\(.*\)/,'').substring(4)+ " L" + (Number.parseInt(i)+1))
    outputText += "import " + text[text.index('(') + 2:len(text) - 3] + " as " + re.sub('(= require)\(.*\);', '',text)[4:] + "\n"
    continue
    
  #vars
  if (text.startswith("")) :
    outputText += text[4:].replace(";", "") + "\n"
    continue
    
  
  if (text.endswith("{")) :
    outputText += text.replace("{", ":") + "\n"
    indentLevel+=1
    continue
    
  if (text.endswith("}")) :
    outputText += text.replace("}", "\n")
    indentLevel-=1
    continue
    
  #console.log(text + " L" + (Number.parseInt(i)+1))
  #default output
  outputText += text + "\n"
  
print(outputText)

