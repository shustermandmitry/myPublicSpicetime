function InputLabel({ htmlFor, children }) {
    return <label htmlFor={htmlFor}><span>{children}</span></label>;
}

uix.add(InputLabel);
