const fs = require('fs-extra');
const glob = require('glob-promise');
const path = require('path');
const Promise = require('bluebird');

const syntaxExtentionMap = {
  css: 'css',
  sass: 's[ac]ss',
  scss: 'scss',
  stylus: 'styl',
  less: 'less',
};

const generateStyleIndex = async function(
  { root, src, syntax },
  eventHandlers = {}
) {
  if (!(syntax in syntaxExtentionMap)) {
    throw new Error(`${syntax} syntax is not compatible.`);
  }

  const extension = syntaxExtentionMap[syntax];
  const indexRegExp = new RegExp(`index\.${extension}$`, 'i');
  const syntaxRegExp = new RegExp(`\.${extension}$`, 'i');

  async function getDirs(cwd) {
    const dirs = await glob('**/*/', {
      absolute: true,
      cwd,
    });

    return dirs;
  }

  async function getFiles(cwd) {
    const files = await glob('*', {
      cwd,
    }).then(results => results.filter(f => !indexRegExp.test(f)));

    return files;
  }

  function filenameToImportRule(filename) {
    if (!syntaxRegExp.test(filename)) {
      filename = `${filename}/index`;
    }

    return `@import '${filename.replace(syntaxRegExp, '')}';`;
  }

  async function generateIndex(dir) {
    const files = await getFiles(dir);

    if (!files || !files.length) {
      return;
    }

    const filePath = path.join(dir, 'index.scss');
    const content = `${files.map(filenameToImportRule).join('\n')}\n`;

    if ('file' in eventHandlers) {
      eventHandlers.file(path.relative(root, filePath));
    }

    return fs.outputFile(filePath, content);
  }

  async function init() {
    if ('before' in eventHandlers) {
      eventHandlers.before();
    }

    const dirs = await getDirs(src);

    await Promise.map(dirs, generateIndex);

    if ('after' in eventHandlers) {
      eventHandlers.after();
    }
  }

  await init();
};

module.exports = generateStyleIndex;
