export const omitProps = (...props: string[]) => ({
  shouldForwardProp: (name: string) => !props.includes(name) && name[0] !== '$',
});
