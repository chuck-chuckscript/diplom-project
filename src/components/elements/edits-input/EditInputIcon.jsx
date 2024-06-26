import React, { useState } from 'react'

import editStyle from './edit.module.scss'
import { Hide, Input } from '@chakra-ui/react'
import { BsXLg, BsCheck2 } from 'react-icons/bs'
import { FaPenToSquare } from "react-icons/fa6";

export const EditInputIcon = ({value, name, placeholder, submitFunc}) => {


  const [isHide, setHide] = useState(true);
  const [deafultValue, setValue] = useState(value);




  
  return (


      <div className={editStyle.editingContainer}>
        <span style={{display: isHide ? 'block': 'none'}} className={editStyle.preview}>{deafultValue}</span>

        <Input textAlign={'center'} variant={'flushed'} autoComplete='on' name={name ? name : ''} onChange={(e) => setValue(e.target.value)} value={deafultValue} display={isHide ? 'none': 'block'}/>
        <div className={editStyle.btns}>
            {isHide ? <>
              <button className={editStyle.edit} onClick={() => setHide(false)}><FaPenToSquare/></button>
            </>: 
            <>
              <button onClick={(e) => {
                return submitFunc ? submitFunc(value) : null
              }}><BsCheck2/></button>
              <button onClick={() => setHide(true)}><BsXLg/></button>
            </>}
        </div>
      </div>
  )
}
