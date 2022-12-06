export const getFormattedText = (oTextarea) => {
  oTextarea.style.padding = '0px';
  oTextarea.style.border = 'none';
  if (oTextarea.wrap) {
    oTextarea.setAttribute("wrap", "off");
  }
  else {
    oTextarea.setAttribute("wrap", "off");
    var newArea = oTextarea.cloneNode(true);
   // newArea.value = oTextarea.value;
   // oTextarea.parentNode.replaceChild(newArea, oTextarea);
   // oTextarea = newArea;
  }

  var strRawValue = oTextarea.value;
 // oTextarea.value = "";
  var nEmptyWidth = oTextarea.scrollWidth;

  function testBreak(strTest) {
    oTextarea.value = strTest;
    return oTextarea.scrollWidth > nEmptyWidth;
  }
  function findNextBreakLength(strSource, nLeft, nRight) {
    var nCurrent;
    if(typeof(nLeft) == 'undefined') {
      nLeft = 0;
      nRight = -1;
      nCurrent = 64;
    }
    else {
      if (nRight == -1)
        nCurrent = nLeft * 2;
      else if (nRight - nLeft <= 1)
        return Math.max(2, nRight);
      else
        nCurrent = nLeft + (nRight - nLeft) / 2;
    }
    var strTest = strSource.substr(0, nCurrent);
    var bLonger = testBreak(strTest);
    if(bLonger)
      nRight = nCurrent;
    else
    {
      if(nCurrent >= strSource.length)
        return null;
      nLeft = nCurrent;
    }
    return findNextBreakLength(strSource, nLeft, nRight);
  }

  var i = 0, j;
  var strNewValue = "";
  while (i < strRawValue.length) {
    var breakOffset = findNextBreakLength(strRawValue.substr(i));
    if (breakOffset === null) {
      strNewValue += strRawValue.substr(i);
      break;
    }
    var nLineLength = breakOffset - 1;
    for (j = nLineLength - 1; j >= 0; j--) {
      var curChar = strRawValue.charAt(i + j);
      if (curChar == ' ' || curChar == '-' || curChar == '+') {
        nLineLength = j + 1;
        break;
      }
    }
    strNewValue += strRawValue.substr(i, nLineLength) + "\n";
    i += nLineLength;
  }
  //oTextarea.value = strNewValue;
  oTextarea.setAttribute("wrap", "");

  return oTextarea.value;
};
