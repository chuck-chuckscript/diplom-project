import { Button, Center, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useState } from 'react';
import { BsChevronDown, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Link } from 'react-router-dom'
import useFetchPostList from '../../../hooks/useFetchPostList';
import style from './tableList.module.scss'

 function PostTableList({menu, menuHandler}) {
    const [search, setSearch] = useState('');
    const [data, loading, nextPage, prevPage, deletePost, searchValue, installSearchValue, infoPagination] = useFetchPostList(8);
    const resetSearh = () => {
        setSearch('');
        installSearchValue('');
    }

const tableTr = useMemo(() => {
    return data.map(el => <Tr key={el.post_id}>
        <Td>{el.post_id}</Td>
        <Td>{el.post_title}</Td>
        <Td className={style.tdAuthor}><Link target={'_blank'} to={'/user/'+el.author}>{el.name}</Link></Td>
        <Td>{Intl.DateTimeFormat('ru-Ru', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(el.post_date)}</Td>
        <Td>
            <Link target={'_blank'} to={'/post/'+el.post_id}>Посмотреть</Link>
            <Button onClick={() => deletePost(+el.post_id, el.post_title)} colorScheme={'red'}>Удалить</Button>
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

                installSearchValue(search)
                
            }}>
                    <Flex>
                    <Input placeholder='Введите id, название или автора поста' marginRight={'10px'} value={search} onChange={(e) => setSearch(e.target.value)}/>
                    {
                        searchValue ? <Button onClick={resetSearh}>Сбросить</Button> : <Button type='submit'>Найти</Button>
                    }
                    
                    </Flex>
            </form>
            {
                loading ? <Center><Spinner/></Center> :
                <Table>
                <Thead>
                    <Tr>
                        <Th>ID ПОСТА</Th>
                        <Th>Название</Th>
                        <Th>Автор</Th>
                        <Th>Дата публикации</Th>
                        <Th>Действия</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {tableTr?.length > 0 ? tableTr : null}
                </Tbody>
            </Table>
            }
    </div>
    
  )
}
export default PostTableList;