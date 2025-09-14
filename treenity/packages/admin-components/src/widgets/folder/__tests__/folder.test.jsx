import { fireEvent, render } from '@testing-library/preact';
import Folder from '..';
import FolderEmpty from '../FolderEmpty.js';

jest.mock('antd/es/theme/export', () => ({
  useToken: () => ({
    token: {
      Layout: {
        colorBgHeader: '#FF0000',
      },
    },
  }),
}));

describe('Folder', () => {
  const title = 'Test title';
  const subtitle = 'Test subtitle';
  const img = 'test-image';
  const link = 'test-link';
  const defaultType = 'folder';

  describe('Folder type component', () => {
    const type = 'folder';

    it('Render', async () => {
      const disabled = false;
      const { container } = render(
        <Folder title={title} subtitle={subtitle} image={img} link={link} type={type} />,
      );

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const headerButtons = header.querySelector('div[class="header-buttons"]');
      const icon = iconWrapper.querySelector('i');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent).toHaveAttribute('href', link);
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(headerButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass(`anticon icon`);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(`root ${type}`);
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeInTheDocument();
      expect(titleComponent.getAttribute('class')).toMatch(/text-content_headline title/gi);
      expect(titleComponent).toHaveTextContent(title);
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(subtitle);
      expect(footerButton).toBeNull();
    });

    it('Render with disable', async () => {
      const disabled = true;
      const { container } = render(
        <Folder
          disabled={disabled}
          title={title}
          subtitle={subtitle}
          image={img}
          link={link}
          type={type}
        />,
      );

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${type} ${disabled ? 'disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const headerButtons = header.querySelector('div[class="header-buttons"]');
      const icon = iconWrapper.querySelector('i');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent).not.toHaveAttribute('href', link);
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(headerButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass(`anticon icon`);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(`root ${type}`);
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeInTheDocument();
      expect(titleComponent.getAttribute('class')).toMatch(/text-content_headline title/gi);
      expect(titleComponent).toHaveTextContent(title);
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(subtitle);
      expect(footerButton).toBeNull();
    });

    it('Render without params', async () => {
      const disabled = false;
      const { container } = render(<Folder link={link} />);

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${defaultType}${disabled ? ' disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const headerButtons = header.querySelector('div[class="header-buttons"]');
      const icon = iconWrapper.querySelector('i');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent).toHaveAttribute('href', link);
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${defaultType} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(headerButtons).toBeNull();
      expect(image).toBeNull();
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass(`anticon icon`);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(`root ${type}`);
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeNull();
      expect(subtitleComponent).toBeNull();
      expect(footerButton).toBeNull();
    });
  });

  describe('Template type component', () => {
    const type = 'template';

    it('Render', async () => {
      const disabled = false;
      const { container } = render(
        <Folder title={title} subtitle={subtitle} image={img} link={link} type={type} />,
      );

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const headerButtons = header.querySelector('div[class="header-buttons"]');
      const icon = iconWrapper.querySelector('i');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent).toHaveAttribute('href', link);
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(headerButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass(`anticon icon`);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(`root add-table`);
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeInTheDocument();
      expect(titleComponent.getAttribute('class')).toMatch(/text-content_headline title/gi);
      expect(titleComponent).toHaveTextContent(title);
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(subtitle);
      expect(footerButton).toBeNull();
    });

    it('Render with disable', async () => {
      const disabled = true;
      const { container } = render(
        <Folder
          disabled={disabled}
          title={title}
          subtitle={subtitle}
          image={img}
          link={link}
          type={type}
        />,
      );

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${type} ${disabled ? 'disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const headerButtons = header.querySelector('div[class="header-buttons"]');
      const icon = iconWrapper.querySelector('i');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent).not.toHaveAttribute('href', link);
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(headerButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass(`anticon icon`);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(`root add-table`);
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeInTheDocument();
      expect(titleComponent.getAttribute('class')).toMatch(/text-content_headline title/gi);
      expect(titleComponent).toHaveTextContent(title);
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(subtitle);
      expect(footerButton).toBeNull();
    });

    it('Render without params', async () => {
      const disabled = false;
      const { container } = render(<Folder link={link} />);

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${defaultType}${disabled ? ' disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const headerButtons = header.querySelector('div[class="header-buttons"]');
      const icon = iconWrapper.querySelector('i');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent).toHaveAttribute('href', link);
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${defaultType} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(headerButtons).toBeNull();
      expect(image).toBeNull();
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass(`anticon icon`);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(`root folder`);
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeNull();
      expect(subtitleComponent).toBeNull();
      expect(footerButton).toBeNull();
    });
  });

  describe('Project type component', () => {
    const type = 'project';
    it('Render', async () => {
      const disabled = false;
      const { container } = render(
        <Folder title={title} subtitle={subtitle} image={img} link={link} type={type} />,
      );

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const headerButtons = header.querySelector('div[class="header-buttons"]');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent.getAttribute('href')).toBeNull();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(headerButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeNull();
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeNull();
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(title);
      expect(footerButton).toBeNull();
    });

    it('Render with disable', async () => {
      const disabled = true;
      const { container } = render(
        <Folder
          disabled={disabled}
          title={title}
          subtitle={subtitle}
          image={img}
          link={link}
          type={type}
        />,
      );

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const headerButtons = header.querySelector('div[class="header-buttons"]');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent).not.toHaveAttribute('href', link);
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(headerButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeNull();
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeNull();
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(title);
      expect(footerButton).toBeNull();
    });

    it('Render without params', async () => {
      const disabled = false;
      const { container } = render(<Folder link={link} />);

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${defaultType}${disabled ? ' disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const headerButtons = header.querySelector('div[class="header-buttons"]');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent).toHaveAttribute('href', link);
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${defaultType} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(headerButtons).toBeNull();
      expect(image).toBeNull();
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass(`anticon icon`);
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeNull();
      expect(subtitleComponent).toBeNull();
      expect(footerButton).toBeNull();
    });

    it('Hovering', async () => {
      const disabled = false;
      const { container } = render(
        <Folder title={title} subtitle={subtitle} image={img} link={link} type={type} />,
      );

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const beforeHeaderButtons = header.querySelector('div[class="header-buttons"]');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent.getAttribute('href')).toBeNull();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(beforeHeaderButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeNull();
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeNull();
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(title);
      expect(footerButton).toBeNull();

      fireEvent(
        root,
        new MouseEvent('mouseover', {
          bubbles: true,
          cancelable: true,
        }),
      );

      const afterHeaderButtons = header.querySelector('div[class="header-buttons"]');
      const headerButtonsItem = afterHeaderButtons.querySelector('button');
      const headerButtonsIconWrapper = headerButtonsItem.querySelector('span[class="anticon"]');
      const headerButtonsIcon = headerButtonsIconWrapper.querySelector(
        'i[class="root select-outline"]',
      );
      const headerButtonsText = headerButtonsItem.querySelector('span:not([class="anticon"])');

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(afterHeaderButtons).toBeInTheDocument();
      expect(afterHeaderButtons).toHaveClass(`header-buttons`);
      expect(headerButtonsItem).toBeInTheDocument();
      expect(headerButtonsItem).toHaveAttribute('type', 'button');
      expect(headerButtonsItem).toHaveClass('ant-btn ant-btn-primary ant-btn-background-ghost');
      expect(headerButtonsIconWrapper).toBeInTheDocument();
      expect(headerButtonsIconWrapper).toHaveClass('anticon');
      expect(headerButtonsIcon).toBeInTheDocument();
      expect(headerButtonsIcon).toHaveClass('root select-outline');
      expect(headerButtonsText).toBeInTheDocument();
      expect(headerButtonsText).toHaveTextContent('Selected');
    });

    it('Hovering with disabled', async () => {
      const disabled = true;
      const { container } = render(
        <Folder
          disabled={disabled}
          title={title}
          subtitle={subtitle}
          image={img}
          link={link}
          type={type}
        />,
      );

      const linkComponent = container.querySelector('a');
      const root = linkComponent.querySelector(
        `div[class="root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const header = root.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const beforeHeaderButtons = header.querySelector('div[class="header-buttons"]');
      const footer = root.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent.getAttribute('href')).toBeNull();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(beforeHeaderButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeNull();
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeNull();
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(title);
      expect(footerButton).toBeNull();

      fireEvent(
        root,
        new MouseEvent('mouseover', {
          bubbles: true,
          cancelable: true,
        }),
      );

      const afterHeaderButtons = header.querySelector('div[class="header-buttons"]');

      expect(linkComponent).toMatchSnapshot();
      expect(afterHeaderButtons).toBeNull();
    });

    it('Selecting with Hovering', async () => {
      const disabled = false;
      const { container } = render(
        <Folder title={title} subtitle={subtitle} image={img} link={link} type={type} />,
      );

      const linkComponent = container.querySelector('a');
      const beforeRoot = linkComponent.querySelector(
        `div[class="root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const header = beforeRoot.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const beforeHoveringHeaderButtons = header.querySelector('div[class="header-buttons"]');
      const footer = beforeRoot.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent.getAttribute('href')).toBeNull();
      expect(beforeRoot).toBeInTheDocument();
      expect(beforeRoot).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(beforeHoveringHeaderButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeNull();
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeNull();
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(title);
      expect(footerButton).toBeNull();

      fireEvent(
        beforeRoot,
        new MouseEvent('mouseover', {
          bubbles: true,
          cancelable: true,
        }),
      );

      const afterHoveringHeaderButtons = header.querySelector('div[class="header-buttons"]');
      const beforeSelectionHeaderButtonsItem = afterHoveringHeaderButtons.querySelector('button');
      const beforeSelectionHeaderButtonsIconWrapper =
        beforeSelectionHeaderButtonsItem.querySelector('span[class="anticon"]');
      const beforeSelectionHeaderButtonsIcon =
        beforeSelectionHeaderButtonsIconWrapper.querySelector('i[class="root select-outline"]');
      const beforeSelectionHeaderButtonsText = beforeSelectionHeaderButtonsItem.querySelector(
        'span:not([class="anticon"])',
      );

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(afterHoveringHeaderButtons).toBeInTheDocument();
      expect(afterHoveringHeaderButtons).toHaveClass(`header-buttons`);
      expect(beforeSelectionHeaderButtonsItem).toBeInTheDocument();
      expect(beforeSelectionHeaderButtonsItem).toHaveAttribute('type', 'button');
      expect(beforeSelectionHeaderButtonsItem).toHaveClass(
        'ant-btn ant-btn-primary ant-btn-background-ghost',
      );
      expect(beforeSelectionHeaderButtonsIconWrapper).toBeInTheDocument();
      expect(beforeSelectionHeaderButtonsIconWrapper).toHaveClass('anticon');
      expect(beforeSelectionHeaderButtonsIcon).toBeInTheDocument();
      expect(beforeSelectionHeaderButtonsIcon).toHaveClass('root select-outline');
      expect(beforeSelectionHeaderButtonsText).toBeInTheDocument();
      expect(beforeSelectionHeaderButtonsText).toHaveTextContent('Selected');

      fireEvent(
        beforeSelectionHeaderButtonsItem,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      const afterSelectionRoot = linkComponent.querySelector(
        `div[class="root type-${type}${disabled ? ' disabled' : ''} selected"]`,
      );
      const afterSelectionHeaderButtons = header.querySelector('div[class="header-buttons"]');
      const afterSelectionHeaderButtonsItem = afterSelectionHeaderButtons.querySelector('button');
      const afterSelectionHeaderButtonsIconWrapper =
        afterSelectionHeaderButtonsItem.querySelector('span[class="anticon"]');
      const afterSelectionHeaderButtonsIcon =
        afterSelectionHeaderButtonsIconWrapper.querySelector('i[class="root select"]');
      const afterSelectionHeaderButtonsText = afterSelectionHeaderButtonsItem.querySelector(
        'span:not([class="anticon"])',
      );

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(afterSelectionRoot).toHaveClass(
        `root type-${type} ${disabled ? 'disabled' : ''} selected`,
      );
      expect(afterSelectionHeaderButtons).toBeInTheDocument();
      expect(afterSelectionHeaderButtons).toHaveClass(`header-buttons`);
      expect(afterSelectionHeaderButtonsItem).toBeInTheDocument();
      expect(afterSelectionHeaderButtonsItem).toHaveAttribute('type', 'button');
      expect(afterSelectionHeaderButtonsItem).toHaveClass('ant-btn ant-btn-primary');
      expect(afterSelectionHeaderButtonsIconWrapper).toBeInTheDocument();
      expect(afterSelectionHeaderButtonsIconWrapper).toHaveClass('anticon');
      expect(afterSelectionHeaderButtonsIcon).toBeInTheDocument();
      expect(afterSelectionHeaderButtonsIcon).toHaveClass('root select');
      expect(afterSelectionHeaderButtonsText).toBeInTheDocument();
      expect(afterSelectionHeaderButtonsText).toHaveTextContent('Selected');
    });

    it('Selecting with Hovering and disable', async () => {
      const disabled = true;
      const { container } = render(
        <Folder
          disabled={disabled}
          title={title}
          subtitle={subtitle}
          image={img}
          link={link}
          type={type}
        />,
      );

      const linkComponent = container.querySelector('a');
      const beforeRoot = linkComponent.querySelector(
        `div[class="root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const header = beforeRoot.querySelector('div[class="header"]');
      const image = header.querySelector('img');
      const iconWrapper = header.querySelector('span[class="anticon icon"]');
      const beforeHoveringHeaderButtons = header.querySelector('div[class="header-buttons"]');
      const footer = beforeRoot.querySelector('div[class="footer"]');
      const titleComponent = footer.querySelector('p[class$="text-content_headline title"]');
      const subtitleComponent = footer.querySelector('p[class$="text-content_paragraph subtitle"]');
      const footerButton = footer.querySelector('button[class^="grade"]');
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(linkComponent.getAttribute('href')).toBeNull();
      expect(beforeRoot).toBeInTheDocument();
      expect(beforeRoot).toHaveClass(`root type-${type} ${disabled ? 'disabled' : ''}`);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(`header`);
      expect(beforeHoveringHeaderButtons).toBeNull();
      expect(image).toBeInTheDocument();
      expect(image).toHaveAccessibleName(`${type}-image`);
      expect(image).toHaveClass(`image`);
      expect(image).toHaveAttribute('src', img);
      expect(iconWrapper).toBeNull();
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(`footer`);
      expect(titleComponent).toBeNull();
      expect(subtitleComponent).toBeInTheDocument();
      expect(subtitleComponent.getAttribute('class')).toMatch(/text-content_paragraph subtitle/gi);
      expect(subtitleComponent).toHaveTextContent(title);
      expect(footerButton).toBeNull();

      fireEvent(
        beforeRoot,
        new MouseEvent('mouseover', {
          bubbles: true,
          cancelable: true,
        }),
      );

      const afterHoveringHeaderButtons = header.querySelector('div[class="header-buttons"]');

      expect(linkComponent).toMatchSnapshot();
      expect(linkComponent).toBeInTheDocument();
      expect(afterHoveringHeaderButtons).toBeNull();
    });
  });
});

describe('Folder empty', () => {
  const defaultType = 'folder';

  describe('Folder type', () => {
    const type = 'folder';
    it('Render', async () => {
      const disabled = false;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={() => undefined} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-folder theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-folder theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);
    });

    it('Render without params', async () => {
      const disabled = false;
      const { container } = render(<FolderEmpty />);

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-folder theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-folder theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);
    });

    it('Render with disabled', async () => {
      const disabled = true;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={() => undefined} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-folder theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-folder theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);
    });

    it('Click event', async () => {
      const handleClick = jest.fn();
      const disabled = false;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={handleClick} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-folder theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-folder theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);

      fireEvent(
        root,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Click event with disable', async () => {
      const handleClick = jest.fn();
      const disabled = true;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={handleClick} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-folder theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-folder theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);

      fireEvent(
        root,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(handleClick).toHaveBeenCalledTimes(0);
    });
  });

  describe('Project type', () => {
    const type = 'project';
    it('Render', async () => {
      const disabled = false;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={() => undefined} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-square theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-square theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);
    });

    it('Render without params', async () => {
      const disabled = false;
      const { container } = render(<FolderEmpty />);

      const root = container.querySelector(
        `div[class="empty-root type-${defaultType}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-folder theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${defaultType}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-folder theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${defaultType}`);
    });

    it('Render with disabled', async () => {
      const disabled = true;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={() => undefined} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-square theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-square theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);
    });

    it('Click event', async () => {
      const handleClick = jest.fn();
      const disabled = false;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={handleClick} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-square theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-square theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);

      fireEvent(
        root,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Click event with disable', async () => {
      const handleClick = jest.fn();
      const disabled = true;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={handleClick} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-square theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-square theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);

      fireEvent(
        root,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(handleClick).toHaveBeenCalledTimes(0);
    });
  });

  describe('Template type', () => {
    const type = 'template';
    it('Render', async () => {
      const disabled = false;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={() => undefined} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-meta theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-meta theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);
    });

    it('Render without params', async () => {
      const disabled = false;
      const { container } = render(<FolderEmpty />);

      const root = container.querySelector(
        `div[class="empty-root type-${defaultType}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-folder theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${defaultType}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-folder theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${defaultType}`);
    });

    it('Render with disabled', async () => {
      const disabled = true;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={() => undefined} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-meta theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-meta theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);
    });

    it('Click event', async () => {
      const handleClick = jest.fn();
      const disabled = false;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={handleClick} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-meta theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-meta theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);

      fireEvent(
        root,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Click event with disable', async () => {
      const handleClick = jest.fn();
      const disabled = true;
      const { container } = render(
        <FolderEmpty type={type} disabled={disabled} onClick={handleClick} />,
      );

      const root = container.querySelector(
        `div[class="empty-root type-${type}${disabled ? ' disabled' : ''}"]`,
      );
      const iconWrapper = root.querySelector(`span[class="anticon empty-icon"]`);
      const icon = iconWrapper.querySelector(`i[class="root add-meta theme-gray"]`);
      const text = root.querySelector(`p`);
      const classes = container.querySelectorAll(`[class*='css-dev-only-do-not-override-']`);
      [...classes].map(i => {
        const dataMenuId = i.getAttribute('class');
        const res = dataMenuId.replace(
          /css-dev-only-do-not-override-[A-z,0-9]{7}/,
          'css-dev-only-do-not-override-123456',
        );
        return i.setAttribute('class', res);
      });

      expect(root).toMatchSnapshot();
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass(`empty-root type-${type}${disabled ? ' disabled' : ''}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('anticon empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('root add-meta theme-gray');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent(`Add ${type}`);

      fireEvent(
        root,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(handleClick).toHaveBeenCalledTimes(0);
    });
  });
});
