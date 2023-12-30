/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/alt-text */
import { Avatar, Icon, useToast } from '@chakra-ui/react';
import {
  Comment,
  FilledLove,
  Love,
  Opt_Group,
  Saved,
  Share,
} from '../../assets/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ModalPost } from './post-modal';
import { api } from '../../api/axios';

export const PostCard = ({
  user,
  image_url,
  caption,
  id,
  postlikes,
  comments,
}) => {
  const userSelector = useSelector((state) => state.auth);

  const avatar_url = process.env.REACT_APP_API_IMAGE_AVATAR_URL;
  const post_url = process.env.REACT_APP_API_IMAGE_POST_URL;

  //  const [liked, setLiked] = useState(
  //   postlikes.find((like) => like.user_id == userSelector.id) ? true : false
  //  );
  const [totalLikes, setTotalLikes] = useState(postlikes);
  const [totalComments, setTotalComments] = useState(comments);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const toast = useToast();
  const deletePost = () => {
    const token = localStorage.getItem('auth');
    api
      .delete(`/posts/${id}`, {
        params: { token, user_id: userSelector.id },
      })
      .then((result) => {
        toast({
          title: 'Your post has been deleted',
          status: 'success',
          description: 'successfully deleted the post',
          isClosable: true,
          position: 'top',
          duration: 1500,
        });
        window.location.reload();
      })
      .catch((err) => {
        toast({
          title: 'Delete post failed',
          description: err?.response?.data,
          status: 'error',
          position: 'top',
          isClosable: true,
          duration: 1500,
        });
      });
  };

  const likePost = () => {
    api
      .post('/postlike', {
        post_id: id,
        user_id: userSelector.id,
      })
      .then((result) => {
        setTotalLikes(result.data);
      })
      .catch((err) => console.log(err));
  };

  const addComment = () => {
    api
      .post('/comments', {
        post_id: id,
        user_id: userSelector.id,
        comment,
      })
      .then((result) => {
        setTotalComments(result.data);
        setComment('');
      });
  };

  useEffect(() => {
    console.log(userSelector.id);
  }, []);

  return (
    <>
      <ModalPost
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        edit={{ image_url, caption, id }}
      />

      <div
        className="flex justify-between w-full  "
        style={{ padding: '8px 16px' }}
      >
        <div className="flex items-center gap-5">    
        <div> 
            <img
              className="cursor-pointer object-cover  rounded-full"
              style={{width: "40x", height: "40px"}}
              src={avatar_url + user?.image_url}
            /></div>
          
          
          <a href={`/username/${user?.username}`}>
            <b>{user?.username}</b>
          </a>
        </div>

        <div className="flex justify-center items-center">
          <div className={userSelector?.id !== user?.id ? 'hidden' : null}>
            <Opt_Group onClick={() => setIsOpen(!isOpen)} />
            <div
              className={`absolute bg-white  ml-[-40px] w-20 text-center text-sm  ${
                isOpen ? '' : 'hidden'
              }`}
            >
              <div
                className="border p-1 cursor-pointer"
                onClick={() => setIsEdit(true)}
              >
                edit
              </div>
              <div className="border  p-1 cursor-pointer" onClick={deletePost}>
                delete
              </div>
              <div
                className="border  p-1 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                cancel
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src={post_url + image_url}
        style={{ aspectRatio: '1', width: '100%', height: '380px' }}
      />
      <div
        className="flex justify-between w-full items-center icons"
        style={{ padding: '8px 15px' }}
      >
        <div className="flex gap-[15px]">
          <Icon
            as={
              totalLikes?.find((like) => like.user_id === userSelector.id)
                ? FilledLove
                : Love
            }
            onClick={likePost}
          ></Icon>

          <Comment />
          <Share />
        </div>
        <div className="flex justify-center items-center">
          <Saved />
        </div>
      </div>
      <div className="w-full " style={{ padding: '0px 15px 5px 15px' }}>
        {/* Liked by <b>thekamraan</b> and <b>905,235</b> others */}
        <b>{totalLikes?.length} Likes</b>
      </div>
      <div
        className="w-full flex flex-wrap"
        style={{
          padding: '0px 15px 5px 15px',
        }}
      >
        <span className="w-full ">
          <b>{user?.username}</b> {caption}
        </span>
      </div>

      <div
        className={`w-full text-gray-400 cursor-pointer
    }`}
        style={{ padding: '0px 15px 5px 15px' }}
      >
        <span
          className={`${
            totalComments?.length && !showComment ? '' : 'hidden'
          } `}
          onClick={() => setShowComment(true)}
        >
          View all {totalComments?.length} comments
        </span>
        <div className={`${showComment ? '' : 'hidden'}`}>
          {totalComments?.map((c, i) => (
            <div key={i} className="flex flex-wrap gap-1 text-black">
              <Avatar
                maxW="24px"
                maxH="24px"
                objectFit={'cover'}
                className="cursor-pointer"
                src={avatar_url + c.user.image_url}
              />{' '}
              {c.comment}{' '}
            </div>
          ))}
          <span onClick={() => setShowComment(false)}>Hide comments</span>
        </div>
      </div>

      <div
        className="w-full text-gray-400"
        style={{
          padding: '0px 15px 5px 15px',
        }}
      >
        <input
          style={{
            borderBottom: '1px solid #E4E4E4',
            paddingBottom: '15px',
          }}
          placeholder="Add a comment..."
          className="w-full text-black"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          onKeyPress={(e) => {
            if (e.key === 'Enter') addComment();
          }}
        />
      </div>
    </>
  );
};
