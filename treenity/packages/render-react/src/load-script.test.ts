import { jsxToHtm } from './jsx-parser';

const x: string = ';';

describe('jsx load-script', () => {
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
      // console.log(htmlText);
    });

    it('full-file', () => {
      const code = `
import test from 'test';

const divs = '<div></div> <div></div>';

// <div></div> <div></div>

export const Comp = () => {
  return (<div className="test-class" help="help me">
    {1 + 1}
    text
    <SomeElement 
      onClick={() => { console.log('some tag { \` <div></div>'); } } 
      render={() => <div>render test</div>}>
      {2 + 2}
    </SomeElement>
  </div>);
};

export default Comp;
`;

      const htmlText = jsxToHtm(code);

      expect(htmlText).toBe('html`<div />`');
    });

    it('end-of-line - regression', () => {
      const htmlText = jsxToHtm(`<div />`);

      expect(htmlText).toBe('html`<div />`');
    });

    it('inner tags', () => {
      const htmlText = jsxToHtm(`<div className="<div></div>" />`);

      expect(htmlText).toBe('html`<div className="<div></div>" />`');
    });
  });
});
