import { Button, Center, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Spinner } from '@chakra-ui/react';
import { set } from 'mobx';
import {useContext, useEffect, useState } from 'react'
import { BsChevronDown } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
// import { Link } from 'react-router-dom';
import useFetchCommentList from '../../hooks/useFetchCommentList';
import useFetchPostList from '../../hooks/useFetchPostList';

import CommentTableList from '../elements/tableList/CommenTabletList';
import PostsReportsTableList from '../elements/tableList/PostsReportsTableList';
import PostTableList from '../elements/tableList/PostTableList';
import UsersTableList from '../elements/tableList/UsersTableList';
import { Header } from '../layouts/Header'
import { Main } from '../layouts/Main'

export default function ModeratePost() {
  const {store} = useContext(Context);
  const navigate = useNavigate();
//   const [data, loading] = useFetchPosts(5, 1);
  const [menu, setMenu] = useState([
    {
      for: 'all',
      active: false,
      id: 0,
      title: 'Жалобы на комментарии'
    },
    {
      for: 'admin',
      active: false,
      id: 1,
      title: 'Посты'
    },
    {
      for: 'admin',
      active: false,
      id: 2,
      title: 'Пользователи'
    },
    {
      for: 'all',
      active: false,
      id: 3,
      title: 'Жалобы на посты'
    }
  ]);

  const menuHandler = (id) => {
    setMenu([...menu.filter(el => {
      if(el.id !== id){
        el.active = false;
      }
      else{
        el.active = true;
      }
      return el;
  })])
  }
  

  

  const setMenuForRoot = async () => {
    setMenu([...menu.filter(el => {
      if(store.userInfo.root === 'moderator'){

        if(el.for === 'all'){
          return el;
        }
        // return el;
      }
      else{
        return el;
      }
      
    })])
  }

  
  useEffect(() => {
    
    setMenu([...menu.map((el, index) => {
      if(index === 0){
        el.active = true;
      }
      return el;
    })])
    setMenuForRoot();
    

  }, [])


  if(store.userInfo.root !== 'moderator' && store.userInfo.root !== 'admin'){
    navigate('/notFound');
  }

  
  return (
    <div className='page'>
        <Header/>
        <Main>
            
                
                
                {
                   menu.find(el => el.id === 0)?.active ? <CommentTableList menu={menu} menuHandler={menuHandler}/> : null
                }
                {
                  menu.find(el => el.id === 1)?.active ? <PostTableList menu={menu} menuHandler={menuHandler}/> : null
                }
                {
                    menu.find(el => el.id === 2)?.active ?  <UsersTableList menu={menu} menuHandler={menuHandler}/> : null
                }
                {
                    menu.find(el => el.id === 3)?.active ?  <PostsReportsTableList menu={menu} menuHandler={menuHandler}/> : null
                }
            
            
        </Main>
    </div>
  )
}
