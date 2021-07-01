
export function getCookie(cname) {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function asciiToText(text) {
  const strings = text.split('\\');
  const result = strings.reduce((result, string, index) => {
    let t = string;
    if (index !== 0) t = String.fromCharCode(parseInt(string, 8));
    return result.concat(t);
  }, '');
  return result;
}
