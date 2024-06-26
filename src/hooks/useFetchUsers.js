import { useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react'
import ApiBlog from '../api/ApiBlog';

export default function useFetchUsers(limit) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');
  const toast = useToast();


  const [infoPagination, setPagination] = useState({
    page: 1,
    maxPages: 0
  })


  useEffect(() => {
    (
      async () => {
        try{
          setLoading(true);
          if(search.length > 0){
            setData([]);
          }
          let dataRes = await ApiBlog.getUsersList({
              limit: limit,
              page: infoPagination.page,
              search: search
          });
          setData([...dataRes.users])
          console.log(dataRes.users);
          setPagination({...infoPagination, maxPages: dataRes.count})
        }
        catch(e){
          toast({
            status: 'error',
            description: e.message
          })
        }
        finally{
          setLoading(false);
        }
      }
    )()   
  },[infoPagination.page, search])

  const nextPage = useCallback(() => {
    if(infoPagination.page < infoPagination.maxPages){
        setPagination({...infoPagination, page: infoPagination.page + 1});
    }
  }, [infoPagination.page, infoPagination.maxPages])

  
  const prevPage = useCallback(() => {
    if(infoPagination.page > 1){
      setPagination({...infoPagination, page: infoPagination.page - 1});
    }
  }, [infoPagination.page, infoPagination.maxPages])

  const installSearchValue = useCallback((value) => {
    setPagination({...infoPagination, page: 1});
    setSearch(value);
  }, [search])


  const deleteUser = async (id) => {
    let dataUser = {
      deleteUserId: id,
      access_token: localStorage.getItem('access_token')
    }

    try{
      if(!dataUser.deleteUserId){
        throw new Error('Нету идентификатора для удаления');
      }
      let response = await ApiBlog.deleteUser(dataUser)

      setData([...data.filter(el => +el.user_id !== +id)])
      toast({
        status: 'success',
        description: 'Пользователь удален'
      })
    }
    catch(e){
      toast({
        status: 'error',
        description: e.message
      })
    }
  }

  const unban = async (id) => {
    try{
      let dataUser = {
        user_id: +id,
        access_token: localStorage.getItem('access_token'),
        message: '',
        block_service: 0
      }
      let response = await ApiBlog.setBan(dataUser);

      setData([...data.map(el => {
        if(+el.user_id === +id){
          el.ban_blocked_service = 0
        }
        return el;
      })])
      toast({
        status: 'success',
        description: 'Пользователь разблокирован'
      })
    }
    catch(e){
      toast({
        status: 'error',
        description: e.message
      })
    }
  }


  return [isLoading, data, nextPage, prevPage, installSearchValue, search, infoPagination, deleteUser, unban, setData];
}
