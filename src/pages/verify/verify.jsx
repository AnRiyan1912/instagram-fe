/* eslint-disable jsx-a11y/alt-text */
import { Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import success_gif from '../../assets/verified.gif';
import error_gif from '../../assets/error.gif';
import { api } from '../../api/axios';
import { useParams } from 'react-router-dom';

export const Verify = () => {
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const verifyUser = () => {
    api
      .post(
        '/auth/verify/token',
        {},
        {
          params: {
            token: params.token,
          },
        }
      )
      .then(() => setSuccess(true))
      .catch((err) => setSuccess(false));
  };
  useEffect(() => {
    verifyUser();
  }, []);
  return (
    <Center width={'100vw'} height={'100vh'}>
      <img
        w="300px"
        height={'300px'}
        src={success ? success_gif : error_gif}
      ></img>
    </Center>
  );
};
