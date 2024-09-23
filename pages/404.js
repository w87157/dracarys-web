import styles from '@/styles/404.module.css';

export default function Custom404() {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.bg}> 404 </div>
        <div className={styles.fg}> 404 </div>
        <p className='fs-large m-auto mt-5 text-primary'>Looks like the page you were looking for is no longer here.</p>
      </div>
    </>
  )
}