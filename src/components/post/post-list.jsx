import { PostCard } from './post-card';

export const PostList = ({ posts = [] }) => {
  return posts?.map((post, key) => <PostCard {...post} key={key}></PostCard>);
};
