import * as yup from 'yup';
import i18next from 'i18next';

yup.setLocale({
  mixed: {
    required: () => i18next.t('errors.validation.required'),
  },
  string: {
    url: () => i18next.t('errors.validation.url'),
  },
});
