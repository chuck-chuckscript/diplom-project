

import { useEffect, useMemo, useRef, useState } from 'react';



import postPageStyle from './postPage.module.scss'

import { Link, useParams } from 'react-router-dom';





import {Button, Center, Code, Modal, ModalCloseButton, ModalContent, ModalOverlay, Radio, RadioGroup, Spinner, Stack, Textarea, useDisclosure, useToast } from '@chakra-ui/react';


import { Footer } from '../layouts/Footer';
import { Main } from '../layouts/Main';
import { Header } from '../layouts/Header';
import { useFetchPost } from '../../hooks/useFetchPost';


import CommentList from '../elements/comment/CommentList';
import { searchLinkInText } from '../../utils/searchLink';
import ApiBlog from '../../api/ApiBlog';






function Post() {
    const [content, setContent] = useState([]);
    const toast = useToast();
    const params = useParams();
    const [report, setReport] = useState('');
    const [data, loading] = useFetchPost(params.id);
    const {isOpen, onClose, onOpen} = useDisclosure();
    const form = useRef(null);
    useEffect(() => {

        let content = data?.post_content ? JSON.parse(data.post_content) : null;

        if(content){
            setContent(content)
            console.log(content);
        }

        
    }, [data])
    const convert = useMemo(() => {
        return content.map(el => {


            
            return <div className={postPageStyle.block} key={el.id}>
                    {el?.heading && <h2>{el.heading}</h2>}
                    <pre dangerouslySetInnerHTML={{__html: searchLinkInText(el.text)}}></pre>
                    {el?.code && <Code variant={'solid'} padding={'5px'} color={'white'} background={'rgb(27, 27, 27)'} display={'block'}>{el?.code}</Code>}
                    {el?.image && <img src={el.image} alt={el.fileName} loading='lazy'/>}
            </div>
            
            
        })
  }, [content])
    const sendReport = async (e) => {
        e.preventDefault();
        try{
   
            const data = {
                post_id: params.id,
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

            let response = await ApiBlog.createPostReport(data);


            toast({
                status: 'success',
                description: 'Жалоба принята на обработку'
            })
            onClose();
        }
        catch(e){
            toast({
                status: 'error',
                description: e.message
            })
        }
    }
    

    return (<div className='page'>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton/>
                <form ref={form} className={postPageStyle.reportForm} onSubmit={sendReport}>
                    <RadioGroup value={report} onChange={setReport}>
                        <Stack>
                            <Radio value={'Спам, реклама'}>Спам, реклама</Radio>
                            <Radio value={'Неприемлемый контент'}>Неприемлемый контент</Radio>
                            <Radio value={'Оскорбление, травля, пропаганда'}>Оскорбление, травля, пропаганда</Radio>
                            <Radio value={'0'}>Другое</Radio>
                        </Stack>
                    </RadioGroup>
                    <Textarea name='otherReport' disabled={report !== '0'} resize={'none'}/>
                    <Button type='submit' colorScheme={'telegram'}>Отправить жалобу</Button>
                </form>
            </ModalContent>
        </Modal>
        <Header/>
        <Main>


        
        {loading ? <Center><Spinner/></Center> : 
        
        <div className={postPageStyle.post}>
            <h1 className={postPageStyle.title}>
            <span className={postPageStyle.titleText}>{data ? data.post_title : null}</span>
            <span className={postPageStyle.author}>Автор: {data ? <Link to={'/user/'+data.user_id}>{data.name}</Link> : null}</span>
            <span className={postPageStyle.date}>Опубликован: {data ? Intl.DateTimeFormat('ru-Ru', {
                dateStyle: 'short',
                timeStyle: 'short'
            }).format(data.post_date) : null}</span>
            
            </h1>
            {convert}

            <Button onClick={onOpen} className={postPageStyle.report} colorScheme={'red'}>Пожаловаться</Button>
        </div>
        
        }
        
        
            <CommentList post_id={params.id}/>
        </Main>
        <Footer></Footer>
    </div>);
}

export default Post;