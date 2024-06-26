import { Avatar, Button, Modal, ModalCloseButton, ModalContent, ModalOverlay, Radio, RadioGroup, Stack, Textarea, useToast } from '@chakra-ui/react'
import { memo, useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import commentsStyle from './comment.module.scss';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { useRef } from 'react';
import ApiBlog from '../../../api/ApiBlog';
import { useEffect } from 'react';
import {Context} from '../../../index'
import { observer } from 'mobx-react-lite';

function Comment({comment_id, id, name, date, text, avatar, like, dislike, withoutButtons = false}) {
    const toast = useToast()
    const [isReporting, setIsReporting] = useState(false);
    const [report, setReport] = useState('');
    const {store} = useContext(Context);
    const [statusLikes, setStatusLikes] = useState([0, 0]);
    const form = useRef(null);
    const [params, setParams] = useState({
        like: +like,
        dislike: +dislike
    })
    useEffect(() => {
        (
            async () => {
                try{
                    let res = await ApiBlog.checkLikeStatus(comment_id);

                    setStatusLikes([...res]);
                    console.log(res);
                }
                catch(e){
                    setStatusLikes([0, 0])
                    console.log(e);
                }
            }
        )();
    }, [store.userInfo.id])

    const likeComInc = async () => {
  
        try{

          
            let res = await ApiBlog.sendLike(comment_id);
            setParams({...params, like: params.like + 1})
            setStatusLikes([1, statusLikes[1]])
               
            
            
        }
        catch(e){

            if(e.message !== 'Request failed with status code 423'){
                toast({
                    status: 'error',
                    description: e.message
                })
            }
            
        }

        
    }
    const dislikeComInc = async () => {
        try{
            let res = await ApiBlog.sendDislike(comment_id);
            setParams({...params, dislike: params.dislike + 1})

            setStatusLikes([statusLikes[0], 1])
        }
        catch(e){
            if(e.message !== 'Request failed with status code 423'){
                toast({
                    status: 'error',
                    description: e.message
                })
            }
        }
        
    }
    const unlikeCom = async () => {

        try{
            let res = await ApiBlog.unLike(comment_id);
            setParams({...params, like: params.like - 1})

            setStatusLikes([0, statusLikes[1]])
        }
        catch(e){

            if(e.message !== 'Request failed with status code 423'){
                toast({
                    status: 'error',
                    description: e.message
                })
            }
            
        }

        
    }
    const undislikeCom = async () => {
        try{
            let res = await ApiBlog.unDislike(comment_id);
            setParams({...params, dislike: params.dislike - 1})

            setStatusLikes([statusLikes[0], 0])
        }
        catch(e){
            if(e.message !== 'Request failed with status code 423'){
                toast({
                    status: 'error',
                    description: e.message
                })
            }
        }
        
    }

    const sendReport = async (e) => {
        e.preventDefault();
        try{
            const data = {
                comment_id: comment_id,
                report: '',
                date: new Date().getTime()
            }
            if(report === '0'){
               data.report = form.current.otherReport.value;
            }
            else{
                data.report = report;
            }
    
            if(!data.report){
                throw new Error('Не выбрана причина жалобы')
            }

            let response = await ApiBlog.createReport(data);


            toast({
                status: 'success',
                description: 'Жалоба принята на обработку'
            })
            setIsReporting(false);
        }
        catch(e){
            toast({
                status: 'error',
                description: e.message
            })
        }
    }
  
    useEffect(() => {
        if(!isReporting){
            setReport('')
        }

    }, [isReporting])

   return (
    <div className={commentsStyle.comment}>
        <Modal isOpen={isReporting} isCentered onClose={() => setIsReporting(false)}>
            <ModalOverlay/>
            <ModalContent width={'600px'} maxW={'90%'} padding={10}>
                <ModalCloseButton/>
                <form onSubmit={sendReport} ref={form} action="">
                    <Stack>
                    <RadioGroup value={report} onChange={setReport} name='radio'>
                        <Stack>
                        <Radio value='Оскорбление, травля, пропоганда насилия'>Оскорбление, травля, пропоганда насилия</Radio>
                        <Radio value='Неприемлемый контент'>Неприемлемый контент</Radio>
                        <Radio value='Спам, реклама'>Спам, реклама</Radio>
                        <Radio value='0'>Другое</Radio>
                        </Stack>
                    </RadioGroup>
                    <Textarea name='otherReport' disabled={report !== '0'} resize={'none'}/>
                    <Button type='submit' colorScheme={'telegram'}>Отправить жалобу</Button>
                    </Stack>
                    

                    
                </form>
                
            </ModalContent>
        </Modal>
        <div className={commentsStyle.commentInfo}>
            <Avatar className={commentsStyle.commentInfoAvatar} src={avatar ? avatar : null} name={name ? name : ''}/>
            <Link to={'/user/'+id} className={commentsStyle.commentInfoName}>{name}</Link>
            <span className={commentsStyle.commentInfoDate}>Опубликован: {Intl.DateTimeFormat('ru-Ru', {
                dateStyle: 'short'
            }).format(date ? date : null)} в {Intl.DateTimeFormat('ru-Ru', {
                timeStyle: 'short'
            }).format(date ? date : null)}</span>
        </div>
        <pre>{text}</pre>

        {
            withoutButtons ? 
            null
            :
            <div className={commentsStyle.commentOptions}>
            <div>
                
                <Button onClick={statusLikes[0] === 0 ? likeComInc : unlikeCom}>

                    {
                        statusLikes[0] === 0 ? <AiOutlineLike fill='green'/> : <AiFillLike fill='green'/>
                    }
                    
                </Button>
                <span style={{color: 'green'}}>{params.like ? Intl.NumberFormat('ru-Ru', {
                    compactDisplay: 'short'
                }).format(params.like) : null}</span>
                <Button onClick={statusLikes[1] === 0 ? dislikeComInc : undislikeCom}>
                    {
                        statusLikes[1] === 0 ? <AiOutlineDislike fill='red'/>: <AiFillDislike fill='red'/>
                    }
                    
                </Button>
                <span style={{color: 'red'}}>{params.dislike ? Intl.NumberFormat('ru-Ru', {
                    notation: 'compact',
                    compactDisplay: 'short'
                }).format(params.dislike) : null}</span>
            </div>
            <Button onClick={() => setIsReporting(true)}>Пожаловаться</Button>
        </div>
        }
        
    </div>
  )
}
export default observer(Comment);
