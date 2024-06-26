
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {Input, Textarea, Stack, Button, useToast, Code} from '@chakra-ui/react';

import postStyle from '../elements/createPost/formCreate.module.scss'

import { Link, useParams } from 'react-router-dom';
import { useFetchPost } from '../../hooks/useFetchPost';
import useCreatePost from '../../hooks/useCreatePost';

export const EditPost = memo(() => {
  const params = useParams();
  const [dataPost] = useFetchPost(params.id);
  
  useEffect(() => {
    if(dataPost?.post_content){
        setTitle(dataPost.post_title)
        const content = JSON.parse(dataPost?.post_content);
        
        setData(() => [...content]);
    }
  }, [dataPost])
  const {title, setTitle, converterTextArea, createTextArea, setData, editPost} = useCreatePost([]);
  
  

  
 

  return (
    <div className={postStyle.createContainer}>
        <div className={postStyle.menu}>
            <div>
              
              <Button colorScheme={'green'} onClick={() => editPost(params.id)}>Сохранить</Button>
              <Link className={postStyle.back} to={'/myPosts'}>Отменить редактирование</Link>
              <Button onClick={createTextArea}>Добавить текст</Button>
              
            </div>
            
            
        </div>
        
        <div>
        <Input variant={'filled'} value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Название события'/>
        {converterTextArea}
        </div>
        


    </div>
  )
})
