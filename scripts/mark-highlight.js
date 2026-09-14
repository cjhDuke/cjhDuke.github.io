'use strict';

const highlightPattern = /^==((?:(?!==)[^\n])+)==/;

hexo.extend.filter.register('before_generate', function () {
  for (const modelName of ['Post', 'Page']) {
    const documents = this.model(modelName).toArray();

    for (const document of documents) {
      if (typeof document._content === 'string' && document._content.includes('==')) {
        document.content = null;
      }
    }
  }
}, 1);

hexo.extend.filter.register('marked:extensions', function (extensions) {
  extensions.push({
    name: 'markHighlight',
    level: 'inline',
    start(source) {
      const index = source.indexOf('==');
      return index === -1 ? undefined : index;
    },
    tokenizer(source) {
      const match = highlightPattern.exec(source);
      if (!match) return;

      return {
        type: 'markHighlight',
        raw: match[0],
        text: match[1],
        tokens: this.lexer.inlineTokens(match[1])
      };
    },
    renderer(token) {
      return `<mark>${this.parser.parseInline(token.tokens)}</mark>`;
    }
  });
});
