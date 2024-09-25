import { schema, validateDuplicate } from './schema.js';

export default () => {
  const form = document.querySelector('.rss-form');
  const input = document.getElementById('url-input');
  const feedback = document.querySelector('.feedback');
  const feeds = [];

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // останавливаем стандартную отправку формы

    const url = input.value.trim(); // получаем введенный URL и убираем лишние пробелы

    try {
      // валидация URL с использованием yup
      await schema.validate({ url });

      // проверяем, есть ли дубликаты
      const duplicateError = validateDuplicate(url, feeds);
      if (duplicateError) {
        throw new Error(duplicateError); // если URL уже есть, выбрасываем ошибку
      }

      // если валидация прошла успешно, добавляем URL в список фидов и сбрасываем форму
      feeds.push(url);
      input.value = ''; // очищаем поле ввода
      input.classList.remove('is-invalid'); // убираем класс ошибки
      feedback.textContent = ''; // очищаем текст ошибки
      input.focus(); // ставим фокус на поле ввода
    } catch (err) {
      // если произошла ошибка валидации, отображаем сообщение и подсвечиваем поле
      input.classList.add('is-invalid'); // добавляем класс для выделения ошибки (Bootstrap)
      feedback.textContent = err.message; // выводим сообщение об ошибке
    }
  });

  // обработчик ввода в поле: убираем ошибку при изменении текста в поле
  input.addEventListener('input', () => {
    if (input.value.trim() === '') {
      // если поле пустое, убираем сообщение об ошибке и класс ошибки
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    }
  });
};
