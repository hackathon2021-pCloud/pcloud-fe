import cx from 'classnames'
import * as styles from './Loader.module.css'

export default function Loader({size = 'normal'}) {
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
