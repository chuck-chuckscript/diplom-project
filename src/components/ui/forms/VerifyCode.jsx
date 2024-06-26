import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, PinInput, PinInputField, Stack, Text, useToast } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../..';
import ApiBlog from '../../../api/ApiBlog';



function VerifyCode() {
  const toast = useToast();
  const navigate = useNavigate();
  const {store} = useContext(Context);

  const [codeValue, setCodeValue] = useState();

  const sendCode = async () => {


    try{
        // console.log(code);
        let response = await ApiBlog.verifyCode(codeValue);

        if(response.status !== 200){
            throw new Error(response.response.data?.message);
        }
        toast({
            status:'success',
            description: 'Пароль изменен'
        })
        store.set_modalVerifyCode(false);
        store.logout();
        navigate('/');
    }
    catch(err){
        toast({
            description: err.message,
            status: 'error'
        })
    }
  }

  return (
    <Modal isOpen={store.modalVerifyCode} onClose={() => {store.set_modalVerifyCode(false)}} isCentered>
            <ModalOverlay backdropFilter='blur(10px) grayscale(50%)'/>
            <ModalContent>
                
                <ModalCloseButton/>
                

                    <ModalBody p={'20px'}>
                        <Stack alignItems={'center'} direction={'column'} spacing={5}>
                            <h1>Введите код</h1>
                            <Text fontSize={14}>Проверьте почту, которую вы привязывали к своему аккаунту</Text>
                            <HStack>
                                    <PinInput value={codeValue} onChange={(code) => setCodeValue(code)} otp>
                                        <PinInputField></PinInputField>
                                        <PinInputField></PinInputField>
                                        <PinInputField></PinInputField>
                                        <PinInputField></PinInputField>
                                        <PinInputField></PinInputField>
                                        <PinInputField></PinInputField>
                                    </PinInput>
                            </HStack>
                            <Button w={'100%'} colorScheme={'telegram'} onClick={sendCode}>Отправить</Button>
                        </Stack>
                    </ModalBody>

                
                
            </ModalContent>
        </Modal>
  )
}

export default observer(VerifyCode);