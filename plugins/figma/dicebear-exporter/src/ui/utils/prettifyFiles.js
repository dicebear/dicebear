import prettier from 'prettier/standalone';
import parserMarkdown from 'prettier/parser-markdown';
import parserBabel from 'prettier/parser-babel';

export function prettifyFiles(files) {
  for (const fileName in files) {
    if (false === files.hasOwnProperty(fileName)) {
      continue;
    }

    const file = files[fileName];
    let parser;

    switch (fileName.split('.').pop()) {
      case 'ts':
        parser = 'babel-ts';
        break;

      case 'js':
        parser = 'babel';
        break;

      case 'md':
        parser = 'markdown';
        break;

      case 'json':
        parser = 'json';
        break;
    }

    if (parser) {
      files[fileName] = prettier.format(file, {
        parser,
        singleQuote: true,
        proseWrap: 'always',
        plugins: [parserMarkdown, parserBabel],
      });
    }
  }

  return files;
}
