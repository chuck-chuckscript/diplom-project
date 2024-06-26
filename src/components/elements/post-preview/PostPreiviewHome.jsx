// import React from 'react'
import { BsBookFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { mapLinkDeafultText } from '../../../utils/searchLink';
import { imageSrc } from '../../constatns/ImageHost';
import style from './postpreview.module.scss';


const author_state = {
    name: '',
    id: 0
}
export default function PostPreiviewHome({id, title, text, author = author_state, date, imagePreview}) {


  const navigate = useNavigate();  
  return (
    <div onClick={() => navigate('/post/'+id)} className={style.containerHome}>
        <div className={style.imageDiv}>
          <img loading='lazy' src={imagePreview ? imageSrc + '/posts/' + imagePreview : '/images/пустые посты.jpg'}/>
          <span><BsBookFill/>Прочитать</span>
        </div>
        <h1>{title}</h1>
        <p className={style.text} dangerouslySetInnerHTML={{__html: mapLinkDeafultText(text)}}></p>
        <div className={style.infoPost}>
            <div onClick={(e) => {
                e.stopPropagation();
                navigate('/user/'+author.id);
            }} to={'/user/'+author.id} className={style.homeAuthor}>{author.name}</div>
            <p className={style.homeTime}>{date ? Intl.DateTimeFormat('ru-Ru', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(+date) : null}</p>
        </div>
    </div>
  )
}
