import { useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react'
import { Exception } from 'sass';
import ApiBlog from '../api/ApiBlog';

export const useCheckSub = (userId) => {
    const toast = useToast();
    const [isSub, setSub] = useState(false);

    const comeOff = useCallback(async () => {
        try{
            let response = await ApiBlog.comeOff(userId);
            if(response.status !== 200){
                throw new Exception(response.response.data?.message);
            }
            setSub(false);
            toast({
                status: 'success',
                description: 'Вы отписались'
            })
        }
        catch(err){
            toast({
                status: 'error',
                description: err.message
            })
        }
    }, [userId])

    const subscribe = useCallback(async () => {
        try{
            let response = await ApiBlog.subscribe(userId);
            if(response.status !== 200){
                throw new Exception(response.response.data?.message);
            }
            setSub(true);
            toast({
                status: 'success',
                description: 'Вы подписались'
            })
        }
        catch(err){
            toast({
                status: 'error',
                description: err.message
            })
        }
    }, [userId])

    useEffect(() => {
        (
            async () => {
                try {
                    let response = await ApiBlog.checkSub(userId);

                    if(response.status !== 200){
                        throw new Error(response.response.data?.message);
                    }
                    console.log(response.data);
                    setSub(response.data);
                } 
                catch (err) {
                    if(err.message !== 'Упс... Вы не авторизованны'){
                        toast({
                            status: 'error',
                            description: err.message
                        })
                    }
                    
                }
            }
        )()
    }, [userId])

    return [isSub, subscribe, comeOff]
}
