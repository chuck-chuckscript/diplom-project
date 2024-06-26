import { Button, Center, Flex, Input } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useContext, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Context } from '../..';
import { useFetchSubInfo } from '../../hooks/useFetchSubInfo'
import { UserListItem } from '../elements/userList-item/UserListItem';
import { Footer } from '../layouts/Footer';
import { Header } from '../layouts/Header';
import { Main } from '../layouts/Main';

export const Subs = observer(() => {

  const params = useParams();
  const {store} = useContext(Context);
  const [data, loading, setData, setSearch, search, err] = useFetchSubInfo('getSubs', params.id);

  const [value, setValue] = useState('');

  const userList = useMemo(() => {
      if(+params.id === store.userInfo.id){
        return data ? data.map(el => <UserListItem key={el.user_id} id={el.user_id} name={el.name} avatar={el.user_avatar} onDelete={setData} comeOffId={el.user_id}/>) : null
      }

      return data ? data.map(el => <UserListItem key={el.user_id} id={el.user_id} name={el.name} avatar={el.user_avatar}/>) : null
  }, [data])
  return (
    <div className='page'>
      <Header/>
      <Main>
          <form onSubmit={(e) => {
            e.preventDefault();
            setSearch(value);
          }}>
            <Flex><Input placeholder='Имя пользователя' value={value} onChange={(e) => setValue(e.target.value)} marginRight={'10px'} variant={'filled'}/>
              {
                search ? <Button type='button' onClick={() => {setSearch(''); setValue('');}}>Сбросить поиск</Button> : <Button type='submit' colorScheme={'telegram'}>Найти</Button>
              }
            
            </Flex>
          </form>
          <div style={{marginTop: '20px'}}>
            {userList?.length > 0 ? userList : <>
              {
                err ? <Center>{err}</Center> : <Center>Нет подписок</Center>
              }
            
            </>}
          </div>
        

      </Main>
      <Footer/>
    </div>
  )
})
