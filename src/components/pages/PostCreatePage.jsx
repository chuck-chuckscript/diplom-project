import React from 'react'
import { Header } from '../layouts/Header'
import { Main } from '../layouts/Main'

import { CreatePost } from '../elements/createPost/CreatePost'
export const PostCreatePage = () => {




  return (
    <div className='page'>
        <Header/>
        <Main>
            <CreatePost/>
            
        </Main>
    </div>
  )
}
