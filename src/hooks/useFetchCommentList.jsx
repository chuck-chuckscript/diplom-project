import { useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react'
import ApiBlog from '../api/ApiBlog';

export default function useFetchCommentList(limit = 5) {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);  
  const [data, setData] = useState([]);  
  // const [page, setPage] = useState(1);
  // const [maxPages, setMaxPages] = useState(0);


  const [infoPagination, setPagination] = useState({
    page: 1,
    maxPages: 0,
  })


  // useEffect(() => {
  //   console.log(hideButton)
  // }, [page])

  /*
  

        ПЕРЕПИСАТЬ ДОБАВЛЕНИЕ ПОСТОВ В ПАПКУ ВРЕМЕННОГО ХРАНЕНИЯ (МОДЕРАЦИЯ)
  
  */
  useEffect(() => {
    (
        async () => {
            setLoading(true);
           try{

              if(search.length > 0){
                setData([]);
              }

              let res = await ApiBlog.getReportsComments({
                limit: limit,
                page: infoPagination.page,
                search: search
              })


              // console.log(res);
              setData([...res.comments])


              setPagination({...infoPagination, maxPages: res.count})

             
              
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

  const deleteComment = async (id) => {
    try{
      
      let res = await ApiBlog.deleteComment(id);

      setData([...data.filter(el => +el.comment_id !== +id)])

      toast({
        description: 'Комментарий удален',
        status: 'success'
      })
    }
    catch(e){
      toast({
        description: e.message,
        status: 'error'
      })
    }
  }
  const rejectComment = async (id) => {
    try{

      let res = await ApiBlog.deleteReportComment(id);
      setData([...data.filter(el => +el.report_id !== +id)])
      toast({
        description: 'Жалоба удалена',
        status: 'success'
      })
    }
    catch(e){
      toast({
        description: e.message,
        status: 'error'
      })
    }
  }

  return [data, loading, nextPage, prevPage, installSearchValue, deleteComment, rejectComment, infoPagination]
}