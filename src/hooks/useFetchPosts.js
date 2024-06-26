import { useToast } from '@chakra-ui/react';
import { useState } from 'react'


export const useFetchPosts = (callback) => {
  
  const toast = useToast();
  const [loading, setLoading] = useState(false);  




  const fetching = async (...args) => {

       
        setLoading(true);
        try{
   
            let response = await callback(...args)

        }
        catch(e){
            
            if(e?.response?.status !== 404){

                toast({
                    status: 'error',
                    description: e.message,
                })
            }
            
        }
        finally{
            setLoading(false);
        }
        
    }
    

    

  return [fetching, loading];
}
