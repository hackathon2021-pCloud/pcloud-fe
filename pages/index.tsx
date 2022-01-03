import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import Avatar from "../components/Avatar";
import PCloud from "../components/PCloud";
import Logo from "../components/Logo";
import Loader from "../components/Loader";
import Layout from '../components/Layout';

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [isOpeningAuthPage, setIsOpeningAuthPage] = useState(false);

  useEffect(() => {
    if (error) {
      window.alert(error);
    }
  }, [error]);

  let userElement = null;
  if (user) {
    userElement = <Avatar user={user} />;
  } else if (isLoading || isOpeningAuthPage) {
    userElement = <Loader size="small" />;
  } else {
    userElement = (
      // eslint-disable-next-line
      <a
        onClick={() => {
          setIsOpeningAuthPage(true);
        }}
        href="/api/auth/login"
      >
        Login
      </a>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>pCloud</title>
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <PCloud />
          </h1>
          <div className={styles.youandme}>
            <Logo /> + <div className={styles.userHolder}>{userElement}</div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
