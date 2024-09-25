import _ from 'lodash';
import axios from 'axios';
import 'bootstrap';
import i18next from 'i18next';

import validate, { createLink } from './utils.js';
import watch from './view.js';
import ru from './locales/ru.js';
import parse from './parser.js';

const elements = {
  staticEl: {
    title: document.querySelector('h1'),
    subtitle: document.querySelector('.lead'),
    label: document.querySelector('[for="url-input"]'),
    button: document.querySelector('[type="submit"]'),
    read: document.querySelector('.full-article'),
  },
  form: document.querySelector('form'),
  input: document.getElementById('url-input'),
  errorElement: document.querySelector('.feedback'),
  postsContainer: document.querySelector('.posts'),
};

const initialState = {
  form: {
    status: 'pending',
    errors: '',
  },
  loadingProcess: {
    status: 'sending',
    error: '',
  },
  posts: [],
  feeds: [],
  ui: {
    activePostId: '',
    touchedPostId: new Set(),
  },
};

const TIMEOUT = 5000;

const initializeI18n = async (defaultLanguage) => {
  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources: { ru },
  });
  return i18nInstance;
};

export default async () => {
  const defaultLanguage = 'ru';
  const i18n = await initializeI18n(defaultLanguage);

  const { watchedState, renderForm } = watch(elements, i18n, initialState);
  renderForm();

  const fetchFeedContent = async () => {
    try {
      const fetchPromises = watchedState.feeds.map(async ({ url }) => {
        const response = await axios.get(createLink(url));
        const parseData = parse(response.data.contents);
        const { posts } = parseData;
        const existingPostsTitles = new Set(watchedState.posts.map((post) => post.title));
        const newPosts = posts.filter((post) => !existingPostsTitles.has(post.title));
        const updatePosts = newPosts.map((post) => ({ ...post, id: _.uniqueId() }));
        watchedState.posts = [...updatePosts, ...watchedState.posts];
      });

      await Promise.all(fetchPromises);
    } catch (error) {
      console.error('Error fetching feed content:', error);
    } finally {
      setTimeout(fetchFeedContent, TIMEOUT);
    }
  };

  fetchFeedContent();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const urlTarget = formData.get('url').trim();
    const urlFeeds = watchedState.feeds.map(({ url }) => url);

    watchedState.loadingProcess.status = 'sending';

    try {
      const { url } = await validate(urlTarget, urlFeeds);
      const response = await axios.get(createLink(url));
      const parseData = parse(response.data.contents);
      const { feed, posts } = parseData;

      const newFeed = {
        ...feed,
        feedId: _.uniqueId(),
        url: urlTarget,
      };

      const newPosts = posts.map((post) => ({ ...post, id: _.uniqueId() }));

      watchedState.feeds.push(newFeed);
      watchedState.posts.push(...newPosts);

      watchedState.loadingProcess.status = 'finished';
      watchedState.loadingProcess.error = '';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        watchedState.loadingProcess.error = 'networkError';
      } else if (error.message === 'invalidRSS') {
        watchedState.loadingProcess.error = 'invalidRSS';
      } else {
        watchedState.form.errors = error.message;
      }
    }
  };

  const handlePostsClick = (event) => {
    const { target } = event;
    if (target.tagName === 'A') {
      watchedState.ui.touchedPostId.add(target.id);
    }

    if (target.tagName === 'BUTTON') {
      const { id } = target.dataset;
      watchedState.ui.touchedPostId.add(id);
      watchedState.ui.activePostId = id;
    }
  };

  elements.form.addEventListener('submit', handleFormSubmit);
  elements.postsContainer.addEventListener('click', handlePostsClick);
};
