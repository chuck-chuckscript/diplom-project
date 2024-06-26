
import { Header } from '../layouts/Header'
import { Main } from '../layouts/Main'
import { EditPost } from './EditPost'

export const EditPage = () => {
  return (
    <div className='page'>
        <Header/>
        <Main>
            <EditPost/>
        </Main>

    </div>
  )
}
