import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsChevronDown} from "react-icons/bs"
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { Avatar, Button, Flex, Popover, PopoverArrow, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from '@chakra-ui/react'

import { AuthForm } from '../ui/forms/AuthForm'
import VerifyCode from '../ui/forms/VerifyCode'

import RefreshForm from '../ui/forms/RefreshForm'

export const Header = observer(({links, buttons}) => {


  const {store} = useContext(Context);
  const navigate = useNavigate();
  const [isOpenNav , setIsOpen] = useState(false);
  const [isFixed, setFixed] = useState(false);
  const [isOpenRefresh, setIsOpenRefresh] = useState(false);
  
  const openRefreshForm = () => {
    store.set_modalUser(false);
    setIsOpenRefresh(true);
  }

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if(window.scrollY > 100){
        setFixed(true);
      }
      else{
        setFixed(false);
      }
    })
  }, [])

  return (
    <header className={isFixed ? 'fixed' : ''}>
        <RefreshForm isOpen={isOpenRefresh} onClose={setIsOpenRefresh}/>
        <VerifyCode/>
        <AuthForm openRefreshForm={openRefreshForm}/>
        <Link  to="/" className='logo'>MYBLOG.RU</Link>
        <div>
          
          <nav>{links ? links : null}</nav>


          <div className='navButtons'>
            
            { buttons ? buttons : null}
          
          
          {
            store.getAuth() 
            ?
            <Popover
              isOpen={isOpenNav}
              placement='bottom-end'
              closeOnBlur
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
            >
              <PopoverTrigger>
                <Flex cursor={'pointer'} alignItems={'center'}>
                  <Avatar marginRight={'5px'} name={store.userInfo.name ? store.userInfo.name : ''} src={store.userInfo.avatar ? store.userInfo.avatar : null}/>
                  <BsChevronDown style={{rotate: isOpenNav ? '180deg' : 'initial', transition: '.2s ease'}}/>
                </Flex> 
                
              </PopoverTrigger>
              <PopoverContent w={'fit-content'}>
                <PopoverHeader border={'none'}>
                <PopoverCloseButton/>
                </PopoverHeader>
                <PopoverArrow/>
                <div className='userMenu'>
                  {store.getRoot() === 'admin' ? <Link to={'/moderate'}>Модерация+</Link> : null}
                  {store.getRoot() === 'moderator' ? <Link to={'/moderate'}>Модерация</Link> : null}
                  <Link to={'/myPosts'}>Мои посты</Link>
                  <Link to={'/subs/'+store.userInfo.id}>Подписки</Link>
                  <Link to={'/subscribers/'+store.userInfo.id}>Подписчики</Link>
                  <Link to={'/options'}>Настройки</Link>
                  <Link className='createPost' to={'/createPost'}>Создать пост</Link>
                  <Button color={'red'} onClick={() => {
                    store.logout();
                    navigate('/');
                  }}>Выйти</Button>
                </div>
              </PopoverContent>
              
              
                
            </Popover>
            
            :
            <Button onClick={() => store.set_modalUser(true, 0)}>Войти</Button>
          }
          </div>
        
        </div>
        
        
    </header>
  )
})
