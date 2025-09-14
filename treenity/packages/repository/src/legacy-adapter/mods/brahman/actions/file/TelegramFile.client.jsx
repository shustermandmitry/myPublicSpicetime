import React from 'react';
import { addComponent } from '../../../../tree';
import { Meteor } from '../../../../utils/meteor';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { TelegramFile } from './TelegramFile.meta';

const Photo = ({ file, fullLink }) => (
  <div style={{ maxWidth: 500, height: 'auto', display: 'table-cell' }}>
    <img src={fullLink} alt={file.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
  </div>
);

const Sticker = ({ file, fullLink }) => (
  <div style={{ width: 150, height: 150, display: 'table-cell' }}>
    <img src={fullLink} alt={file.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
  </div>
);

const Audio = ({ file, fullLink }) => (
  <audio style={{ width: 500 }} controls="controls">
    <source src={fullLink} type={file.type} />
    Your browser does not support the audio element.
  </audio>
);

const Video = ({ file, fullLink }) => (
  <video controls="controls" style={{ width: 500, height: 500 }}>
    <source src={fullLink} type={file.type} />
    Your browser does not support the video element.
  </video>
);

const Document = ({ file, fullLink }) => (
  <div>
    {file.isImage && (
      <div style={{ width: 300, height: 300, display: 'table-cell' }}>
        <img src={fullLink} alt={file.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
      </div>
    )}
  </div>
);

const UnknownFile = ({ file, fullLink }) => (
  <div>
    <p>Unknown file type: {file.meta.type}</p>
    <p>at: {fullLink}</p>
  </div>
);

const types = {
  photo: Photo,
  sticker: Sticker,
  audio: Audio,
  video: Video,
  video_note: Video,
  document: Document,
};

class TelegramFileComponent extends React.Component {
  render() {
    const { file, fileLink } = this.props.value;
    const type = file.meta.type;
    const fullLink = Meteor.absoluteUrl(fileLink);
    const Component = types[type] || UnknownFile;

    return (
      <div>
        <div>
          <div>{file.name}</div>
          <Component file={file} fullLink={fullLink} />
          {!file.meta.isNotTg && (
            <>
              <div>{Math.floor(file.size / 1000)} KB</div>
              <div>from @{file.meta.from}</div>
              <div>type: {type}</div>
              <div>telegram id: {file.meta.telegramFileId}</div>
            </>
          )}
        </div>
      </div>
    );
  }
}

addComponent(TelegramFileComponent, TelegramFile, 'react');
addComponent(MetaEdit, TelegramFile, 'react edit');
