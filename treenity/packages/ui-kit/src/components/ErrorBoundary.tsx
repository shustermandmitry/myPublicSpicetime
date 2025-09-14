import React from 'react';

export class ErrorBoundary extends React.Component<any, { error?: Error }> {
  constructor(props: any) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.children.props?.id !== this.props.children?.props?.id) {
      this.setState({ error: undefined });
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    const { error } = this.state;
    // useEffect(() => {
    //   if (error) console.error('ErrorBoundary', error);
    // }, [error]);
    if (error) {
      console.error('ErrorBoundary', error.stack);
      // You can render any custom fallback UI

      return (
        <div className="error-wrapper">
          <div className="error-button">
            <span className="error-text">Error</span>
            <span className="error-button-text">?</span>
            <pre className="card error error-full-text">{error.stack}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
