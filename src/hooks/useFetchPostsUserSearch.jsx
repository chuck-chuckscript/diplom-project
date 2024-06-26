import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import ApiBlog from '../api/ApiBlog';

export const useFetchPostsUserSearch = (userId) => {
  
  const toast = useToast();
  const [loading, setLoading] = useState(false);  
  const [data, setData] = useState(null);  
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (
        async function(){

            setLoading(true);
            try{
                const  response = await ApiBlog.getUserPostsWithSearch(userId, search);

               
                
                if(response.status !== 200){
                    if(search){
                       setError('Вы не публиковали пост с таким названием'); 
                    }
                    else{
                        setError('');
                    }
                    throw new Error(response.response.data?.message);
                    
                }
                
                const data = response.data;
                
                setData(data);
            }
            catch(e){
                setData(null);
                if(e.message !== 'Посты отсутствуют' && e.message !== 'Не удалось найти пост (посты)'){
                    toast({
                        status: 'error',
                        description: e.message,
                    })
                }
                
            }

            setLoading(false);
        }
    )()
  }, [userId, search])

  return [data, loading, setData, search , setSearch, error];
}
