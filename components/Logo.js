import cx from 'classnames'
import noBgLogo from '../public/LOGO-v1.png'
import bgLogo from '../public/LOGO-v1-bg.png'
import * as styles from './Logo.module.css'

export default function Logo({size = 'normal', type = 'no-background'}) {
	const image = type === 'no-background' ? noBgLogo : bgLogo;
	return <img src={image.src} className={cx(styles.logo, styles[`size${size}`])} />;
}
