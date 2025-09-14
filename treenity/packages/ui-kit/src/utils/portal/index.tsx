import { Component, createElement } from 'react';
import { createPortal } from 'react-dom';
import { IPortalHandlerProps, IPortalProps, IPortals } from './types';

const portals: IPortals = {};

export class PortalHandler extends Component<IPortalHandlerProps> {
  private element?: Element;

  componentDidMount() {
    const { name, multi } = this.props;
    let portal = portals[name];
    if (!this.element) return;

    if (!portal) {
      portal = { el: [this.element] };
      portals[name] = portal;
    } else if (!multi && portal.el?.length) {
      throw new Error(`Portal with name ${name} already exists`);
    } else {
      if (!portal.el) {
        portal.el = [];
      }
      portal.el?.push(this.element);
      if (portal.comp) {
        portal.comp.forceUpdate();
      }
    }
  }

  componentWillUnmount() {
    delete portals[this.props.name];
  }

  setRef = (ref: any) => (this.element = ref);

  render() {
    return createElement(this.props.component ?? 'span', { ref: this.setRef });
  }
}

export class Portal extends Component<IPortalProps> {
  render() {
    const { name, children } = this.props;

    if (!children) {
      return null;
    }

    const portal = portals[name];

    if (!portal || !portal.el) {
      portals[name] = { comp: this };
      return null;
    }
    return <>{portal.el.map((el, index) => createPortal(children, el))}</>;
  }
}
