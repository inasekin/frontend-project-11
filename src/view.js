import onChange from 'on-change';

export default (elements, i18n, state) => {
  const { t } = i18n;

  // Утилита для создания элементов с классами и атрибутами
  const createElement = (tag, classNames = [], attributes = {}, ...children) => {
    const element = document.createElement(tag);
    if (classNames.length) {
      element.classList.add(...classNames);
    }
    Object.entries(attributes).forEach(([attr, value]) => {
      element.setAttribute(attr, value);
    });
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.textContent = child;
      } else {
        element.appendChild(child);
      }
    });
    return element;
  };

  const renderForm = () => {
    const { input } = elements;
    input.focus();
    Object.entries(elements.staticEl).forEach(([key, el]) => {
      const element = el;
      element.textContent = t(key);
    });
  };

  const renderBlock = (title) => {
    const cardTitle = createElement('h2', ['card-title', 'h4'], {}, title);
    const cardBody = createElement('div', ['card-body'], {}, cardTitle);
    const card = createElement('div', ['card', 'border-0'], {}, cardBody);
    return card;
  };

  const renderList = (items, renderItemCallback, listClassNames = ['list-group', 'border-0', 'rounded-0']) => {
    const list = createElement('ul', listClassNames);
    items.forEach((item) => {
      const listItem = renderItemCallback(item);
      list.appendChild(listItem);
    });
    return list;
  };

  const renderFeeds = () => {
    const feedContainer = document.querySelector('.feeds');
    feedContainer.innerHTML = ''; // Очистка контейнера перед рендерингом

    const block = renderBlock(t('feedTitle'));
    const feedsList = renderList(state.feeds, ({ title, description }) => {
      const titleEl = createElement('h3', ['h6', 'm-0'], {}, title);
      const descEl = createElement('p', ['m-0', 'small', 'text-black-50'], {}, description);
      const listItem = createElement(
        'li',
        ['list-group-item', 'border-0', 'border-end-0'],
        {},
        titleEl,
        descEl,
      );
      return listItem;
    });

    feedContainer.append(block, feedsList);
  };

  const renderPosts = () => {
    const postsContainer = document.querySelector('.posts');
    postsContainer.innerHTML = ''; // Очистка контейнера перед рендерингом

    const block = renderBlock(t('postsTitle'));
    const postsList = renderList(state.posts, ({ title, id, url }) => {
      const link = createElement('a', ['fw-bold'], { href: url, id, target: '_blank' }, title);
      const button = createElement('button', ['btn', 'btn-outline-primary', 'btn-sm'], {
        type: 'button',
        'data-id': id,
        'data-bs-toggle': 'modal',
        'data-bs-target': '#modal',
      }, t('postsButton'));
      const listItem = createElement(
        'li',
        [
          'list-group-item',
          'border-0',
          'border-end-0',
          'd-flex',
          'justify-content-between',
          'align-items-start',
        ],
        {},
        link,
        button,
      );
      return listItem;
    });

    postsContainer.append(block, postsList);
  };

  const renderModal = () => {
    const { activePostId } = state.ui;
    const activePost = state.posts.find(({ id }) => id === activePostId);
    if (!activePost) return;

    const { title, description, url } = activePost;
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const modalLink = document.querySelector('.modalLink');
    const modalBtnClose = document.querySelector('.btn-secondary');

    modalTitle.textContent = title;
    modalBody.textContent = description;
    modalLink.textContent = t('read');
    modalLink.href = url;
    modalBtnClose.textContent = t('close');
  };

  const handleFormStatus = () => {
    renderForm();
  };

  const handleFormErrors = () => {
    const { errorElement, input } = elements;
    errorElement.classList.remove('text-success');
    errorElement.classList.add('text-danger');
    errorElement.textContent = t(state.form.errors);
    input.classList.add('is-invalid');
  };

  const handleLoadingProcess = (status) => {
    const {
      staticEl, input, form, errorElement,
    } = elements;
    if (status === 'sending') {
      staticEl.button.disabled = true;
      errorElement.textContent = '';
    } else if (status === 'finished') {
      staticEl.button.disabled = false;
      input.classList.remove('is-invalid');
      errorElement.classList.remove('text-danger');
      errorElement.classList.add('text-success');
      errorElement.textContent = t('feedback');
      form.reset();
      input.focus();
      renderFeeds();
      renderPosts();
    }
  };

  const handleLoadingError = (error) => {
    const { errorElement, input } = elements;
    input.classList.remove('is-invalid');
    if (error === 'networkError') {
      errorElement.textContent = t('errors.networkError');
    } else if (error === 'invalidRSS') {
      errorElement.classList.remove('text-success');
      errorElement.classList.add('text-danger');
      errorElement.textContent = t('errors.invalidRSS');
    }
  };

  const handleTouchedPostId = () => {
    state.ui.touchedPostId.forEach((postId) => {
      const post = document.getElementById(postId);
      if (post && post.classList.contains('fw-bold')) {
        post.classList.remove('fw-bold');
        post.classList.add('fw-normal', 'link-secondary');
      }
    });
  };

  const handleActivePostId = () => {
    renderModal();
  };

  const handlers = {
    'form.status': handleFormStatus,
    'form.errors': handleFormErrors,
    'loadingProcess.status': handleLoadingProcess,
    'loadingProcess.error': handleLoadingError,
    'ui.touchedPostId': handleTouchedPostId,
    'ui.activePostId': handleActivePostId,
  };

  const watchedState = onChange(state, (path, value) => {
    const handler = handlers[path];
    if (handler) {
      handler(value);
    }
  });

  return {
    watchedState,
    renderForm,
  };
};
