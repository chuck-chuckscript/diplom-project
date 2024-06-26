

import { Footer } from './components/layouts/Footer';
import { Header } from './components/layouts/Header';
import { Main } from './components/layouts/Main';
// import './styles/App.scss';

import { ProfilePrew } from './components/elements/profile-preview/ProfilePrew';

import { PostsHome } from './components/elements/posts-home/PostsHome';




function App() {



  
  
  console.log('app render');




  return (
    <div className="page">
   
        <Header/>
        <Main>
            {/* <div className='load'></div> */}
            <ProfilePrew/>
            
            
            <PostsHome/>

        </Main>
        <Footer/>
    </div>
  );
}

export default App;
