import * as styles from './Avatar.module.css'
import Image from "next/image";

export default function Avatar({user}) {
	return (
    <div className={styles.wrapper}>
      <Image src={user.picture} className={styles.image} />
    </div>
  );
}
