import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import Avatar from "../components/Avatar";
import PCloud from '../components/PCloud';
import Logo from '../components/Logo';
import { useEffect } from 'react';

export default function Home() {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (error) {
      window.alert(error)
    }
  }, [error])

  let userElement = null
  if (user) {
    userElement = <Avatar user={user} />;
  } else if (isLoading) {
    userElement = 'loading...'
  } else {
    userElement = <a href="/api/auth/login">Login</a>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>pCloud</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <PCloud />
        </h1>
        <div className={styles.youandme}>
          {/* eslint-disable-next-line */}
          <Logo /> + {userElement}
        </div>
        {/* <ul>
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
            <Link href="/api/date">
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
          <li>
            <Link href="/api/auth/logout">
              <a>Logout</a>
            </Link>
          </li>
        </ul> */}
      </main>
    </div>
  );
}
