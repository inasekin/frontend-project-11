import * as yup from 'yup';

export const schema = yup.object().shape({
    url: yup.string().url('Ссылка должна быть валидным URL').required('Поле обязательно для заполнения'),
});

export const validateDuplicate = (url, feeds) => {
    return feeds.includes(url) ? 'RSS уже существует' : null;
};
