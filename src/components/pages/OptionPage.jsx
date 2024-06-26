import React, { useContext, useState } from 'react'
import { Header } from '../layouts/Header'
import { Main } from '../layouts/Main'
import { Footer } from '../layouts/Footer'
import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Button, Input, Spinner, useToast} from '@chakra-ui/react'


import { FaPenToSquare } from "react-icons/fa6";
import optionsStyle from './optionpage.module.scss'
import { BsFillPersonLinesFill, BsUnlockFill  } from "react-icons/bs";
import { Context } from '../..'
import { observer } from 'mobx-react-lite'

import ApiBlog from '../../api/ApiBlog'
import validator from 'validator'
import { imageSrc as SRC } from '../constatns/ImageHost'

import useFetchCode from '../../hooks/useFetchCode'
export const OptionPage = observer(() => {







    
  const toast = useToast();

  const {store} = useContext(Context);  
  const [infos, setInfos] = useState(store.userInfo)

  const {isLoading, usersPasswords, setUserPasswords, refreshPassword} = useFetchCode()


  const changeImage = async (files) => {
    const fileImage = files[0];
    try{
        let response = await ApiBlog.uploadAvatar({file: fileImage});

        if(response.status !== 200){
            throw new Error(response.response.data?.message);
        }

        const imageSrc = URL.createObjectURL(fileImage);

        setInfos((prev) => ({...prev, avatar: imageSrc}));
        store.setImage(imageSrc);
        toast({
            status: 'success',
            description: 'Фотография обновлена'
        })
    }
    catch(e){
        toast({
            status: 'error',
            description: e.message
        })
    }
    
  }



  const sumbitFunc = async (e) => {
    
    e.preventDefault();
    try{

        if(!infos.email || !infos.name){
            throw new Error('Заполните данные до конца');
        }

        if(!validator.isEmail(infos.email)){
            throw new Error('Введена некорректная почта');
        }

        let response = await ApiBlog.changeUserData({
            name: infos.name,
            email: infos.email
        })

        if(response.status !== 200){
            throw new Error(response.response.data?.message);
        }

        store.setName(infos.name);
        store.setEmail(infos.email);
        let oldImageName = store.getImage().split('/').reverse()[0];
        
        store.setImage(SRC + 'usersImages/avatars/'+ infos.name + "." + oldImageName.split('.')[1])



        toast({
            status: 'success',
            description: 'Данные успешно изменены'
        })

    }
    catch(err){
        toast({
            status: 'error',
            description: err.message
        })
    }  
  }


  

  const changeHandler = (e) => {
    setInfos(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  

  return (
    <div className='page'>
       
        <Header/>
        <Main>
            <section className={optionsStyle.container}>
                <div className={optionsStyle.avatarContainer}>
                    <Avatar className={optionsStyle.avatar} src={infos.avatar} name={infos.name}></Avatar>
                    
                    <div className={optionsStyle.avatarChange}>
                        <input accept='image/*' type='file' onChange={(e) => {
                            changeImage(e.target.files);
                        }}/>
                        <FaPenToSquare/>
                    </div>

                </div>
                <Accordion allowMultiple className={optionsStyle.options}>


                    <AccordionItem className={optionsStyle.optionsItem}>
                        <h2>
                        <AccordionButton _expanded={{bg: 'rgb(80, 149, 214)', color: 'white'}}>
                            <Box as="span" flex='1' textAlign='left'>
                                <span className={optionsStyle.optionsItemTitle}><BsFillPersonLinesFill fontSize={20}/>Данные пользователя</span>
                                
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>

                        <AccordionPanel>
                        <form className={optionsStyle.info} onSubmit={sumbitFunc}>
                            <Input textAlign={'center'} name='name' autoComplete='on' value={infos.name} onChange={changeHandler}/>
                            <Input textAlign={'center'} name='email' autoComplete='on'value={infos.email} onChange={changeHandler}/>
                            <Button type='submit'>Сохранить</Button>
                        </form>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem className={optionsStyle.optionsItem}>
                        <h2>
                        <AccordionButton _expanded={{bg: 'rgb(80, 149, 214)', color: 'white'}}>
                            <Box as="span" flex='1' textAlign='left'>
                            
                            <span className={optionsStyle.optionsItemTitle}><BsUnlockFill fontSize={20}/>Настройка доступа</span>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>

                        <AccordionPanel>
                        <form className={optionsStyle.passchange}
                            onSubmit={(e) => {
                                e.preventDefault();
                                refreshPassword(store.userInfo.email)
                            }}
                        >
                            <Input textAlign={'center'} type={'password'} name='newPass' value={usersPasswords.newPass} onChange={(e) => setUserPasswords({...usersPasswords, newPass: e.target.value})} autoComplete='on' placeholder='Новый пароль' />
                            <Input textAlign={'center'} type={'password'} name='againPass' value={usersPasswords.againPass} onChange={(e) => setUserPasswords({...usersPasswords, againPass: e.target.value})} autoComplete='off' placeholder='Повторите пароль' />
                            <Button type={'submit'}>{isLoading ? <Spinner/> : 'Изменить'}</Button>
                        </form>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

              

                

            </section>

        </Main>
        <Footer/>
    </div>
  )
})
