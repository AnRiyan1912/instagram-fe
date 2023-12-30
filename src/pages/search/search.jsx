import { useCallback, useEffect, useState } from 'react';
import { PostGrid } from '../../components/post/post-grid';
import { SearchTemplate } from '../../components/template/template';
import { api } from '../../api/axios';
import debounce from 'lodash.debounce';

export const SearchPage = () => {
 const [posts, setPosts] = useState([]);
 const [search, setSearch] = useState('');

 //  const doSearch = (query) => {
 //   if (!query) return setSearch('');

 //   const debouncedFilter = debounce(() => {
 //    console.log('====>', query);
 //    setSearch(query);
 //   }, 1000);
 //   debouncedFilter();
 //  };

 const debouncedFilter = useCallback(
  debounce((query) => setSearch(query), 500)
 );
 const doSearch = (query) => {
  if (!query) return setSearch('');
  debouncedFilter(query);
 };

 const fetchPost = () => {
  api
   .get('/posts/search', {
    params: {
     search
    }
   })
   .then((res) => setPosts(res.data))
   .catch((err) => console.log(err));
 };
 useEffect(() => {
  fetchPost();
 }, [search]);
 return (
  <>
   <SearchTemplate doSearch={doSearch}>
    <PostGrid posts={posts} />
   </SearchTemplate>
  </>
 );
};
