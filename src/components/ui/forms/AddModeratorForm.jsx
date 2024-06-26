import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Stack, useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import validator from 'validator';
import ApiBlog from '../../../api/ApiBlog'
import {BsClipboard} from 'react-icons/bs'
export default function AddModeratorForm({isOpen, onClose}) {
  const formRef = useRef(null);
  const toast = useToast();
  const [submiton, setSubmition] = useState(false);
  const sumbitFunc = async () => {
    try{
        let data = {
            login: formRef.current.login.value,
            password: formRef.current.password.value,
            name: formRef.current.name.value,
            email: formRef.current.email.value,
            access_token: localStorage.getItem('access_token')
        }
        if(!data.login || !data.name || !data.password || !data.email){
            throw new Error('Поля не заполнены до конца');
        }

        if(!validator.isEmail(data.email)){
            throw new Error('Указана некорректная почта');
        }
        let response = await ApiBlog.addModerator(data);
        setSubmition(true);
        toast({
            status: 'success',
            description: 'Модератор добавлен'
        })

    }
    catch(e){
        toast({
            status: 'error',
            description: e.message
        })
    }
  }

  const copyText = (e) => {
    console.log(e.currentTarget.parentElement.innerText);
    navigator.clipboard.writeText(e.currentTarget.parentElement.innerText)
  }

  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose}>
        <ModalOverlay/>
        <ModalContent padding={'50px 10px 5px 10px'}>
            <ModalCloseButton/>
            <ModalBody padding={0}>
                {!submiton ? 
                    <form ref={formRef} onSubmit={(e) => {
                        e.preventDefault();
                        sumbitFunc()
                    }}>
                        <Stack>
                            <Input autoComplete={'off'} name='login' placeholder='Логин'/>
                            <Input autoComplete={'password'} type='password' name='password' placeholder='Пароль'/>
                            <Input autoComplete={'email'} name='email' placeholder='Почта'/>
                            <Input autoComplete={'off'} name='name' placeholder='Имя'/>
                            <Button type='submit' colorScheme={'telegram'}>Добавить модератора</Button>
                        </Stack>
                    </form>
                    :
                    <pre style={{border: '1px solid grey', padding: '5px', borderRadius: '5px', position: 'relative'}}>
                        <Button onClick={copyText} position={'absolute'} right={0} top={0} variant={'filled'} margin={'5px'}><BsClipboard /></Button>
                        login: {formRef.current?.login.value};
                        <br/>
                        password: {formRef.current?.password.value};
                    </pre>

                }
                
            </ModalBody>

        </ModalContent>
        
    </Modal>
  )
}
