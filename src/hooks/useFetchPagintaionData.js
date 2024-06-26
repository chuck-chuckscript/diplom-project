import { useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react'
import ApiBlog from '../api/ApiBlog';

export default function useFetchPaginationData(callback, limit) {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);  
  const [data, setData] = useState([]);  
  // const [page, setPage] = useState(1);
  // const [maxPages, setMaxPages] = useState(0);


  const [infoPagination, setPagination] = useState({
    page: 1,
    maxPages: 5,
  })


  const fetching = async (...args) => {
           try{
            setLoading(true);
              if(search.length > 0){
                setData([]);
              }

              let res = await callback(...args);
              console.log(res);
              setData([...res.posts])
              setPagination({...infoPagination, maxPages: res.count})
           }
           catch(e){
                if(e.message !== 'Request failed with status code 404'){
                  toast({
                    description: e.message,
                    status: 'error'
                })
                }
           }
           finally{
            setLoading(false);
           }
           
  }
  useEffect(() => {
    fetching({
        page: infoPagination.page,
        limit: limit,
        search: search
    })
  }, [infoPagination.page, search])

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

  const resetSearch = (callback) => {
    callback('');
    setSearch('')
  }

  

  return {data, setData, search, installSearchValue, prevPage, nextPage, loading, infoPagination, resetSearch}
}