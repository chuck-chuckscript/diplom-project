import { Avatar, Button, Divider, useToast } from '@chakra-ui/react';
import React, { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Context } from '../../..';
import ApiBlog from '../../../api/ApiBlog';
import { imageSrc } from '../../constatns/ImageHost';
import style from './item.module.scss';

export const UserListItem = ({id, name, avatar, comeOffId, onDelete}) => {
  const {store} = useContext(Context);
  const toast = useToast();
  const comeOffHandler = useCallback(async () => {

    try{
        console.log(comeOffId)
        let response = await ApiBlog.comeOff(comeOffId);


        if(response.status !== 200){
            throw new Error(response.response.data?.message);
        }

        if(onDelete){
            onDelete(prev => ([...prev.filter(el => +el.user_id !== +id)]))
        }
        store.setCountSubs_dec();
        toast({
            status: 'success',
            description: 'Вы отписались от ' + name
        })
    }
    catch(e){
        toast({
            status: 'error',
            description: e.message
        })
    }
  }, [onDelete])

  return (
    <div className={style.containerUser}>
        <div>
            <Link to={'/user/'+ id}>
                <Avatar marginRight={'10px'} loading={'lazy'} name={name} src={avatar ? imageSrc + 'usersImages/avatars/'+ avatar : null}/>
                <h2>{name}</h2>
            </Link>
            

            {
                comeOffId ? <Button onClick={comeOffHandler} colorScheme={'red'}>Отписаться</Button> : null
            }
        </div>
        

        <Divider borderColor={'gray.300'} marginTop={'5px'}/>
    </div>
  )
}
