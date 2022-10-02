import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

import type { NextPage } from 'next'
type Post = {
  id: number
  title: string
  content: string
}

const Home: NextPage = ({ posts }: any) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Simple blog protoc</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>List posts</h1>

        <ul>
          {posts.map((post: Post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>
                <a>{post.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
  const req = await fetch('http://localhost:3000/api/posts')
  const response = await req.json()
  const posts = response.data.posts

  return {
    props: {
      posts,
    },
  }
}

export default Home