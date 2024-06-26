import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import ApiBlog from '../api/ApiBlog';

export const useFetchPost = (postId) => {
  
  const toast = useToast();

  const [loading, setLoading] = useState(false);  
  const [data, setData] = useState(null);  


  useEffect(() => {
    (
        async function(){

            setLoading(true);
            try{
                let response = await ApiBlog.getPostById(postId)

                if(response.status !== 200){
                    
   
                    throw new Error(response.response ? response.response.data?.message : 'Ошибка подключения');
                }
                
                const data = response.data;


                setData(data);
            }
            catch(e){
                setData(null);
                toast({
                    status: 'error',
                    description: e.message,
                })
            }
            setLoading(false);
        }
    )()
  }, [postId])

  return [data, loading];
}
