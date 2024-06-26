import { Button, Center, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react'
import { useContext } from 'react';
import { BsChevronDown, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Context } from '../../..';
import useFetchUsers from '../../../hooks/useFetchUsers';
import AddModeratorForm from '../../ui/forms/AddModeratorForm';
import BanForm from '../../ui/forms/BanForm';
import style from './tableList.module.scss'
export default function UsersTableList({menu, menuHandler}) {
    const {store} = useContext(Context);
    const [isLoading, data, nextPage, prevPage, installSearchValue, searchValue, infoPagination, deleteFunction, unBanFunc, changeData] = useFetchUsers(8)
    const [search, setSearchValue] = useState(''); 
    const {isOpen, onClose, onOpen} = useDisclosure();
    const tableTr = useMemo(() => {
        return data.map(el => <Tr key={el.user_id}>
            <Td>{el.user_id}</Td>
            <Td className={style.tdAuthor}><Link target={'_blank'} to={'/user/'+el.user_id}>{el.name}</Link></Td>
            <Td>{el.email}</Td>
            <Td>{el.root_name}</Td>
            <Td>
                {/* {el.ba} */}
                

                {el.ban_blocked_service ? 
                    <Button onClick={() => unBanFunc(el.user_id)} colorScheme={'green'}>Разблокировать</Button> 
                    :
                    <Button onClick={() => store.setBanId(+el.user_id)} colorScheme={'red'}>Заблокировать</Button>
                }
                
                <Button onClick={() => deleteFunction(el.user_id)} colorScheme={'red'}>Удалить</Button>
            </Td>
        </Tr>)
        }, [data])
    
      return (
    
        <div className={style.container}>
                <BanForm replaceFieldStatus={changeData}/>
                <AddModeratorForm isOpen={isOpen} onClose={onClose}/>
                <Flex justifyContent={'space-between'} margin={'0 0 10px 0'}>

                    <div>
                    {infoPagination.page > 1 ? <Button onClick={prevPage}><BsChevronLeft/></Button> : null }
                    {infoPagination.page < infoPagination.maxPages ? <Button onClick={nextPage}><BsChevronRight/></Button> : null}
                    </div>

                    <div>
                    <Button onClick={onOpen} colorScheme={'green'} marginRight={'5px'}>Добавить модератора</Button>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<BsChevronDown fontSize={10}/>}>Меню модерации</MenuButton>
                        <MenuList>
                            {menu ? menu.map(el => <MenuItem key={el.id} color={el.active ? 'white' : 'initial'}  background={el.active ? '#5095d6' : 'none'} onClick={() => menuHandler(el.id)}>{el.title}</MenuItem>) : null}
                        </MenuList>
                    </Menu>
                    </div>
                    
                </Flex>
                <form style={{margin: '0 0 10px 0'}} onSubmit={(e) => {
                    e.preventDefault();
    
                    installSearchValue(search)
                    
                }}>
                        <Flex>
                        <Input value={search} placeholder='Введите id, название или автора поста' marginRight={'10px'} onChange={(e) => setSearchValue(e.target.value)}/>
                        {
                            searchValue ? <Button onClick={() => {installSearchValue(''); setSearchValue('')}}>Сбросить</Button> : <Button type='submit'>Найти</Button>
                        }
                        
                        </Flex>
                </form>
                {
                    isLoading ? <Center><Spinner/></Center> :
                    <Table>
                    <Thead>
                        <Tr>
                            <Th>ID пользователя</Th>
                            <Th>Имя</Th>
                            <Th>Почта</Th>
                            <Th>Права доступа</Th>
                            <Th>Действия</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tableTr?.length > 0 ? tableTr : null}
                    </Tbody>
                </Table>
                }
        </div>)
}
