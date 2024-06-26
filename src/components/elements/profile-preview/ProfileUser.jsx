import React, { memo, useContext} from 'react'
import profileStyle from './profileprew.module.scss'
import { Avatar, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import { imageSrc } from '../../constatns/ImageHost';
import { useCheckSub } from '../../../hooks/useCheckSub';



export const ProfileUser = observer(({id, name, subs, subscribers, posts, avatar, funcIN, funcDE}) => {


  const {store} = useContext(Context);
  const [isSub, subscribe, comeOff] = useCheckSub(id);

  return (
    <div className={profileStyle.container}>
        <div className={profileStyle.billboard}>
            {avatar ? <img className={profileStyle.background} src={imageSrc + '/usersImages/avatars/' + avatar} alt="" /> : <div className={profileStyle.defaultBackground}></div>}
            
        </div>
        <div className={profileStyle.viewProfile}>
            <Avatar name={name} loading='lazy' src={avatar ? imageSrc + '/usersImages/avatars/' + avatar : null}></Avatar>
            
            <div>

            <h1>
                {name}
            </h1>
                {
                    store.getAuth() ? <>
                        {
                            store.userInfo.id === +id ? null : <>
                                {
                                    isSub ? <Button onClick={() => comeOff().then(() => funcDE()).then(() => store.setCountSubs_dec())} className={profileStyle.unsub}>Отписаться</Button> : <Button onClick={() => subscribe().then(() => funcIN()).then(() => store.setCountSubs_inc())} className={profileStyle.sub}>Подписаться</Button>
                                }
                                
                                
                            </>
                        }
                    </> : null
                }
            </div>
           

            
        </div>
        <div className={profileStyle.counting}>
                <p>
                    <span className={profileStyle.titleSpan}>Подписчиков</span>
                    <Link to={'/subscribers/'+id}>{
                    Intl.NumberFormat('ru-Ru', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                    }).format(subscribers)}
                    
                    </Link>
                </p>
                <p>
                    <span className={profileStyle.titleSpan}>Подписок</span>
                    <Link to={'/subs/'+id}>{
                    Intl.NumberFormat('ru-Ru', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                    }).format(subs)}
                    </Link>
                </p>
                <p>
                    <span className={profileStyle.titleSpan}>Постов</span>
                    <span>{
                    Intl.NumberFormat('ru-Ru', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                    }).format(posts)
                    }</span>
                </p>
                
                
            </div>

        
        
    </div>
  )
})
