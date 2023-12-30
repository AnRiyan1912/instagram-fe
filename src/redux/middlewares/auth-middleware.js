import { api } from '../../api/axios';
import { constant } from '../../constant';

export const userLogin = (values) => {
  return async (dispatch) => {
    try {
      const res = await api.post('/auth/v2', {
        ...values,
      });

      const user = res.data.user;
      localStorage.setItem('auth', res.data.token);
      dispatch({
        type: constant.USER_LOGIN,
        payload: user,
      });

      return constant.success;
    } catch (err) {
      localStorage.removeItem('auth');
      return err.response.data;
    }
  };
};

export const userLoginWithGoogle = (values) => {
  return async (dispatch) => {
    try {
      let user = await checkIfUserExist(values, 'google_uid');
      console.log(user);
      localStorage.setItem('auth', user.id);
      dispatch({
        type: constant.USER_LOGIN,
        payload: user,
      });

      return constant.success;
    } catch (err) {
      localStorage.removeItem('auth');
      return err.message;
    }
  };
};

export const userLoginWithFacebook = (values) => {
  return async (dispatch) => {
    try {
      let user = await checkIfUserExist(values, 'facebook_uid');
      localStorage.setItem('auth', user.id);
      console.log(user);

      dispatch({
        type: constant.USER_LOGIN,
        payload: user,
      });

      return constant.success;
    } catch (err) {
      localStorage.removeItem('auth');
      return err.message;
    }
  };
};

export const userLogout = () => {
  return async (dispatch) => {
    localStorage.removeItem('auth');
    dispatch({
      type: constant.USER_LOGOUT,
    });
  };
};

export const userUpdate = (selector, values) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      Object.entries(values).map((value) => {
        formData.append(value[0], value[1]);
      });

      const user = await api.patch(`/auth/${selector.id}`, formData);
      console.log(user);
      dispatch({
        type: constant.USER_LOGIN,
        payload: user.data,
      });
      return constant.success;
    } catch (err) {
      return err?.response?.data;
    }
  };
};
const checkIfUserExist = async (values, provider = '') => {
  try {
    let user = {};
    const isUserExist = await api
      .get('/users/', {
        params: {
          email: values.email,
        },
      })
      .then((res) => res.data[0])
      .catch((err) => console.log(err));

    console.log(isUserExist);
    //user email sudah terdaftar tapi tidak memiliki uid
    if (isUserExist?.id && !isUserExist[provider]) {
      isUserExist[provider] = values.uid;
      user = await api
        .patch(`/users/${isUserExist.id}`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
    } else if (!isUserExist?.id) {
      user = await api
        .post(
          '/users',
          new User(
            values.displayName,
            values.email,
            values.photoURL,
            values.uid
          )
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
    } else {
      user = { ...isUserExist };
    }
    return user;
  } catch (err) {
    console.log(err);
  }
};

class User {
  constructor(
    fullname = '',
    email = '',
    image_url = '',
    google_uid = '',
    username = '',
    password = '',
    gender = '',
    bio = ''
  ) {
    this.username = username;
    this.email = email;
    this.gender = gender;
    this.password = password;
    this.bio = bio;
    this.image_url = image_url;
    this.fullname = fullname;
    this.google_uid = google_uid;
  }
}
