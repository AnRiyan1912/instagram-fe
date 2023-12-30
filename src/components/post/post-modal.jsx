/* eslint-disable react-hooks/exhaustive-deps */
import { useToast, Image } from '@chakra-ui/react';
import { ModalTemplate, Template } from '../template/template';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Check, Close } from '../../assets/icons';
import { useRef } from 'react';
import { renderImage } from '../../lib/render-image';

import defaultImage from '../../assets/default_image.png';
import { api } from '../../api/axios';
export const ModalPost = ({ isOpen, onClose, edit }) => {
  const userSelector = useSelector((state) => state.auth);
  const ref = useRef();
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      image_url: '',
      caption: '',
      image: null,
    },
    validationSchema: Yup.object().shape({
      image_url: Yup.string().min(3).required(),
    }),
    onSubmit: async (values) => {
      const token = localStorage.getItem('auth');
      const formData = new FormData();
      formData.append('caption', values.caption);
      formData.append('image', values.image);
      formData.append('user_id', userSelector.id);
      api[edit ? 'patch' : 'post'](
        edit ? `/posts/${edit.id}` : '/posts',
        formData,
        {
          params: {
            token,
            user_id: userSelector.id,
          },
        }
      )
        .then((result) => {
          onClose();
          toast({
            title: 'You have successfully created a new post',
            status: 'success',
            description: 'new post created',
            isClosable: true,
            position: 'top',
            duration: 1500,
          });
          window.location.reload();
        })
        .catch((err) =>
          toast({
            title: 'You failed created a new post',
            description: err?.response?.data,
            status: 'error',
            position: 'top',
            isClosable: true,
            duration: 1500,
          })
        );
    },
  });

  useEffect(() => {
    formik.resetForm();
    console.log(isOpen);
    if (edit) {
      formik.setFieldValue('image_url', edit.image_url);
      formik.setFieldValue('caption', edit.caption);
    }
  }, [isOpen]);

  return (
    <ModalTemplate isOpen={isOpen}>
      <Template>
        <div className="w-full h-screen bg-white ">
          <div className="w-full ">
            <div className=" flex justify-between m-3 ">
              <Close width={'16px'} onClick={onClose} />
              <span className="font-semibold">POST</span>
              <Check onClick={formik.handleSubmit} />
            </div>
          </div>

          <div className="flex flex-col w-full items-center">
            <div className="flex max-w-[320px] w-full justify-center items-center flex-col">
              <div className="py-4 flex items-center flex-col gap-2">
                <Image
                  src={formik.values.image_url}
                  w="100vw"
                  h={'100vh'}
                  maxW={'320px'}
                  maxH={'320px'}
                  aspectRatio={1}
                  objectFit={'cover'}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = defaultImage;
                  }}
                  cursor={'pointer'}
                  onClick={() => ref.current.click()}
                />
                <input
                  ref={ref}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const image_url = await renderImage(e);
                    formik.setFieldValue('image_url', image_url);
                    formik.setFieldValue('image', e.target.files[0]);
                  }}
                ></input>
              </div>
            </div>

            <div className="flex max-w-[320px] w-full justify-center  flex-col">
              <div className="input-container">
                <textarea
                  type="text"
                  className="mobile-input resize-none"
                  placeholder="caption"
                  value={formik.values.caption}
                  style={{
                    paddingRight: '25px',
                    height: '150px',
                    paddingTop: '4px',
                  }}
                  maxLength={'150'}
                  onChange={(e) =>
                    formik.setFieldValue('caption', e.target.value)
                  }
                />
              </div>
              <span className="text-red-500"> {formik.errors.caption}</span>
            </div>
          </div>
        </div>
      </Template>
    </ModalTemplate>
  );
};
