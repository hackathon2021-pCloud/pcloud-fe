import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to pcloud</h1>
        <ul>
          <li>
            <Link href="/api/hello">
              <a target="_blank" rel="noreferrer">
                example of NodeJS API (data fetched from redis)
              </a>
            </Link>{" "}
            (
            <Link href="https://github.com/wanghaoPolar/pcloud-fe/blob/main/pages/api/hello.js">
              <a target="_blank" rel="noreferrer">
                source
              </a>
            </Link>
            )
          </li>
          <li>
            <Link href="/api/data">
              <a target="_blank" rel="noreferrer">
                example of Go API
              </a>
            </Link>{" "}
            (
            <Link href="https://github.com/wanghaoPolar/pcloud-fe/blob/main/api/date.go">
              <a target="_blank" rel="noreferrer">
                source
              </a>
            </Link>
            )
          </li>
        </ul>
      </main>
    </div>
  );
}
