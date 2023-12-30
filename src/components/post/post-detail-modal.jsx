import { Arrow } from '../../assets/icons';
import { ModalTemplate, Template } from '../template/template';
import { PostList } from './post-list';
import { Footer } from '../navigation/footer';

const modalContentStyle = {
  height: '80%',
  overflowY: 'auto',
  padding: '16px',
  borderRadius: '8px',
};

export const ModalDetailPost = ({ posts, isOpen, onClose, isSearchPage }) => {
  const titleText = isSearchPage ? 'Jelajahi' : 'Postingan';

  return (
    <ModalTemplate isOpen={isOpen} title="Semua Postingan">
      <Template>
        <div className="w-full h-screen bg-white">
          <div className="w-full">
            <div className="flex m-3">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {' '}
                <Arrow width={'20px'} height={'16px'} onClick={onClose} />
              </div>
              <span className="font-semibold ml-3 text-lg">{titleText}</span>
            </div>
          </div>
          <div style={{ ...modalContentStyle }}>
            {' '}
            <PostList posts={posts} />
          </div>
        </div>
      </Template>
      <Footer />
    </ModalTemplate>
  );
};
