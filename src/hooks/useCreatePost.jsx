import { Button, Input, Stack, Textarea, useToast } from '@chakra-ui/react';
import { useCallback, useContext, useMemo, useState } from 'react'
import { Context } from '..';
import { IoCodeSlashOutline } from "react-icons/io5";
import TextareaAutosize from 'react-textarea-autosize';
import { BsImageFill, BsXLg } from 'react-icons/bs';
import postStyle from '../components/elements/createPost/formCreate.module.scss'
import { imageSrc } from '../components/constatns/ImageHost';
import ApiBlog from '../api/ApiBlog';
import { useNavigate } from 'react-router-dom';
import { LuArrowUpDown } from "react-icons/lu";
export default function useCreatePost(initialState) {
  const navigateTo = useNavigate();
  const {store} = useContext(Context);
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [data, setData] = useState(initialState);  
  const [files, setFiles] = useState([]);

  const changeHandlerText = useCallback((e, id) => {
    setData((prev) => ([...prev.filter(el => {
        if(el.id === id){
            el.text = e.target.value
        }
        return el;
    })]))
  }, [initialState])

  const changeHeading = useCallback((e, id) => {
    setData((prev) => ([...prev.filter(el => {
        if(el.id === id){
            el.heading = e.target.value
        }
        return el;
    })]))
  }, [initialState])

  const changeCode = useCallback((e, id) => {
    setData((prev) => ([...prev.filter(el => {
        if(el.id === id){
            el.code = e.target.value
        }
        return el;
    })]))
  }, [initialState])

  const addImage = useCallback((e, id) => {
        
        const file = e.target.files[0];
        setFiles((prev) => ([...prev, file]));
        const src = URL.createObjectURL(file);
        setData(prev => ([...prev.filter(el => {
            if(el.id === id){
                el.image = src;
                el.fileName = file.name
            }
            return el
        })]))
        console.log(files);

  }, [initialState])

  const addCode = useCallback((id) => {
    setData((prev) => ([...prev.filter(el => {
      if(el.id === id){
          el.visibleCode = true;
      }
      return el;
    })]))
  }, [initialState])
  const addLink = useCallback((id) => {
    setData((prev) => ([...prev.filter(el => {
      if(el.id === id){
          el.text += '[link="Ссылка"|(Текст ссылки)]';
          
      }
      return el;
    })]))
  }, [initialState])
  const removeCode = useCallback((id) => {
    setData((prev) => ([...prev.filter(el => {
      if(el.id === id){
          el.code = '';
          el.visibleCode = false;
      }
      return el;
    })]))
  }, [initialState])

  const deleteHandlerImage = useCallback((object) => {
    setFiles((prev) => ([...prev.filter(el => el.name !== object.fileName)]))
    setData(prev => ([...prev.filter(el => {
        if(el.id === object.id){
            el.image = '';
        }
        return el
    })]))

  }, [initialState])


  const swipeBlocks = useCallback((currentIndex) => {
    if(data.length > 1){
        const newData = data;
        if(newData[currentIndex - 1]){

          const tempObj = newData[currentIndex - 1];
          newData[currentIndex - 1] = newData[currentIndex];
          newData[currentIndex] = tempObj;


          setData([...newData]);
          toast({
            status: 'success',
            description: `Блок ${currentIndex} встал на место Блока ${currentIndex + 1}`
          })
        }
      }
      


    }


  , [initialState])

  const converterTextArea = useMemo(() => {
    return data ? data.map((textarea, index) => <div className={postStyle.block} key={textarea.id}>
        
        <Stack className={postStyle.menusBlock} direction={'row'} alignItems={'center'} marginBottom={'5px'}>
            {index !== 0 && <Button onClick={() => swipeBlocks(index)} colorScheme={'cyan'}><LuArrowUpDown color='white'/></Button>}
            {textarea.id !== 0 ? <Button colorScheme={'red'} onClick={() => setData((prev) => ([...prev.filter(el => el.id !== textarea.id)]))}>Удалить<br/>текст</Button> : null}
            {
                textarea.image ? null : <div className={postStyle.fileViewBlock}>
                    <BsImageFill/>
                    <Input type='file' accept='image/*' onChange={(e) => addImage(e, textarea.id)}/>
                </div>
            }
            {!textarea.visibleCode && <Button fontSize={'20px'} onClick={() => addCode(textarea.id)}><IoCodeSlashOutline/></Button>}
            <Button onClick={() => addLink(textarea.id)} colorScheme={'telegram'}>Вствить<br/>ссылку</Button>
        </Stack>
        
        <Input variant={'filled'} marginBottom={'5px'} placeholder={'Заголовок блока'} value={textarea.heading} onChange={e => changeHeading(e, textarea.id)}/>
        <Textarea variant={'filled'} placeholder='Содержание' resize={'none'} value={textarea.text} onChange={(e) => changeHandlerText(e, textarea.id)} as={TextareaAutosize}/>
        {
          textarea.visibleCode 
          && 
          <div className={postStyle.codeBlock}>
            <Textarea resize={'none'} as={TextareaAutosize} value={textarea.code} onChange={(e) => changeCode(e, textarea.id)} margin={'5px 0'} placeholder='Вставьте ваш отрезок кода' background={'rgb(27, 27, 27)'} color={'white'}/>
            <Button onClick={() => removeCode(textarea.id)} background={'rgb(27, 27, 27)'} color={'white'}><BsXLg/></Button>
          </div>
        }
        {
            textarea.image ? <div className={postStyle.imagePrev}>
                <img src={textarea.image} alt={'image' + textarea.id}/>
                <Button onClick={(e) => deleteHandlerImage(textarea)}><BsXLg/></Button>
            </div> : null
            
        }
        
    </div>) : null
  }, [data])
  const createTextArea = useCallback((event) => {
    setData((prev) => ([...prev, {id: new Date().getTime(), code: '', text: '', image: '', fileName: '', heading: ''}]));
    setTimeout(() => window.scrollTo({
      top: document.body.scrollHeight
    }) , 200)
  }, [initialState])

  const sendPost = useCallback(async () => {
    try{
        if(!title){
          throw new Error('У поста должно быть название');
        }

        if(!data[0].text && !data[0].image){
          
          throw new Error('У поста должно быть хоть какое-то содержание');
        }

        let changedContentSrcs = data;
        changedContentSrcs = changedContentSrcs.map(el => {
            if(el.image){
              let path = `${imageSrc}posts/${title}/${el.fileName}`;
              el.image = path;
            }
            el.text = el.text;  

            
            return el;
        });
        
        
        let postData = {
            title: title,
            content: JSON.stringify(changedContentSrcs),
            files: files,
            date: new Date().getTime(), 
            access_token: localStorage.getItem('access_token')
        }

        let response = await ApiBlog.createPost(postData);

        if(response.status !== 200){
          throw new Error(response.response.data?.message);
        }
        setData([
          {
              id: new Date().getTime(),
              text: '',
              image: '',
              fileName: '',
              code: '',
              heading: '',
              visibleCode: false
          }
        ]);
        setFiles([]);
        setTitle('');
        store.setCountPosts_inc();
        toast({
          status: 'success',
          description: 'Пост добавлен',
          duration: 5000,
          isClosable: true
        })
        navigateTo('/myPosts')
    }
    catch(e){
        toast({
          status: 'error',
          description: e.message,
          duration: 5000,
          isClosable: true
        })
    }
  }, [initialState])


  const editPost = useCallback(async (post_id) => {
    try{
        if(!title){
          throw new Error('У поста должно быть название');
        }

        if(!data[0].text && !data[0].image){
          throw new Error('У поста должно быть хоть какое-то содержание');
        }

        let changedContentSrcs = data;
        changedContentSrcs = changedContentSrcs.map(el => {
            if(el.image){
              let path = `${imageSrc}posts/${title}/${el.fileName}`;
              el.image = path;
            }
            el.text = el.text;  


            
            return el;
        });
        

        let postData = {
            post_id: post_id,
            title: title,
            content: JSON.stringify(changedContentSrcs),
            files: files,
            date: new Date().getTime(), 
            access_token: localStorage.getItem('access_token')
        }
        console.log(postData)
        let response = await ApiBlog.editPost(postData);
        console.log(data);
        if(response.status !== 200){
          throw new Error(response.response.data?.message);
        }
        toast({
          status: 'success',
          description: 'Пост изменен',
          duration: 5000,
          isClosable: true
        })
        navigateTo('/myPosts')
    }
    catch(e){
        toast({
          status: 'error',
          description: e.message,
          duration: 5000,
          isClosable: true
        })
    }
  }, [initialState])

  
  

  return {title,converterTextArea, setTitle, createTextArea, sendPost, setData, files, data, editPost}
}

