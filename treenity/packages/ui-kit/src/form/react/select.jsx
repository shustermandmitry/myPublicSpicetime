import ReactSelect from '/esmsh/react-select';

const {
  emotion: { useTheme },
  render,
  React,
} = uix;
// import { InputLabel } from './input-label';
const InputLabel = render('uix:form/react/input-label');
// import { useId } from '../hooks/use-id';

const customSelect = (theme) => ({
  control: () => ({
    height: 28,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    border: '1px solid #a7a2bd40',
    padding: '0 5px 0 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  valueContainer: () => ({
    height: 25,
    display: 'flex',
    alignItems: 'center',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  indicatorsContainer: () => ({
    padding: 0,
    height: 20,
  }),
  dropdownIndicator: () => ({
    padding: 0,
    height: 20,
    opacity: 0.2,
  }),
  placeholder: () => ({
    fontSize: 12,
    color: '#26233f66',
  }),
  singleValue: () => ({
    fontSize: 12,
    color: '#26233F',
  }),
  input: () => ({
    height: 28,
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: '#26233f',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 10,
    border: '1px solid #a7a2bd40',
    marginTop: 4,
    backgroundColor: '#ffffff',
    padding: 0,
    boxShadow: 'none',
    zIndex: '10',
  }),
  menuList: () => ({
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: 10,
    width: '100%',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    fontSize: 12,
    margin: 0,
    color: state.isSelected ? '#fff' : '#26233f',
    backgroundColor: state.isSelected ? theme.colors.accent : theme.colors.white,
    '&:hover': {
      backgroundColor: theme.colors.opacity('accent', 0.2),
    },
  }),
});

function Select({ label, options, value, onChange }) {
  const id = 'select-some-id'; //useId('select');
  // const theme = useTheme();
  const theme = {
    colors: {
      accent: '#aaa',
      white: '#fff',
      opacity(name) {
        return this[name];
      },
    },
  };
  const selectStyles = React.useMemo(() => customSelect(theme), [theme]);
  return (
    <>
      <InputLabel htmlFor={id} children={label} />
      <ReactSelect
        id={id}
        styles={selectStyles}
        options={options}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

uix.add(Select);
