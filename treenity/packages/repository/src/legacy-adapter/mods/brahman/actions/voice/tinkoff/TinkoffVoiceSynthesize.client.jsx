import { addComponent } from '../../../../../tree';

import MetaEdit from '../../../../types/meta/MetaEdit';
import { addActionMenu } from '../../addActionMenu';
import { VoiceSynthesis } from './TinkoffVoiceSynthesize.meta';

addComponent(MetaEdit, VoiceSynthesis, 'react edit');
addActionMenu(VoiceSynthesis, 'voice', 'VoiceKit Text-To-Speech');
