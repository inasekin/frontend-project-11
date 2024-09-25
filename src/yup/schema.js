import * as yup from 'yup';
import i18next from 'i18next';

export const schema = yup.object().shape({
  url: yup
    .string()
    .url(i18next.t('errors.validation.url'))
    .required(i18next.t('errors.validation.required')),
});

export const validateDuplicate = (url, feeds) => (
  feeds.includes(url) ? i18next.t('errors.validation.notOneOf') : null
);
