import { useToast } from "@chakra-ui/react"
import { useContext, useState } from "react";
import { Context } from "..";
import ApiBlog from "../api/ApiBlog";

export default function useFetchCode() {
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const {store} = useContext(Context);
  const [usersPasswords, setUserPasswords] = useState({
    newPass: '',
    againPass: ''
  })

  


  const refreshPassword = async (email) => {
    setLoading(true);
    try{
        if(usersPasswords.newPass !== usersPasswords.againPass){
            throw new Error('Пароли не совпадают');
        }

        let response = await ApiBlog.sendCode({
            newPass: usersPasswords.newPass,
            email: email
        });

        if(response.status !== 200){
            throw new Error(response.response.data?.message);
        }
        setUserPasswords({
            newPass: '',
            againPass: ''
        })
        store.set_modalVerifyCode(true);
    }
    catch(err){
        toast({
            description: err.message,
            status: 'error'
        })
    }
    finally{
        setLoading(false);
    }
  }

  

  return {isLoading, refreshPassword, usersPasswords, setUserPasswords};
}
