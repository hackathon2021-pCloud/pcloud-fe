import cx from 'classnames'
import * as style from './Card.module.css'

export default function Card({ children, className }: { children: React.ReactChild, className?: string }) {
	return <section className={cx(style.card, className)}>
		{children}
	</section>
}
