import React from 'react'

export const Main = ({className, children}) => {
  return (
    <main className={className ? className : ''}>{children}</main>
  )
}
