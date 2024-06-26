import { Button, Center, Spinner, Textarea, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { IoIosWarning } from 'react-icons/io';
import { Link } from 'react-router-dom';
import reactTextareaAutosize from 'react-textarea-autosize';
import { Context } from '../../..';
import ApiBlog from '../../../api/ApiBlog';
import { useFetchPosts } from '../../../hooks/useFetchPosts';

import Comment from './Comment';
import commentsListStyle from './comment.module.scss';
function CommentList({post_id}) {
  const {store} = useContext(Context);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isBlocked, setBlocked] = useState({
    active: false,
    message: ''
  })
  const [fetching, load] = useFetchPosts(async (userData) => {

    let res = await ApiBlog.getComments(userData);
    console.log(res);
    
    setData([...data, ...res]);

  })
    
  const formRef = useRef(null);
  const toast = useToast();
  const fetchBanStatus = async () => {
    setLoading(true);
    try{
        if(store.getAuth()){
            let response = await ApiBlog.checkBanStatus()
              
            if(+response.ban_blocked_service === 2){
              setBlocked(prev => ({message: ' ' + response.ban_message, active: true}));
            }
        }
        
    }
    catch(e){
        console.log(e);
    }
    finally{
        setLoading(false)
    }
    
    
  }
  useEffect(() => {
    
    fetching(post_id);
  }, [])

  useEffect(() => {
    fetchBanStatus()
  }, [store.isAuth])


  const memoComments = useMemo(() => data.map(e => <Comment key={e.comment_id} comment_id={e.comment_id} dislike={e.comment_dislikes} like={e.comment_likes} avatar={e.user_avatar ? e.user_avatar : ''} id={e.comment_user} date={e.comment_date} name={e.name} text={e.comment_text}/>), [data.length])

  const addComment = async (e) => {
        e.preventDefault();
        try{
            if(!formRef.current.text.value){
                throw new Error('Необходимо заполнить поле')
            }
            if(!store.userInfo.id){
                throw new Error('Необходимо авторизоваться чтобы написать комментарий');
            }
            
            let response = await ApiBlog.sendComment({
                user_id: store.userInfo.id,
                text: formRef.current.text.value,
                post_id: post_id,
                date: new Date().getTime()
            })

            
            
            setData([{
                comment_user: store.userInfo.id,
                name: store.userInfo.name,
                comment_text: formRef.current.text.value,
                user_avatar: store.userInfo.avatar,
                comment_date: new Date().getTime(),
                comment_id: new Date().getTime()
            }, ...data])
            


            formRef.current.reset();
            toast({
                description: 'Ваш комментарий отправлен',
                status: 'success'
            })
        }
        catch(e){
            toast({
                description: e.message,
                status: 'error'
            })
        }
        

    }

  

  return (
    <div className={commentsListStyle.commentsList}>
        <h2>Комментарии</h2>
        {   
            isLoading ? <Center><Spinner/></Center> :
            <>
            {
                isBlocked.active 
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
                <>
                    {store.getAuth() && <form onSubmit={addComment} className={commentsListStyle.commentForm} ref={formRef}>
                    <Textarea name='text' variant={'filled'} placeholder='Оставить комментарий' maxH={220} resize={'none'} as={reactTextareaAutosize}/>
                    <Button type='submit' colorScheme={'telegram'}>Отправить</Button>
                </form>}
                
                
                </>
                
                
            }
            </>
            
        }
        

        <div className={commentsListStyle.list}>
            {memoComments.length > 0 ? memoComments : <Center><h3>К этому посту не было написано комментарев</h3></Center>}
            {load ? <Center><Spinner/></Center> : null}
        </div>
           
    </div>
  )
}
export default observer(CommentList);