
import { Center } from '@chakra-ui/react';
import { memo } from 'react';
import PostPreiviewHome from '../post-preview/PostPreiviewHome';



const mode_list = {
    grid: false
}
function PostList({list, mode = mode_list}) {


  return (
    <div className={mode.grid ? 'list-post-grid' : 'list-post'}>
        {list.length > 0 ? list.map(el => <PostPreiviewHome text={el.text} imagePreview={el.post_prev} key={el.post_id} title={el.post_title} id={el.post_id} date={el.post_date} author={
            {
                name: el.name,
                id: el.author
            }
        }></PostPreiviewHome>) : <h2>Не удалось найти пост</h2>}
    </div>
  )
}
export default memo(PostList);