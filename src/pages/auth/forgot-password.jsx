import { useState } from 'react';
import { Template } from '../../components/template/template';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { Closed_Eye, Eye } from '../../assets/icons';
import { api } from '../../api/axios';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
export const ForgotPasswordPage = () => {
 const [email, setEmail] = useState('');
 const toast = useToast();

 const submit = async () => {
  const status = { message: '', data: '' };
  await api
   .post(
    '/auth/reset/token',
    {},
    {
     params: {
      email
     }
    }
   )
   .then((res) => {
    status.message = 'success';
    status.data = res.data;
   })
   .catch((err) => {
    status.message = 'error';
    status.data = err?.data?.response;
   });

  toast({
   status: status.message,
   title: status.message,
   description: status.data,
   isClosable: true,
   position: 'top',
   duration: 1500
  });
 };
 return (
  <>
   <Template>
    <div className="flex flex-col gap-[14px] w-full items-center">
     <div className="font-semibold w-full" style={{ paddingLeft: '40px' }}>
      <h1>FORGOT PASSWORD</h1>
     </div>

     <div className="input-container">
      <input
       type="text"
       className="mobile-input"
       placeholder="email"
       style={{ paddingRight: '25px' }}
       onChange={(e) => setEmail(e.target.value)}
      />
     </div>
     <button className="auth-button" onClick={submit}>
      Submit
     </button>
    </div>
   </Template>
  </>
 );
};

export const ChangePasswordPage = () => {
 YupPassword(Yup);
 const [see, setSee] = useState(false);
 const [see2, setSee2] = useState(false);
 const toast = useToast();
 const params = useParams();

 const formik = useFormik({
  initialValues: {
   password: '',
   confirm_password: ''
  },
  validationSchema: Yup.object().shape({
   password: Yup.string().minLowercase(1).minUppercase(1).min(4).required(),
   confirm_password: Yup.string()
    .required('confirm password is a required field')
    .oneOf([Yup.ref('password')], 'password does not match')
  }),
  onSubmit: async (values) => {
   const status = { message: '', data: '' };
   await api
    .post('/auth/reset/password', { ...values, token: params.token })
    .then((res) => {
     status.message = 'success';
     status.data = res.data;
    })
    .catch((err) => {
     status.message = 'error';
     status.data = err?.data?.response;
    });

   toast({
    status: status.message,
    title: status.message,
    description: status.data,
    isClosable: true,
    position: 'top',
    duration: 1500
   });
  }
 });
 return (
  <>
   <Template>
    <div className="flex flex-col gap-[14px] w-full items-center">
     <div className="font-semibold w-full" style={{ paddingLeft: '40px' }}>
      <h1>New Password</h1>
     </div>

     <div className="flex max-w-[320px] w-full justify-center  flex-col">
      <div className="input-container">
       <input
        type={see ? 'text' : 'password'}
        onChange={(e) => formik.setFieldValue('password', e.target.value)}
        className="mobile-input"
        placeholder="Password"
        style={{ paddingRight: '5px' }}
       />

       <button style={{ paddingRight: '10px' }} onClick={() => setSee(!see)}>
        {see ? (
         <Eye name="see" width={'13px'} />
        ) : (
         <Closed_Eye name="closed" width={'13px'} />
        )}
       </button>
      </div>
      <span className="text-red-500"> {formik.errors.password}</span>
     </div>
     <div className="flex max-w-[320px] w-full justify-center  flex-col">
      <div className="input-container">
       <input
        type={see2 ? 'text' : 'password'}
        onChange={(e) =>
         formik.setFieldValue('confirm_password', e.target.value)
        }
        className="mobile-input"
        placeholder="Re-password"
        style={{ paddingRight: '5px' }}
       />

       <button style={{ paddingRight: '10px' }} onClick={() => setSee2(!see2)}>
        {see2 ? (
         <Eye name="see" width={'13px'} />
        ) : (
         <Closed_Eye name="closed" width={'13px'} />
        )}
       </button>
      </div>
      <span className="text-red-500">{formik.errors.confirm_password}</span>
     </div>
     <button className="auth-button" onClick={formik.handleSubmit}>
      Submit
     </button>
    </div>
   </Template>
  </>
 );
};
