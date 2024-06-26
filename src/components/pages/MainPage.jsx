import React from 'react'
import { Intro } from '../elements/intro/Intro'
import { PostsHome } from '../elements/posts-home/PostsHome'
import { Footer } from '../layouts/Footer'
import { Header } from '../layouts/Header'
import { Main } from '../layouts/Main'

export default function MainPage() {
  return (
    <div className='page'>
        <Header/>
        <Main>
            <Intro/>
            <PostsHome/>
        </Main>
        <Footer></Footer>
    </div>
  )
}
