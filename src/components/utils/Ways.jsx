import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Context } from '../..'
import App from '../../App'
import { EditPage } from '../pages/EditPage'

import MainPage from '../pages/MainPage'
import ModeratePost from '../pages/ModeratePost'
import { MyPosts } from '../pages/MyPosts'
import { NotFound } from '../pages/NotFound'
import { OptionPage } from '../pages/OptionPage'
import Post from '../pages/Post'
import { PostCreatePage } from '../pages/PostCreatePage'
import { Subs } from '../pages/Subs'
import { Subscribers } from '../pages/Subscribers'
import { ViewUser } from '../pages/ViewUser'

export const Ways = observer(() => {
  const {store} = useContext(Context);
  useEffect(() => {
    store.checkAuth();
  }, [])

  return (
    <BrowserRouter basename='/'>
        <Routes>

            {store.getAuth() ? <>
              <Route element={<PostCreatePage/>} path='/createPost'/>
              <Route element={<MyPosts/>} path={"/myPosts"}/>
              <Route element={<OptionPage/>} path='/options'/>
              <Route element={<EditPage/>} path={"/edit/:id"}/>
              <Route element={<ModeratePost/>} path={'/moderate'}/>
              <Route element={<Subs/>} path={'/subs/:id'}/>
              <Route element={<Subscribers/>} path={'/subscribers/:id'}/>
              <Route element={<ViewUser/>} path='/user/:id'/>
              <Route element={<Post/>} path='/post/:id'/>
              <Route element={<App/>} path='/'/>
            </> : 
            <>
            <Route element={<Subs/>} path={'/subs/:id'}/>
            <Route element={<Subscribers/>} path={'/subscribers/:id'}/>
            <Route element={<ViewUser/>} path='/user/:id'/>
            <Route element={<Post/>} path='/post/:id'/>
            <Route element={<MainPage/>} path='/'/>
            
            </>}
            
            <Route element={<NotFound/>} path='*'/>
        </Routes>
    </BrowserRouter>
  )
})
