import cx from 'classnames'
import * as styles from './Avatar.module.css'

export default function Avatar({user, shadow, className}) {
  if (!user) {
    return null;
  }
	return (
    <div className={cx(styles.wrapper, className)}>
      <img src={user.picture} className={cx(styles.image, shadow && styles.shadow)} alt={user.name} />
    </div>
  );
}
