import { addComponent } from '../../../../../tree';
import { registerEnum } from '../../../../form/enum-form';

import MetaEdit from '../../../../types/meta/MetaEdit';
import { addActionMenu } from '../../addActionMenu';
import { VoiceSynthesis, YandexVoiceType } from './YandexVoiceSynthesize.meta';

registerEnum(YandexVoiceType);
addComponent(MetaEdit, VoiceSynthesis, 'react edit');
addActionMenu(VoiceSynthesis, 'voice', 'Yandex Text-To-Speech');
