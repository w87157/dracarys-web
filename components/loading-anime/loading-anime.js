import { useState } from 'react'
import CircleLoader from 'react-spinners/CircleLoader'
import styles from './loading-anime.module.css'

function LoadingAnime({size=30, color=`var(--bs-primary`, className='text-primary'}) {
  const [loading, setLoading] = useState(true)

  return (
    <>
      <div className='container d-flex align-items-center w-50 flex-column h-50 justify-content-center'>
        <CircleLoader
          loading={loading}
          size={size}
          color={color}
        />
        {loading ? 'Loading...' : ''}
        <p style={{ color: `${color}` }} className={`${className} ${styles.anime}`}>載入中...</p>
      </div>
    </>
  )
}

export default LoadingAnime