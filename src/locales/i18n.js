import i18n from 'i18next';
import ru from './ru/translation.json';

const resources = {
  ru,
};

i18n.init({
  lng: 'ru',
  debug: false,
  initImmediate: false,
  resources,
});

export default i18n;
