"use client";
import styles from "./page.module.css";
import { useFlag } from "@upstash/edge-flags";

export default function Home() {
  const { isLoading, isEnabled, error } = useFlag("is-german");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Edge Flags</a>
        </h1>

        <pre className={styles.code}>{JSON.stringify({ isLoading, error, isEnabled }, null, 2)}</pre>
      </main>
    </div>
  );
}
