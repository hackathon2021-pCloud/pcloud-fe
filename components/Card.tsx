import * as style from './Card.module.css'

export default function Card({ children }: { children: React.ReactChild }) {
	return <section className={style.card}>
		{children}
	</section>
}
