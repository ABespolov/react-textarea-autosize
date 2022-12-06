export const getFormattedText = (oTextarea) => {
  oTextarea.style.padding = '0px';
  oTextarea.style.border = 'none';
  if (oTextarea.wrap) {
    oTextarea.setAttribute('wrap', 'off');
  } else {
    oTextarea.setAttribute('wrap', 'off');
    const newArea = oTextarea.cloneNode(true);
    newArea.value = oTextarea.value;
    //oTextarea.parentNode.replaceChild(newArea, oTextarea);
    //  oTextarea = newArea;
  }

  const strRawValue = oTextarea.value;
  oTextarea.value = '';
  const nEmptyWidth = oTextarea.scrollWidth;
  let nLastWrappingIndex = -1;
  for (let i = 0; i < strRawValue.length; i++) {
    const curChar = strRawValue.charAt(i);
    if (curChar == ' ' || curChar == '-' || curChar == '+')
      nLastWrappingIndex = i;
    oTextarea.value += curChar;
    if (oTextarea.scrollWidth > nEmptyWidth) {
      let buffer = '';
      if (nLastWrappingIndex >= 0) {
        for (let j = nLastWrappingIndex + 1; j < i; j++)
          buffer += strRawValue.charAt(j);
        nLastWrappingIndex = -1;
      }
      buffer += curChar;
      oTextarea.value = oTextarea.value.substr(
          0,
          oTextarea.value.length - buffer.length,
      );
      oTextarea.value += '\n' + buffer;
    }
  }
  oTextarea.removeAttribute('wrap');

  return oTextarea.value;
};
