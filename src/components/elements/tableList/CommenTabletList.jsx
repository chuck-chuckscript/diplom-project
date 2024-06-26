import { Button, Center, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'

import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useMemo } from 'react'
import { BsChevronDown, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import ApiBlog from '../../../api/ApiBlog';
import useFetchCommentList from '../../../hooks/useFetchCommentList';
import { useFetchPosts } from '../../../hooks/useFetchPosts';
import Comment from '../comment/Comment';
import style from './tableList.module.scss'
export default function CommentTableList({menu, menuHandler}) {
    const [idComment, setIdComment] = useState(0);
    const [search, setSearch] = useState('');
    const [commentData, setCommentData] = useState(null);
    const [dataComList, loadComList, nextPageComList, prevPageComList, installSearchValueComList, deleteComment, rejectReport, infoPagination] = useFetchCommentList(8);
    const [fetching, loading] = useFetchPosts(async (userData) => {
        let response = await ApiBlog.getCommentById(userData);
        setCommentData(response);
    })
    const resetSearh = () => {
        setSearch('');
      }

    useEffect(() => {
        if(idComment){
            fetching(idComment);
        }
    }, [idComment])



    const tableTr = useMemo(() => {
    return dataComList.map(el => <Tr key={el.report_id}>
        <Td>{el.report_id}</Td>
        <Td maxW={300}>{el.report_details}</Td>
        <Td>{Intl.DateTimeFormat('ru-Ru', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(el.report_date)}</Td>
        <Td>
            <Button onClick={() => setIdComment(el.comment_id)}>Посмотреть жалобу</Button>
            <Button onClick={() => deleteComment(el.comment_id)} colorScheme={'green'}>Принять</Button>
            <Button onClick={() => rejectReport(el.report_id)} colorScheme={'red'}>Отклонить</Button>
        </Td>
    </Tr>)
    }, [dataComList])
  
    return (
    <div className={style.container}>
        <Flex justifyContent={'space-between'} margin={'0 0 10px 0'}>
            
            
            <div>
                {infoPagination.page > 1 ? <Button onClick={prevPageComList}><BsChevronLeft/></Button> : null }
                {infoPagination.page < infoPagination.maxPages ? <Button onClick={nextPageComList}><BsChevronRight/></Button> : null}   
            </div>

            <Menu>
                <MenuButton as={Button} rightIcon={<BsChevronDown fontSize={10}/>}>Меню модерации</MenuButton>
                <MenuList>
                    {menu ? menu.map(el => <MenuItem key={el.id} color={el.active ? 'white' : 'initial'}  background={el.active ? '#5095d6' : 'none'} onClick={() => menuHandler(el.id)}>{el.title}</MenuItem>) : null}
                </MenuList>
            </Menu>
        </Flex>
        <form style={{margin: '0 0 10px 0'}} onSubmit={(e) => {
            e.preventDefault();

            
            installSearchValueComList(search)
            
            
        }}>
                <Flex>
                <Input placeholder='Введите номер жалобы' marginRight={'10px'} value={search} onChange={(e) => setSearch(e.target.value)}/>
                {
                    search ? <Button onClick={resetSearh}>Сбросить</Button> : <Button type='submit'>Найти</Button>
                }
                
                </Flex>
        </form>
        <Modal isOpen={idComment ? true : false} onClose={() => setIdComment(0)} isCentered>
            <ModalOverlay/>
            <ModalContent width={'1000px'} maxW={'90%'} padding={'30px 0'}>
                <ModalCloseButton/>
                <ModalBody>
                    {loading 
                    ? <Center><Spinner/></Center>
                    :
                    <Comment text={commentData?.comment_text} name={commentData?.name} date={commentData?.comment_date} avatar={commentData?.user_avatar} withoutButtons/>

                    }
                </ModalBody>
            </ModalContent>
        </Modal>
        {
            loadComList ? <Center><Spinner/></Center> 
            : 
            <Table>
                <Thead>
                    <Tr>
                        <Th>ID жалобы</Th>
                        <Th>Причина жалобы</Th>
                        <Th>Дата жалобы</Th>
                        <Th>Действие</Th>
                    </Tr>
                </Thead>
                <Tbody>

                        {tableTr?.length > 0 ? tableTr : <Tr></Tr>}
                    
                </Tbody>
            </Table>
                        
        }
        
    </div>
  )
}
