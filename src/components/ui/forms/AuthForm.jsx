import {useToast, Button, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { PiEyeClosed, PiEyeBold } from "react-icons/pi";

import style from './forms.module.scss';
import {observer} from 'mobx-react-lite'
import { Context } from '../../..';
import validator from 'validator';
import ApiBlog from '../../../api/ApiBlog';
import { decodeToken } from 'react-jwt';

export const AuthForm = observer(({openRefreshForm}) => {
  const toast = useToast();
  const [show, setShow] = useState(false);  
  const {store} = useContext(Context); 


  const [regForm, setRegForm] = useState({
    login: '',
    name: '',
    email: '',
    password: '',

  })

  const [authForm, setAuthForm] = useState({
    login: '',
    password: ''
  })
  const changeAuthFormHandler = (e) => {
    setAuthForm((prev) => ({...prev, [e.target.name]: e.target.value}));
  }
  const changeRegFormHandler = (e) => {
    setRegForm((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  const submitAuth = async (e) => {
    e.preventDefault();
    try{
      if(!authForm.login || !authForm.password){
        throw new Error('Поля не заполнены до конца');
      }



      let response = await ApiBlog.login(authForm);

      if(response.status !== 200){

        throw new Error(response.response.data?.message);
      }
      const responsedData = response.data;
      // console.log(responsedData);
      localStorage.setItem('access_token', responsedData.access_token);
      localStorage.setItem('refresh_token', responsedData.refresh_token);
      const {data} = decodeToken(responsedData.refresh_token);
      store.setUserInfo({
        user_id: data.user_id,
        user_name: responsedData.user_name,
        user_email: responsedData.user_email,
        user_root: data.user_root,
        user_avatar: responsedData.user_avatar,
        user_posts_count: responsedData.user_posts_count,
        user_subs_count: responsedData.user_subs_count,
        user_subscribers_count: responsedData.user_subscribers_count
      });
      store.setAuth(true);

      store.set_modalUser(false);
      toast({
        status: 'success',
        description: 'Авторизация успешна',

      })
      setAuthForm({
        login: '',
        password: ''
    
      })
    }
    catch(e){
      toast({
        status: 'error',
        description: e.message,

      })
    }
  }

  const submitReg = async (e) => {
    e.preventDefault();
    try{
      if(!regForm.login || !regForm.password || !regForm.email || !regForm.name ){
        throw new Error('Поля не заполнены до конца');
      }

      if(!validator.isEmail(regForm.email)){
        throw new Error('Введена некорректная почта');
      }    


      let response = await ApiBlog.registration(regForm);

      if(response.status !== 200){

        throw new Error(response.response.data?.message);
      }
      store.set_modalUser(false);
      toast({
        status: 'success',
        description: 'Регистрация успешна',

      })
      setRegForm({
        login: '',
        name: '',
        email: '',
        password: '',
    
      })
    }
    catch(e){
      toast({
        status: 'error',
        description: e.message,

      })
    }
  }

  return (
    <Modal isOpen={store.modalAuth.active} onClose={() => store.set_modalUser(false)} isCentered>
        <ModalOverlay/>
        
        <ModalContent className={style.authContent}>
        <ModalCloseButton/>
            <ModalBody>
            <Tabs isFitted variant={'enclosed'} defaultIndex={store.modalAuth.activeIndex}>
              <TabList>
                  <Tab>Авторизация</Tab>
                  <Tab>Регистрация</Tab>
              </TabList>
            
              <TabPanels>
                  <TabPanel padding={0}>
                    <form onSubmit={submitAuth}>
                      <Input value={authForm.login} name='login' onChange={changeAuthFormHandler} variant={'flushed'} placeholder='Логин'/>
                      <InputGroup>
                          <Input value={authForm.password} name='password' onChange={changeAuthFormHandler} variant={'flushed'} autoComplete='on' type={show ? 'text' : 'password'} placeholder='Пароль'/>
                          <InputRightElement><button type='button' onClick={() => setShow(!show)}>{show ?  <PiEyeBold/> : <PiEyeClosed/>}</button></InputRightElement>
                      </InputGroup>
                      <Button type={'submit'}>Войти</Button>
                      
                    </form>
                    <Button className={style.refreshPass} onClick={openRefreshForm} variant={'unstyled'} type='button'>Забыли пароль?</Button>
                  </TabPanel>
                  <TabPanel p={0}>
                    <form onSubmit={submitReg}>
                      
                      <Input variant={'flushed'} value={regForm.login} onChange={changeRegFormHandler} name='login' placeholder='Логин'/>
 
                      <InputGroup>
                      
                          <Input variant={'flushed'} value={regForm.password} onChange={changeRegFormHandler} name='password' autoComplete='on' type={show ? 'text' : 'password'} placeholder='Пароль'/>
                          <InputRightElement><button type='button' onClick={() => setShow(!show)}>{show ?  <PiEyeBold/> : <PiEyeClosed/>}</button></InputRightElement>
                      </InputGroup>
                      <Input value={regForm.name} name='name' onChange={changeRegFormHandler} variant={'flushed'} placeholder='Имя'/>
                      <Input value={regForm.email} name='email' onChange={changeRegFormHandler} type={'email'} variant={'flushed'} placeholder='Почта'/>
                      <Button type={'submit'}>Зарегистрироваться</Button>
                    </form>
                  </TabPanel>
              </TabPanels>
            </Tabs>
            </ModalBody>
            
        </ModalContent>
    </Modal>
  )
})
