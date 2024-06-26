import { memo} from 'react'
import {Input, Button, Center, Spinner, Link} from '@chakra-ui/react';

import postStyle from './formCreate.module.scss'


import useCreatePost from '../../../hooks/useCreatePost';
import { useState } from 'react';
import { useEffect } from 'react';
import ApiBlog from '../../../api/ApiBlog';
import { useContext } from 'react';
import { Context } from '../../..';
import { IoIosWarning } from "react-icons/io";

export const CreatePost = memo(() => {
  const {store} = useContext(Context);
  const [isLoading, setLoading] = useState(false);
  const [isBlocked, setBlocked] = useState({
    active: false,
    message: ''
  });

  const {title, converterTextArea, setTitle, createTextArea, sendPost} = useCreatePost([{
    id: new Date().getTime(),
    code: '',
    heading: '',
    text: '',
    image: '',
    fileName: '',
    visibleCode: false
  }])


  useEffect(() => {
    (async () => {
      try{
        setLoading(true);
        let response = await ApiBlog.checkBanStatus()
        
        if(+response.ban_blocked_service === 1){
          setBlocked({message: ' ' + response.ban_message, active: true});
        }
      }
      catch(e){
        console.log(e)
      }
      finally{
        setLoading(false)
      }
    })()
  }, [])
  

  return (
    <>
      {isLoading 
        ? <Center><Spinner/></Center> 
        : 
        <>
        {isBlocked.active 
          ? 
          <div className='blockBanner'>
            <IoIosWarning/>
            Ваш аккаунт был заблокирован
            <br/>
            По причине: 
            {isBlocked.message ? isBlocked.message : ' Неприемлемого содержания в ваших постах'}
            <br/>
            Обжаловать данное решение и снять блокировку можно обратившись в тех.поддержку (myblogtech@yandex.ru)
            <br/>
            <br/>
            С уважением администрация портала MYBLOG.RU
          </div>
          :
          <div className={postStyle.createContainer}>
            
            
            
            <div className={postStyle.menu}>
                <div>
                  <Button colorScheme={'green'} onClick={sendPost}>Создать пост</Button>
                  <Button onClick={createTextArea}>Добавить текст</Button>
                </div>    
            </div>
            
            <div>
              <Input variant={'filled'} value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Название поста'/>
              {converterTextArea}
            </div>
          </div>
      
        }
        </>
      
      
      }
      
    

    
    
    </>
    
  )
})
