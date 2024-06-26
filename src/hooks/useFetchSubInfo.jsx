import { useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import ApiBlog from '../api/ApiBlog';

export const useFetchSubInfo = (url, id) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [search, setSearch] = useState('');
    const [err, setErr] = useState('');
   
    useEffect(() => {
        (
            async () => {
                setLoading(true);
                try{
                    let response = await ApiBlog.getSubInfo(url, id, {
                        search: search ? search : ''
                    });
                    
                    if(response.status !== 200){
                        setData(null);
       
                        throw new Error(response.response ? response.response.data?.message : 'Ошибка подключения');
                    }
                    const data = response.data;

                    setData(data);
                }
                catch(e){
                    setData(null);
                    if(e.message !== 'Нет подписок' && e.message !== 'Нет подписчиков'){

                        setErr(e.message);
                        toast({
                            status: 'error',
                            description: e.message,
                        })
                    }
                    

                    
                }
                setLoading(false);
            }
        )()
    }, [url, id, search])


    return [data, loading, setData, setSearch, search , err]
}
