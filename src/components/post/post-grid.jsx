import { useState } from 'react';
import { ModalDetailPost } from './post-detail-modal';

export const PostGrid = ({ posts = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="post-grid grid grid-cols-3">
      {posts?.map((post, key) => (
        <PostGridCard
          post={post}
          key={key}
          openModal={openModal}
          onClose={closeModal}
        />
      ))}
      {isOpen && (
        <ModalDetailPost isOpen={isOpen} onClose={closeModal} posts={posts} />
      )}
    </div>
  );
};

const PostGridCard = ({ post, openModal, onClose }) => {
  const post_url = process.env.REACT_APP_API_IMAGE_POST_URL;

  return (
    <>
      <img
        src={post_url + post.image_url}
        alt={post.title}
        onClick={openModal}
      />
    </>
  );
};
