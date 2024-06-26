
import React from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../layouts/Footer'
import { Header } from '../layouts/Header'
import { Main } from '../layouts/Main'

export function NotFound(){
  return (
    <div className='page'>
        <Header/>
        <Main className={'notFound'}>
            <div>
                <h1 className='big'>404</h1>
                <span>
                    Из тупика один выход — иди туда, откуда пришёл.
                </span>
                <Link to={'/'}>На главную</Link>
            </div>
            
        </Main>
        <Footer/>
    </div>
  )
}
