const fs = require('fs');

module.exports = class CopyJavascript {
  constructor(options) {
    this.options = options || {};
  }
  // https://segmentfault.com/a/1190000021214520
  apply() {
    const { from, to } = this.options;

    fs.readdirSync(from)
      .forEach((fileName) => {
        const file = fs.readFileSync(from + '\\' + fileName, 'utf8');
        if (fs.existsSync(to) === true) {
          fs.writeFile(to + '\\' + fileName, file, () => console.log(`copy javascript ${fileName} success`));
        } else {
          fs.mkdirSync(to);
          fs.writeFile(to + '\\' + fileName, file, () => console.log(`copy javascript ${fileName} success`));
        }
      });
  }
};