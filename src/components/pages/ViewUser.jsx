import { Button, Center, Flex, Input, Spinner } from '@chakra-ui/react'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useFetchDataUser } from '../../hooks/useFetchDataUser'

import { useFetchPostsUserSearch } from '../../hooks/useFetchPostsUserSearch'
import PostPreiviewHome from '../elements/post-preview/PostPreiviewHome'

import { ProfileUser } from '../elements/profile-preview/ProfileUser'
import { Footer } from '../layouts/Footer'
import { Header } from '../layouts/Header'
import { Main } from '../layouts/Main'

export const ViewUser = memo(() => {
  const params = useParams();  
  const [data, loading, setData] = useFetchDataUser(params.id);
  const [fieldSearch, setFieldSearch] = useState('');
  const [posts, loadingPosts, setPosts, search, setSearch] = useFetchPostsUserSearch(params.id);
  console.log(posts);
  const userPosts = useMemo(() => {
    return posts ? posts.map(el => <PostPreiviewHome key={el.post_id} imagePreview={el.post_prev} text={el.text} id={el.post_id} date={el.post_date} author={{
        name: el.name, 
        id: params.id
    }} title={el.post_title}/>) : null
  }, [posts])
  
  const subFunc = useCallback(() => {
    setData(prev => ({...prev, user_subscribers: prev.user_subscribers + 1}));
  }, [params.id]);

  const unSub = useCallback(() => {
    setData(prev => ({...prev, user_subscribers: prev.user_subscribers - 1}));
  }, [params.id]);

  return (
    <div className='page'>
        <Header/>
        <Main>

            {data ?  
                <>
                <ProfileUser funcIN={subFunc} funcDE={unSub} id={params.id} avatar={data.user_avatar} name={data.name} posts={data.user_posts} subs={data.user_subs} subscribers={data.user_subscribers}/>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setSearch(fieldSearch);
                }}>
                  <Flex className='searchX'>
                    <Input value={fieldSearch} onChange={(e) => setFieldSearch(e.target.value)} placeholder='Название поста' variant={'filled'} marginRight={'10px'}/>
                    
                    {search ? <Button onClick={() => {setSearch(''); setFieldSearch('')}}>Сбросить</Button> : <Button type='submit' colorScheme={'telegram'}>Найти</Button>}
                    
                  
                  
                  </Flex>
                </form>
                
                {
                  loadingPosts 
                  ? 
                  <Center><Spinner/></Center> 
                  : 
                  <>
                  {userPosts?.length > 0 ? <div className='list-post-grid'>
                  {userPosts}
                </div> : <Center marginTop={'10px'}><h1>Посты не найдены</h1></Center>}
                  </>
                  
                  
                }
                </>
            
            : <Center>
                    <div>
                        <h1>Пользователь не найден</h1>
                        <Link to={'/'}>На главную</Link>
                
                    </div>
                </Center>}
            
        </Main>
        <Footer/>
    </div>
  )
})
