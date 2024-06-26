import {useContext} from 'react'
import profileStyle from './profileprew.module.scss'
import { Avatar } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { observer } from 'mobx-react-lite';
import { Context } from '../../..';


export const ProfilePrew = observer(() => {


  const {store} = useContext(Context);

  return (
    <div className={profileStyle.container}>
        <div className={profileStyle.billboard}>
            {store.userInfo.avatar ? <img className={profileStyle.background} alt={'background card'} src={store.userInfo.avatar}/> : <div className={profileStyle.defaultBackground}></div>}
            
            
        </div>
        <div className={profileStyle.viewProfile}>
            <Avatar name={store.userInfo.name} loading='lazy' src={store.userInfo.avatar ? store.userInfo.avatar : null}></Avatar>
           <div>
                <h1>
                    {store.userInfo.name}
                </h1>
                <Link to={'/options'} className={profileStyle.sub}>Настройки</Link>
           </div>
        </div>
        <div className={profileStyle.counting}>
                <p>
                    <span className={profileStyle.titleSpan}>Подписчиков</span>
                    <Link to={'/subscribers/'+store.userInfo.id}>{Intl.NumberFormat('ru-Ru', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                    }).format(store.userInfo.countSubscribers)}</Link>
                </p>
                <p>
                    <span className={profileStyle.titleSpan}>Подписок</span>
                    <Link to={'/subs/'+store.userInfo.id}>{Intl.NumberFormat('ru-Ru', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                    }).format(store.userInfo.countSubs)}</Link>
                </p>
                <p>
                    <span className={profileStyle.titleSpan}>Постов</span>
                    <Link to={'/myPosts'}>{Intl.NumberFormat('ru-Ru', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                    }).format(store.userInfo.countPosts)}</Link>
                </p>
        </div>
        
    </div>
  )
})
