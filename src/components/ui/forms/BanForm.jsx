import {Button, Modal, ModalCloseButton, ModalContent, ModalOverlay, Select, Stack, Textarea, useToast } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import TextareaAutoresize from 'react-textarea-autosize'
import { Context } from '../../..'
import ApiBlog from '../../../api/ApiBlog'
function BanForm({replaceFieldStatus}) {
  const {store} = useContext(Context);
  const toast = useToast();
  const refMessage = useRef({});
  const [blockService, setBlockService] = useState(0)
  const ban = async () => {
    try{
        let dataUser = {
            user_id: store.getBanId(),
            message: refMessage.current?.value,
            block_service: +blockService,
            access_token: localStorage.getItem('access_token')
        }


        if(blockService === 0){
            throw new Error('Необходимо выбрать что запретить для пользователя')
        }
        let response = await ApiBlog.setBan(dataUser)

        replaceFieldStatus(prev => ([...prev.map(el => {
            if(+el.user_id === store.getBanId()){
                el.ban_blocked_service = +blockService
            }
            return el;
        })]))
        store.setBanId(0);
        toast({
            status: 'success',
            description: 'Пользователь заблокирован'
        })
    }
    catch(e){
        toast({
            status: 'error',
            description: e.message
        })
    }
  } 

  return (
    <Modal isOpen={store.getBanId() !== 0 ? true : false} isCentered onClose={() => store.setBanId(0)}>
        <ModalOverlay/>
        <ModalContent p={'50px 10px 5px 10px'}>
            <ModalCloseButton/>
        <form onSubmit={(e) => {
            e.preventDefault();
            ban();
        }}>
            <Stack>
                <Select value={blockService} onChange={(e) => setBlockService(e.target.value)}>
                    <option value={0} disabled>Выберите сервис блокировки</option>
                    <option value={1}>Запретить писать посты</option>
                    <option value={2}>Запретить писать комментарии</option>
                </Select>
                <Textarea ref={refMessage} placeholder='Введите причину блокировки' maxH={'200px'} resize={'none'} as={TextareaAutoresize}/>
                <Button type='submit' colorScheme={'red'}>Заблокировать пользователя</Button>
            </Stack>
        </form>
        </ModalContent>
    </Modal>
    
  )
}
export default observer(BanForm)