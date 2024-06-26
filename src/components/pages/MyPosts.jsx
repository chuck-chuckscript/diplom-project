import { Button, Center, Flex, Input, Spinner } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../..'
import { useFetchPostsUserSearch } from '../../hooks/useFetchPostsUserSearch'
import { PostPreview } from '../elements/post-preview/PostPreview'
import { Footer } from '../layouts/Footer'

import {Header} from '../layouts/Header'
import {Main} from '../layouts/Main'

const style = {
    display: 'block',
    textAlign: "center",
    color: "white",
    margin: "0px 0 10px 0",
    padding: "10px 0px",
    borderRadius: "10px",
    backgroundColor: "rgb(80, 149, 214)"
}

export const MyPosts = observer(() => {

  const {store} = useContext(Context);
  const [data, loading, setData, search, setSearch, err] = useFetchPostsUserSearch(store.userInfo.id);  

  const posts = useMemo(() => {
    return data ? data.map(el => <PostPreview edit key={el.post_id} id={el.post_id} title={el.post_title} date={el.post_date} author={el.name} dir={'posts'} withDel={setData}/>) : null
  }, [data])  
  const [value, setValue] = useState('');



  return (
    <div className='page'>
        <Header/>
        <Main>
            <Link style={style} to='/createPost'>Создать пост</Link>
            <div>
                
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setSearch(value)
                }}>
                    <Flex marginBottom={'10px'}>
                        <Input placeholder='Поиск' value={value} onChange={(e) => setValue(e.target.value)} marginRight={'10px'} variant={'filled'}/>
                        {
                            search 
                            ? 
                            <Button type='button' onClick={() => {setSearch(''); setValue('')}}>Сбросить</Button> 
                            : 
                            <Button colorScheme={'telegram'} type='submit'>Найти</Button>
                        }
                    </Flex>
                </form>
                
                
                {loading ? <Center><Spinner/></Center> : 
                    <>
                        {
                            posts?.length > 0 && posts  
                            ? 
                            posts 
                            : 
                            <Center display={'flex'} flexDirection={'column'}>
                                <h1>{err ? err : 'Вы не публиковали посты'}</h1>
                            </Center>
                        }  
                    </>
                }
                
                
               
            </div>
            
            
        </Main>
        <Footer/>
    </div>
  )
})
