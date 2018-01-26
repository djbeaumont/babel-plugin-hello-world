import { my_key_goes_here as my_key_goes_here_en } from './lib/translations/en.json';
import { my_key_goes_here as my_key_goes_here_de } from './lib/translations/de.json';
import { localiseWithTranslations as t } from './lib/i18n';

const translated = t('my_key_goes_here', {
  de: my_key_goes_here_de,
  en: my_key_goes_here_en
}, { foo: 'bar' });
