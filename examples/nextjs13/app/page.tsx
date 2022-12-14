"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useFlag } from "@upstash/edge-flags";

export default function Home() {
	const { isLoading, value, error } = useFlag("is-german");

	return (
		<div className={styles.container}>
			<main className={styles.main}>
				<h1 className={styles.title}>
					Welcome to <a href="https://nextjs.org">Edge Flags</a>
				</h1>


				<pre className={styles.code}>{JSON.stringify({ isLoading, error, value }, null, 2)}</pre>

			</main>
		</div>
	);
}
