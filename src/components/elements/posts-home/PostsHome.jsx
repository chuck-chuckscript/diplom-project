import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { Button, Center, filter, Flex, Input, Select, Spinner } from '@chakra-ui/react';
import {useFetchPosts} from '../../../hooks/useFetchPosts'

import ApiBlog from '../../../api/ApiBlog';
import PostList from './PostList';
export const PostsHome = () => {
    const trigger = useRef(null)
    const triggerObserver = useRef(null);
    const [filter, setFilter] = useState('0');
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [maxPages, setMaxPages] = useState(0);

    const [fetching, loading] = useFetchPosts(async(userData) => {
        // console.log(data);

    
        let response = await ApiBlog.getPosts(userData);

        // setData([]);
        
        setData(prev => ([...prev,...response.posts]))

        setMaxPages(response.count)
    });
    const [value, setValue] = useState('');


    const reset = useCallback(() => {
        setSearch('')
        setValue('')}, 
    [data])
    
    const memoData = useMemo(() => {
        if(filter){
            // data.filter(el => filter);

            
            if(filter === 'post_title' || filter === 'name'){
                return data.sort((a, b) => a[filter].localeCompare(b[filter]));
            }
            else{

                if(page === maxPages){
                    return data.sort((a, b) => {
                    
                        if(+a[filter] > +b[filter]){
                            
                            return 1
                        }
                        else if(+a[filter] < +b[filter]){
                            return -1;
                        }
                        return 0
                    })
                }
                
            }
            

        }

        return data
    }, [data, filter]);
    useEffect(() => {
        
        

        fetching({
            limit: 8,
            page: page,
            search: search
        });
    }, [page, search])

    
    useEffect(() => {

        

        if(loading) {
            if(localStorage.getItem('scroll')) document.documentElement.scrollTop = localStorage.getItem('scroll');
            return;
        }
        if(triggerObserver.current) triggerObserver.current.disconnect();
        const callback = (entries, observ) => {
            
            if(entries[0].isIntersecting && page < maxPages){
                // console.log(entries[0]);
                const scrollFromTop = document.documentElement.scrollTop;
                localStorage.setItem('scroll', scrollFromTop);

                setPage(page + 1)
               
            }
            
        }

        triggerObserver.current = new IntersectionObserver(callback);
        triggerObserver.current.observe(trigger.current)
        
    }, [loading])
    
    

    return (
        <div>
            <form onSubmit={(e) => {
                    e.preventDefault();
                    setSearch(value)
                    setPage(1);
                    setData([]);
            }}>
            <Flex className='searchX'>
                <Input marginRight={'5px'} value={value} onChange={(e) => setValue(e.target.value)} variant={'filled'} placeholder='Поиск'/>
                <Select value={filter} onChange={(e) => setFilter(e.target.value)} variant={'filled'} w={'200px'} marginRight={'5px'}>
                    <option value={'0'} disabled>Сортировка</option>
                    <option value="post_title">По алфавиту</option>
                    <option value="name">По автору</option>
                    <option value="post_date">*По дате (сначала старые)</option>
                </Select>
                {
                    search 
                    ? <Button type='button' onClick={reset} wordBreak={'break-all'}>Сбросить</Button> 
                    :
                    
                    <Button type='submit' colorScheme={'telegram'}>Найти</Button>
                }

            </Flex>


            </form>
            <PostList list={memoData} mode={{
                grid: true
            }}/>
            {loading ? <Center><Spinner size={'lg'}/></Center> : null}
            <div style={{height: 30, opacity: 0}} ref={trigger}></div>
            
            
        </div>
  )
}
