import { useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react'
import ApiBlog from '../api/ApiBlog';

export default function useFetchPostList(limit = 5) {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);  
  const [data, setData] = useState([]);  

  const [infoPagination, setPagination] = useState({
    page: 1,
    maxPages: 0
  })

  useEffect(() => {
    (
        async () => {
            setLoading(true);
           try{
              if(search.length > 0){
                setData([]);
                setPagination({page: 1, maxPages: 0})
              }
              let res = await ApiBlog.fetchAllposts({
                limit: limit,
                page: infoPagination.page,
                search: search
              })
              


              
              
              setData([...res.posts])
              setPagination({...infoPagination, maxPages: res.count})
              console.log(res.data);
           }
           catch(e){
                console.log(e);
                if(e.message !== 'Request failed with status code 404'){
                  toast({
                    description: e.message,
                    status: 'error'
                })
                }
                
           } 
           setLoading(false);
        }
    )()
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
  const deletePost = useCallback(async(id, name) => {

    try{
      let res = await ApiBlog.deletePost({
        post_id: id,
        post_parent_dir: name
      })


      setData(prev => ([...prev.filter(el => +el.post_id !== id)]));
      toast({
        description: 'Пост успешно удален',
        status: 'success'
      })
    }
    catch(e){
      toast({
        description: e.message,
        status: 'error'
      })
    }
    
    


  }, [data])
  return [data, loading, nextPage, prevPage, deletePost, search, installSearchValue, infoPagination]
}
