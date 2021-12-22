import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to pcloud</h1>
        <ul>
          <li>
            <a href="/api/hello" target="_blank">
              example of NodeJS API (data fetched from redis)
            </a>{" "}
            (
            <a
              href="https://github.com/wanghaoPolar/pcloud-fe/blob/main/pages/api/hello.js"
              target="_blank"
            >
              source
            </a>
            )
          </li>
          <li>
            <a href="/api/data" target="_blank">
              example of Go API
            </a>{" "}
            (
            <a
              href="https://github.com/wanghaoPolar/pcloud-fe/blob/main/api/date.go"
              target="_blank"
            >
              source
            </a>
            )
          </li>
        </ul>
      </main>
    </div>
  );
}
