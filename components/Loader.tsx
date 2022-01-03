import cx from 'classnames'
import * as styles from './Loader.module.css'

export default function Loader({size = 'normal'}: {size?: 'normal' | 'small'}) {
  return (
    <div className={cx(styles['sk-chase'], styles[size])}>
      <div className={cx(styles['sk-chase-dot'])}></div>
      <div className={cx(styles['sk-chase-dot'])}></div>
      <div className={cx(styles['sk-chase-dot'])}></div>
      <div className={cx(styles['sk-chase-dot'])}></div>
      <div className={cx(styles['sk-chase-dot'])}></div>
      <div className={cx(styles['sk-chase-dot'])}></div>
    </div>
  );
}

export function FullscreenLoader() {
  return <div style={{width: '100vw', height: '100vh', display: 'flex', 'alignItems': 'center', justifyContent: 'center'}}>
    <Loader />
  </div>
}
