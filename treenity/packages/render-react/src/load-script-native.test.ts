import { jsxToHtm } from './load-script-native';

const x: string = ';';

describe('load-script', () => {
  describe('compilation', () => {
    it('compile map', () => {
      const htmlText = jsxToHtm(`
<div>
{coins.chunk(2).map(ch => (
<div className="row">
  {ch.map(([name, quote, mint]) => 
  <div className="col-md-6">
    DFX/BUSD - 0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF 
    <a href="/pancake:chart:busd?coin=0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF">pancake chart</a>
    <Render id="pancake:chart:busd" coin="0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF" />
  </div>
)}
</div>
)}
</div>
      `);

      // console.log(htmlText);

      expect(htmlText).toBe(`
html\`<div>
\${coins.chunk(2).map(ch => (
html\`<div className="row">
  \${ch.map(([name, quote, mint]) => 
  html\`<div className="col-md-6">
    DFX/BUSD - 0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF 
    <a href="/pancake:chart:busd?coin=0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF">pancake chart</a>
    <\${Render} id="pancake:chart:busd" coin="0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF" />
  </div>\`
)}
</div>\`
)}
</div>\`
      `);
    });

    it('simple-to-native', () => {
      const htmlText = jsxToHtm(`
<div className="test" style={{ markIt: 'test' }}>
  <div />
</div>
      `);

      // console.log(htmlText);

      expect(htmlText).toBe(`
h('div', { className: 'test', style: { markIt: 'test' } },
  h('div')
)
`);
    });

    it('end-of-line - regression', () => {
      const htmlText = jsxToHtm(`<div />`);

      expect(htmlText).toBe('html`<div />`');
    });
  });
});
