import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import ApiBlog from '../api/ApiBlog';

export const useFetchDataUser = (userId) => {
  
  const toast = useToast();
  const [loading, setLoading] = useState(false);  
  const [data, setData] = useState(null);  


  useEffect(() => {
    (
        async function(){

            setLoading(true);
            try{
                const  response = await ApiBlog.getUserById(userId);

               
                
                if(response.status !== 200){
                    throw new Error(response.response.data?.message);
                }
                
                const data = response.data;
                console.log(data);
                setData(data);
            }
            catch(e){
                toast({
                    status: 'error',
                    description: e.message,
                })
            }

            setLoading(false);
        }
    )()
  }, [userId])

  return [data, loading, setData];
}
