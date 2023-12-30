import { useSelector } from 'react-redux';
import { PostCard } from '../../components/post/post-card';
import { NavTemplate } from '../../components/template/template';
import { Stories } from '../../components/story/story';
import { PostList } from '../../components/post/post-list';
import { api } from '../../api/axios';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Center, Spinner } from '@chakra-ui/react';

export const HomePage = () => {
  const userSelector = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const fetchPost = () => {
    api
      .get('/posts', {
        params: {
          page,
        },
      })
      .then((res) => {
        setPosts([...posts, ...res.data]);
        setPage(page + 1);
        console.log(page);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      <NavTemplate>
        <Stories />
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPost}
          hasMore={true}
        >
          <PostList posts={posts} />
        </InfiniteScroll>
      </NavTemplate>
    </>
  );
};
