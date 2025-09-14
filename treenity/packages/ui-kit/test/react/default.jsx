import ReactSelect from '/esmsh/react-select';
// const { default: ReactSelect } = await uix.require('https://esm.sh/v82/react-select@5.3.2/es2022/react-select.bundle.js');

const options = [{ label: 'test', value: 'test' } , { label: 'test1', value: 'test1' }];

uix.add(() => {
  const [value, setValue] = uix.React.useState();
  return <div>
    <div>Hello from test</div>
    <ReactSelect value={value} onChange={setValue} options={options}/>
  </div>;
});
