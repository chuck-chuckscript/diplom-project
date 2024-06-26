import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Stack, useToast } from '@chakra-ui/react'
import React, { memo, useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'
import ApiBlog from '../../../api/ApiBlog'
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import stylePostPrew from './postpreview.module.scss'
import { Context } from '../../..';

export const PostPreview = memo(({id,title,author, date, withDel, dir, edit}) => {
  const toast = useToast();
  const {store} = useContext(Context);
  const deleteHandler = useCallback(async () => {
    
    try{
      let response = await ApiBlog.deletePost({
        post_id: id,
        post_parent_dir: dir ? dir : 'posts_md'
      })
      if(response.status !== 200){
        throw new Error(response.response.data?.message);
      }

      withDel(prev => ([...prev.filter(el => el.post_id !== id)]));
      store.setCountPosts_dec();
      toast({
        status: 'success',
        description: 'Пост удален'
      })
    }
    catch(e){
      toast({
        status: 'error',
        description: e.message
      })
    }
  }, [withDel]);
  
  
  
  return (
    <div className={stylePostPrew.container}>
        <h2>{title}</h2>

        <div>
            {author.name && <p className={stylePostPrew.author}>Автор: <Link to={'/user/'+author.id}>{author.name}</Link></p>}
            
            <p className={stylePostPrew.time}>Опубликовано: {Intl.DateTimeFormat('ru-Ru', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(+date)}</p>
            <div>

            <Link className={stylePostPrew.postLink} to={'/post/'+id}>Прочитать пост</Link>
              {edit ? <Popover
                  closeOnBlur
                  placement='left'
                >
                <PopoverTrigger>
                  <Button><PiDotsThreeOutlineFill/></Button>
                </PopoverTrigger>

                
                <PopoverContent w={'fit-content'}>
                  <PopoverArrow/>
                  {/* <PopoverCloseButton color={'black'}/> */}
                  <div className={stylePostPrew.editMenu}>
                    {edit ? <Link title='Редактирование' to={'/edit/'+id}>Редактировать</Link> : null}
                    {
                      <Button onClick={() => withDel ? deleteHandler() : null} color={'red'} w={'auto'} h={"auto"}>Удалить</Button>
                    }
                  </div>
                </PopoverContent>
              </Popover>: null}
              
              
              
              
              
            </div>
            
            
        </div>
        
    </div>
  )
})
