import { useDispatch, useSelector } from 'react-redux';
import { api } from '../api/axios';
import { useEffect, useState } from 'react';
import { constant } from '../constant';

export const AuthProvider = ({ children }) => {
 const dispatch = useDispatch();
 const [isLoading, setIsLoading] = useState(true);
 const userSelector = useSelector((state) => state.auth);

 const fetchData = () => {
  const token = localStorage.getItem('auth');
  if (!token) return setIsLoading(false);
  api
   .get(`/auth/token/`)
   .then((res) => {
    dispatch({
     type: constant.USER_LOGIN,
     payload: res.data.user
    });
    localStorage.setItem('auth', res.data.token);
   })
   .catch((err) => {
    console.log(err);
    localStorage.removeItem('auth');
    setIsLoading(false);
   });
 };

 useEffect(() => {
  fetchData();
 }, []);
 useEffect(() => {
  if (userSelector.id) setIsLoading(false);
 }, [userSelector]);

 return isLoading ? <></> : children;
};
