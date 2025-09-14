import * as Button from '@/components/blocks/Button';
import { Carousel } from '@/components/blocks/Carousel';
import { HorizontalForm, VerticalForm } from '@/components/blocks/ContactForm';
import * as Container from '@/components/blocks/Container';
import { ContainerWithCards } from '@/components/blocks/ContainerWithCards';
import { HorizontalFooter, VerticalFooter } from '@/components/blocks/Footers';
import { DefaultHeader, HorizontalHeader, VerticalHeader } from '@/components/blocks/Headers';
import { DefaultHero, HorizontalHero, VerticalHero } from '@/components/blocks/Hero';
import * as TestHero from '@/components/blocks/Hero/test-hero';
import * as Image from '@/components/blocks/Image';
import * as RichEditor from '@/components/blocks/RichEditor';
import * as Video from '@/components/blocks/Video';
import * as WebEditor from '@/components/Editor';

import { MetaName } from '@treenity/core';
import { FC } from 'react';

import * as Checkbox from './Checkbox';
import * as CodeComponent from './CodeComponent';
import * as Collapse from './Collapse';
import * as Input from './Input';
import * as Radio from './Radio';
import * as Select from './Select';
import * as Switch from './Switch';

// TODO: remove
interface ComponentRegisterType {
  Render: FC<any>;
  Edit?: FC<any>;
  EntityType: MetaName<any>;
  Entity: any;
}

const ENTITY_TYPES: ComponentRegisterType[] = [
  // Card,
  // Columns,
  // Flex,
  Button,
  Carousel,
  CodeComponent,
  Collapse,
  Container,
  ContainerWithCards,
  DefaultHeader,
  DefaultHero,
  HorizontalFooter,
  HorizontalForm,
  HorizontalHeader,
  HorizontalHero,
  Image,
  RichEditor,
  TestHero,
  VerticalFooter,
  VerticalForm,
  VerticalHeader,
  VerticalHero,
  Video,
  WebEditor,

  Checkbox,
  Radio,
  Input,
  Switch,
  Select,
] as const;

export default ENTITY_TYPES;
