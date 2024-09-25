import i18next from 'i18next';
import { schema, validateDuplicate } from './yup/schema.js';
import './locales/i18n.js';
import './yup/yupLocale.js';

export default () => {
  const form = document.querySelector('.rss-form');
  const input = document.getElementById('url-input');
  const feedback = document.querySelector('.feedback');
  const feeds = [];

  form.querySelector('label[for="url-input"]').textContent = i18next.t('label');
  form.querySelector('button').textContent = i18next.t('button');
  document.querySelector('h1').textContent = i18next.t('heading');
  document.querySelector('.lead').textContent = i18next.t('lead');
  document.querySelector('.text-muted').textContent = i18next.t('example');
  document.querySelector('.full-article').textContent = i18next.t('read');
  document.querySelector('.btn-secondary').textContent = i18next.t('close');
  document.querySelector('.posts').textContent = i18next.t('feedsTitle');
  document.querySelector('.feeds').textContent = i18next.t('postsTitle');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = input.value.trim();

    try {
      await schema.validate({ url });

      const duplicateError = validateDuplicate(url, feeds);
      if (duplicateError) {
        throw new Error(duplicateError);
      }

      feeds.push(url);
      input.value = '';
      input.classList.remove('is-invalid');
      feedback.textContent = '';
      input.focus();
    } catch (err) {
      input.classList.add('is-invalid');
      feedback.textContent = err.message;
    }
  });

  // сброс ошибок при изменении ввода
  input.addEventListener('input', () => {
    if (input.value.trim() === '') {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    }
  });
};
