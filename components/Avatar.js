import * as styles from './Avatar.module.css'

export default function Avatar({user}) {
	return (
    <div className={styles.wrapper}>
      <img src={user.picture} className={styles.image} />
    </div>
  );
}
