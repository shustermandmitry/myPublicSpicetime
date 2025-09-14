const JSX_MODES = {
  TEXT: 0,
  TAG_START: 1,
  TAG_NAME: 2,
  PROPS: 3,
  PROP_NAME: 4,
  PROP_VALUE: 5,
  CHILD_START: 6,
};

export class JSXParser {
  constructor(options = {}) {
    this.pos = 0;
    this.input = '';
    // this.mode = JSX_MODES.TEXT;
    // this.stack = [];
    this.buffer = '';
    this.current = null;
    this.createElementFn = options.createElement || 'createElement';
  }

  parseFile(content) {
    this.input = content;
    this.pos = 0;
    const nodes = [];

    while (this.pos < this.input.length) {
      const char = this.input[this.pos];

      if (char === '<' && this.input[this.pos + 1] !== '/') {
        if (this.buffer.trim()) {
          nodes.push(this.parseTextNode(this.buffer));
        }
        nodes.push(this.parseJSXElement());
        this.buffer = '';
      } else {
        this.buffer += char;
        this.pos++;
      }
    }

    if (this.buffer) {
      nodes.push({
        type: 'JSXExpression',
        value: this.buffer,
      });
    }

    return nodes;
  }

  parseJSXElement() {
    this.pos++; // Skip <
    const tagName = this.parseTagName();
    const props = this.parseProps();
    const children = [];

    if (this.input[this.pos] === '/') {
      this.pos += 2; // Skip />
      return {
        type: 'JSXElement',
        tagName,
        props,
        children,
      };
    }

    this.pos++; // Skip >

    while (this.pos < this.input.length) {
      if (this.input[this.pos] === '<' && this.input[this.pos + 1] === '/') {
        this.pos += 2;
        const closeTag = this.parseTagName();
        if (closeTag !== tagName) {
          throw new Error(`Tag mismatch: ${closeTag} !== ${tagName}`);
        }
        this.pos += 1; // Skip >
        break;
      }

      if (this.input[this.pos] === '<') {
        children.push(this.parseJSXElement());
      } else {
        const text = this.parseText();
        if (typeof text === 'string') {
          if (text.trim()) {
            children.push(this.parseTextNode(text));
          }
        } else {
          children.push(text);
        }
      }
    }

    return {
      type: 'JSXElement',
      tagName,
      props,
      children,
    };
  }

  parseTagName() {
    let name = '';
    while (this.pos < this.input.length) {
      const char = this.input[this.pos];
      if (char === ' ' || char === '>' || char === '/') {
        break;
      }
      name += char;
      this.pos++;
    }
    return name;
  }

  parseProps() {
    const props = {};

    while (this.pos < this.input.length) {
      const char = this.input[this.pos];

      if (char === '>' || char === '/') {
        break;
      }

      if (char === ' ') {
        this.pos++;
        continue;
      }

      const propName = this.parsePropName();
      if (!propName) break;

      let propValue = true;
      if (this.input[this.pos] === '=') {
        this.pos++; // Skip =
        propValue = this.parsePropValue();
      }

      props[propName] = propValue;
    }

    return props;
  }

  parsePropName() {
    let name = '';
    while (this.pos < this.input.length) {
      const char = this.input[this.pos];
      if (char === '=' || char === ' ' || char === '>' || char === '/') {
        break;
      }
      name += char;
      this.pos++;
    }
    return name;
  }

  parsePropValue() {
    const quote = this.input[this.pos];
    if (quote !== '"' && quote !== "'") {
      return this.parseJSExpression();
    }

    this.pos++; // Skip quote
    let value = '';
    while (this.pos < this.input.length) {
      const char = this.input[this.pos];
      if (char === quote) {
        this.pos++;
        break;
      }
      value += char;
      this.pos++;
    }
    return value;
  }

  parseText() {
    let text = '';
    while (this.pos < this.input.length) {
      const char = this.input[this.pos];
      if (char === '<') {
        break;
      }
      if (char === '{') {
        if (text) {
          this.buffer = text;
          return text;
        }
        return this.parseJSExpression();
      }
      text += char;
      this.pos++;
    }
    return text;
  }

  parseTextNode(text) {
    return {
      type: 'JSXText',
      value: text,
    };
  }

  parseJSExpression() {
    let brackets = 1;
    let expr = '';
    this.pos++; // Skip {

    while (this.pos < this.input.length && brackets > 0) {
      const char = this.input[this.pos];
      if (char === '{') brackets++;
      if (char === '}') brackets--;
      if (brackets === 0) break;
      expr += char;
      this.pos++;
    }

    this.pos++; // Skip closing }
    return {
      type: 'JSXExpression',
      value: expr,
    };
  }

  generateCode(ast) {
    if (!ast) return '';

    if (Array.isArray(ast)) {
      return ast.map(node => this.generateCode(node)).join('');
    }

    if (ast.type === 'JSXText') {
      return ast.value.includes('{') ? ast.value : `"${ast.value}"`;
    }

    if (ast.type === 'JSXExpression') {
      return ast.value;
    }

    const props = Object.entries(ast.props)
      .map(([key, value]) => {
        if (value === true) return key;
        if (value.type === 'JSXExpression') {
          return `${key}: ${value.value}`;
        }
        return `${key}: "${value}"`;
      })
      .join(', ');

    const isComponent = /^[A-Z]/.test(ast.tagName);
    const elementName = isComponent ? ast.tagName : `"${ast.tagName}"`;

    const children = ast.children
      .map(child => this.generateCode(child))
      .filter(Boolean)
      .join(', ');

    return `${this.createElementFn}(${elementName}, { ${props} }${children ? `, ${children}` : ''})`;
  }
}

export const parseJSX = (content, options = {}) => {
  const parser = new JSXParser(options);
  const ast = parser.parseFile(content);
  return parser.generateCode(ast);
};
