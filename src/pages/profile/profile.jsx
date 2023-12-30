import { useEffect, useState } from 'react';
import { Post, Reels, Suggestion, Tagged } from '../../assets/icons';
import { PostGrid } from '../../components/post/post-grid';
import { EditProfile } from '../../components/profile/modal-profile';
import { ProfileStories, StoryCard } from '../../components/story/story';
import { ProfileTemplate } from '../../components/template/template';
import { useSelector } from 'react-redux';
import { api } from '../../api/axios';
import { useParams } from 'react-router-dom';
import { Avatar } from '@chakra-ui/react';
import { ModalDetailPost } from '../../components/post/post-detail-modal';
import { PostList } from '../../components/post/post-list';
export const ProfilePage = () => {
  // const posts = [
  //   {
  //     image_url:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1200px-Lion_waiting_in_Namibia.jpg",
  //   },
  //   {
  //     image_url:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1200px-Lion_waiting_in_Namibia.jpg",
  //   },
  //   {
  //     image_url:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1200px-Lion_waiting_in_Namibia.jpg",
  //   },
  //   {
  //     image_url:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1200px-Lion_waiting_in_Namibia.jpg",
  //   },
  //   {
  //     image_url:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1200px-Lion_waiting_in_Namibia.jpg",
  //   },
  //   {
  //     image_url:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1200px-Lion_waiting_in_Namibia.jpg",
  //   },
  // ];
  const [isOpen, setIsOpen] = useState(false);
  const userSelector = useSelector((state) => state.auth);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const avatar_url = process.env.REACT_APP_API_IMAGE_AVATAR_URL;

  const params = useParams();
  const fetchUser = () => {
    api
      .get('/auth/username/' + params.username)
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
        fetchUserPosts(res.data.id);
      })
      .catch((err) => console.log(err));
  };
  const fetchUserPosts = (id) => {
    api
      .get(`/posts/user/${id}`)
      .then((result) => setPosts(result.data))
      .catch((err) => console.log(err));
  };
  const follow = () => {
    api
      .post('/follows/', {
        following_user_id: userSelector?.id,
        followed_user_id: user.id,
      })
      .then((res) => {
        fetchUser();
      });
  };
  useEffect(() => {
    fetchUser();
    fetchUserPosts();
    console.log(avatar_url + user?.image_url);
  }, []);

  return (
    <>
      <EditProfile isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className={`transition-all ${isOpen ? 'hidden' : null}`}>
        <ProfileTemplate>
          {/* //following followers */}
          <div className="flex items-center justify-between w-full">
            <div className="mx-4">
              <StoryCard
                image_url={
                  avatar_url +
                  (user?.id == userSelector.id
                    ? userSelector.image_url
                    : user.image_url)
                }
                user={user}
                add={true}
              />
              <img hidden src={avatar_url + user?.image_url}></img>
            </div>
            <div className="flex p-2 gap-6 text-center mx-5">
              <div>
                <b>{user?.posts?.length}</b>
                <div className=" text-sm">Posts</div>
              </div>
              <div>
                <b>{user?.followed_users?.length}</b>
                <div className=" text-sm">Followers</div>
              </div>
              <div>
                <b>{user?.following_users?.length}</b>
                <div className=" text-sm">Following</div>
              </div>
            </div>
          </div>
          <div className="w-full ">
            <div className="mx-4">
              {/* username */}
              <span className="font-semibold">{user?.fullname}</span>
              {/* bio */}
              <div className="">{user?.bio}</div>
              {/* buttons */}
              <div className={`profile-button py-2 text-sm `}>
                {params.username == userSelector.username ? (
                  <>
                    <button className=" grow" onClick={() => setIsOpen(true)}>
                      Edit profile
                    </button>
                    <button className=" grow">Share profile</button>
                  </>
                ) : (
                  <>
                    <button
                      className=" grow max-w-[138px] w-full"
                      onClick={follow}
                    >
                      {user?.followed_users?.find(({ following_user_id }) => {
                        return following_user_id == userSelector.id;
                      })
                        ? 'Unfollow'
                        : 'Follow'}
                    </button>
                    <a className="w-full" href={`/message/${user.username}`}>
                      <button className="w-full grow">Send Message</button>
                    </a>
                  </>
                )}

                <button>
                  <Suggestion fill="black" color="black" />
                </button>
              </div>
            </div>
            {/* story */}
            <ProfileStories />

            <div className="grid grid-cols-3 justify-items-center icons pb-[1px]">
              <div className="w-full flex justify-center py-2 cursor-pointer border-bottom">
                <Post />
              </div>
              <div className="w-full flex justify-center py-2 cursor-pointer">
                <Reels />
              </div>
              <div className="w-full flex justify-center py-2 cursor-pointer">
                <Tagged />
              </div>
            </div>
            <PostGrid posts={posts} />
          </div>
        </ProfileTemplate>
      </div>
    </>
  );
};
