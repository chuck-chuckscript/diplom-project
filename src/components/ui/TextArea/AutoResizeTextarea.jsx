import { Textarea } from '@chakra-ui/react'
import ResizeTextarea from 'react-textarea-autosize'

export const AutoResizeTextarea = ({value, onChange, placeholder}) => {
  return (
    <Textarea placeholder={placeholder} minH="100" overflowY={'hidden'} resize={'none'} as={ResizeTextarea}/>
  )
}
