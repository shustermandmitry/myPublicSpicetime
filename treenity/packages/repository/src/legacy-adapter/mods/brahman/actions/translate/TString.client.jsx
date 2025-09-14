import { Col, Input, Row } from 'antd';
import React, { useState } from 'react';
import { addComponent } from '../../../../tree';
import { produce } from '../../../../utils/immer';
import TString from './TString';

import './TString.less';

export const TStringComponent = ({ onChange, name, value }) => {
  // const [langs, setLangs] = useState(value ? value : new TString());
  value = value || new TString();

  const langs = Object.keys(value);
  const [active, setActive] = useState(() => langs.filter(k => value[k]).sort());
  const inactive = langs.filter(l => !active.includes(l));

  const change = e => {
    const lang = e.target.lang;
    const nl = produce(value, draft => {
      draft[lang] = e.target.value;
    });
    // setLangs(nl);
    onChange(nl);
  };

  return (
    <>
      <Row>
        {active.length ? (
          <Col flex="auto">
            {active.map(l => (
              <div key={l} className="lang-textarea">
                <Input.TextArea
                  lang={l}
                  type="textarea"
                  autoSize
                  onChange={change}
                  value={value[l]}
                />
                <div>{l}</div>
              </div>
            ))}
          </Col>
        ) : null}
        <Col flex={`${inactive.length * 22}px`} className="p-l-8">
          {inactive.map(l => (
            <a key={l} href="#" type="link" onClick={() => setActive(a => [...a, l])}>
              {' '}
              {l}{' '}
            </a>
          ))}
        </Col>
      </Row>
    </>
  );
};

function TStringShow({ value }) {
  return (
    <div>
      {Object.keys(value)
        .sort()
        .map(l => (
          <p key={l}>{value[l]}</p>
        ))}
    </div>
  );
}

addComponent(TStringShow, TString, 'react');
addComponent(TStringShow, TString, 'react cell');
addComponent(TStringComponent, TString, 'react form');
