'use strict';

const { escapeHTML } = require('hexo-util');
const mathBlockMarker = 'class="preserved-display-math"';
const displayMath = /^\$\$[ \t]*\r?\n([\s\S]*?)\r?\n\$\$[ \t]*(?=\r?\n|$)/m;

// Hexo caches rendered posts independently of changes to renderer scripts.
hexo.extend.filter.register('before_generate', function () {
  const invalidations = [];

  for (const modelName of ['Post', 'Page']) {
    for (const document of this.model(modelName).toArray()) {
      if (document.markdown?.preserveDisplayMath === true &&
          document.content && !document.content.includes(mathBlockMarker) &&
          displayMath.test(document._content ?? '')) {
        delete document.content;
        invalidations.push(document.save());
      }
    }
  }

  return Promise.all(invalidations);
}, 1);

hexo.extend.filter.register('marked:extensions', function (extensions) {
  extensions.push({
    name: 'preserveDisplayMath',
    level: 'block',
    tokenizer(source) {
      if (this.lexer.options.preserveDisplayMath !== true || !source.startsWith('$$')) return;

      const match = displayMath.exec(source);
      if (!match || match.index !== 0) return;

      return { type: 'preserveDisplayMath', raw: match[0], tex: match[1] };
    },
    renderer({ tex }) {
      // Keep TeX intact for the MathJax filter that runs after Markdown rendering.
      return `<div ${mathBlockMarker}>$$\n${escapeHTML(tex)}\n$$</div>\n`;
    }
  });
});
