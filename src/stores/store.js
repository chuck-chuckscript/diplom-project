import { makeAutoObservable } from "mobx";
import { decodeToken } from "react-jwt";

import ApiBlog from "../api/ApiBlog";
import { imageSrc } from "../components/constatns/ImageHost";

export class Store{

    isAuth = false
    banId = 0
    userInfo = {
        id: 0,
        name: '',
        email: '',
        root: '',
        avatar: '',
        countSubs: 0,
        countSubscribers: 0,
        countPosts: 0
    }
    modalVerifyCode = false
    modalAuth = {
        active: false,
        activeIndex: 0
    }

    constructor(){
        makeAutoObservable(this);
    }


    set_modalVerifyCode(state){
        this.modalVerifyCode = state;
    }
    setUserInfo = (data) => {
        this.userInfo = {
            id: +data.user_id,
            name: data.user_name,
            email: data.user_email,
            root: data.user_root,
            avatar: data.user_avatar ? imageSrc + '/usersImages/avatars/' + data.user_avatar : '',
            countSubs: +data.user_subs_count,
            countSubscribers: +data.user_subscribers_count,
            countPosts: +data.user_posts_count
        }
    }

    getBanId(){
        return this.banId
    }
    setBanId(id){
        this.banId = id
    }

    setImage = (image) => {
        this.userInfo.avatar = image
    }
    getImage = () => this.userInfo.avatar

    setEmail = (email) => {
        this.userInfo.email = email
    }

    setName = (name) => {
        this.userInfo.name = name
    }

    setAuth = (state) => {
        this.isAuth = state;
    }
    getAuth(){
        return this.isAuth;
    }
    getRoot(){
        return this.userInfo.root
    }
    setCountSubs_inc = () => {
        this.userInfo.countSubs += 1;
    }
    setCountSubs_dec = () => {
        this.userInfo.countSubs -= 1;
    }

    setCountPosts_inc = () => {
        this.userInfo.countPosts += 1;
    }
    setCountPosts_dec = () => {
        this.userInfo.countPosts -= 1;
    }

    async checkAuth(){
        try{
            let response = await ApiBlog.checkIsAuth();

            if(response.status !== 200){
                let {message} = await response.response.data

                throw new Error(message);
            } 
            let resetingData = response.data;
  
            localStorage.setItem('access_token', resetingData.access_token);
            localStorage.setItem('refresh_token', resetingData.refresh_token);
            
            const {data} = decodeToken(resetingData.refresh_token); 
            // console.log(resetingData);
            this.setUserInfo({
                user_id: data.user_id,
                user_name: resetingData.user_name,
                user_email: resetingData.user_email,
                user_root: data.user_root,
                user_avatar: resetingData.user_avatar,
                user_posts_count: resetingData.user_posts_count,
                user_subs_count: resetingData.user_subs_count,
                user_subscribers_count: resetingData.user_subscribers_count

              });
            
            this.setAuth(true);
            

        }
        catch(e){
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            this.setAuth(false);
            console.log(e);
        }
        


    }
    async logout(){
        try{

            await ApiBlog.logout();
            this.setAuth(false);
            this.setUserInfo({
                id: 0,
                name: '',
                email: '',
                root: '',
                avatar: '',
                countSubs: 0,
                countSubscribers: 0,
                countPosts: 0
            })
        }
        catch(e){
            console.log(e);
        }
    }

    set_modalUser(state, activeIndex){
        this.modalAuth.active = state;
        this.modalAuth.activeIndex = activeIndex ? activeIndex : 0;
    }
    

    

}


