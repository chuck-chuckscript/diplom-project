import { Button, Center, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react'
import { BsChevronDown, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import ApiBlog from '../../../api/ApiBlog';
import useFetchPaginationData from '../../../hooks/useFetchPagintaionData';
import style from './tableList.module.scss'
export default function PostsReportsTableList({menu, menuHandler}) {


    // const [data, setData] = useState();
    // const [search, setSearch] = useState('');
    const toast = useToast();
    const [searchValue, setSearch] = useState('');

    const {data, setData, search, installSearchValue, loading, nextPage, prevPage, infoPagination, resetSearch} = useFetchPaginationData(ApiBlog.getReportsPosts, 8);
    const deletePost = async(id, name) => {

        try{
          let res = await ApiBlog.deletePost({
            post_id: id,
            post_parent_dir: name
          })
    
    
          setData([...data.filter(el => +el.post_id !== id)]);
          toast({
            description: 'Пост успешно удален',
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

    const rejectReport = async(id) => {

        try{
          let res = await ApiBlog.deleteReportPost(id)
    
    
          setData([...data.filter(el => +el.report_id !== id)]);
          toast({
            description: 'Жалоба удалена',
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


    const tableTr = useMemo(() => {
        return data.map(el => <Tr key={el.report_id}>
            <Td>{el.report_id}</Td>
            <Td maxW={300}>{el.report_details}</Td>
            <Td>{Intl.DateTimeFormat('ru-Ru', {
                dateStyle: 'short',
                timeStyle: 'short'
            }).format(el.report_date)}</Td>
            <Td>
                <Link target={'_blank'} to={'/post/'+el.post_id}>Посмотреть жалобу</Link>
                <Button onClick={() => deletePost(+el.post_id, el.post_title)} colorScheme={'green'}>Принять</Button>
                <Button onClick={() => rejectReport(+el.report_id)} colorScheme={'red'}>Отклонить</Button>
            </Td>
        </Tr>)
        }, [data])
      
        return (
        <div className={style.container}>
            <Flex justifyContent={'space-between'} margin={'0 0 10px 0'}>
                
                
                <div>
                    {infoPagination.page > 1 ? <Button onClick={prevPage}><BsChevronLeft/></Button> : null }
                    {infoPagination.page < infoPagination.maxPages ? <Button onClick={nextPage}><BsChevronRight/></Button> : null}   
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
    
                
                installSearchValue(searchValue)
                
                
            }}>
                    <Flex>
                    <Input placeholder='Введите номер жалобы' marginRight={'10px'} value={searchValue} onChange={(e) => setSearch(e.target.value)}/>
                    {
                        search ? <Button onClick={() => resetSearch(setSearch)}>Сбросить</Button> : <Button type='submit'>Найти</Button>
                    }
                    
                    </Flex>
            </form>
            
            {
                loading ? <Center><Spinner/></Center> 
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
    
                            {tableTr?.length > 0 ? tableTr : 
                            <Tr>
                                <Td rowSpan={4}>Нету жалоб на посты</Td>    
                            </Tr>}
                        
                    </Tbody>
                </Table>
                            
            }
            
        </div>
      )
  
}
