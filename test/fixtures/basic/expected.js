const my_key_goes_here_en = 'english translation';
const my_key_goes_here_de = 'deutche translation';
import { localiseWithTranslations as t } from './lib/i18n';

const translated = t('my_key_goes_here', {
  de: my_key_goes_here_de,
  en: my_key_goes_here_en
}, { foo: 'bar' });
