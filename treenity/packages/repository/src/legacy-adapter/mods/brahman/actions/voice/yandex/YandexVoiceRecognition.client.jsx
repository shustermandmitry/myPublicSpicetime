import { addComponent } from '../../../../../tree';

import MetaEdit from '../../../../types/meta/MetaEdit';
import { addActionMenu } from '../../addActionMenu';
import { VoiceRecognition } from './YandexVoiceRecognition.meta';

addComponent(MetaEdit, VoiceRecognition, 'react edit');
addActionMenu(VoiceRecognition, 'voice', 'Yandex ASR');
