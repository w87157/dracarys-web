import React from 'react'
import styles from './article.module.scss'


type PropType = {
  options?: ''
}

const Article: React.FC<PropType> = (props) => {

  return (
    <>
      <div className={styles.article}>

      </div>
    </>
  )
}

export default Article
