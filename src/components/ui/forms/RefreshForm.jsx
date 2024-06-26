import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, Stack, Text } from '@chakra-ui/react'
import { useRef } from 'react';
import useFetchCode from '../../../hooks/useFetchCode'


export default function RefreshForm({isOpen, onClose}) {
  const {isLoading, usersPasswords, setUserPasswords, refreshPassword} = useFetchCode();
  const emailRef = useRef(null);
  
  return (
    <Modal isOpen={isOpen} isCentered onClose={() => onClose(false)}>
        <ModalOverlay/>
        <ModalContent maxW={'600px'}>
            <ModalCloseButton/>
            <ModalBody padding={'50px 10px 10px 10px'}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    refreshPassword(emailRef.current.value).then(() => onClose(false));
                }}>
                    <Stack>
                        <Text textAlign={'center'}>
                            Пожалуйста, укажите вашу действительную почту от аккаунта
                            <br/>
                            и не забудьте придумать надежный пароль
                        </Text>
                        <Input name='email' ref={emailRef} autoComplete={'email'} variant={'filled'} placeholder='Почта'/>
                        <Input name='newPass' type={'password'} value={usersPasswords.newPass} onChange={(e) => setUserPasswords({...usersPasswords, newPass: e.target.value})} autoComplete={'off'} variant={'filled'} placeholder='Новый пароль'/>
                        <Input name='againPass' type={'password'} value={usersPasswords.againPass} onChange={(e) => setUserPasswords({...usersPasswords, againPass: e.target.value})} autoComplete={'off'} variant={'filled'} placeholder='Повторите введенный пароль'/>
                        <Button type='submit' colorScheme={'telegram'}>{isLoading ? <Spinner/> : 'Изменить пароль'}</Button>
                    </Stack>
                </form>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}
