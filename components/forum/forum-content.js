import React from "react"
import styles from "@/styles/Forum.module.css"
import ContentTop from "@/components/forum/Content-Top"
import ForumMore from '@/components/forum/Forum-More'
import Image from "next/image";
import Link from "next/link";


export default function ForumContent() {
    return (
        <>
            <div className={`container-fluid flex-column ${styles.forumForumArea}`}>
                <div className={`container mb-5 ${styles.forumContainer}`}>
                    <div className={`row d-flex mb-5 ${styles.forumRow}`}>

                        {/* content */}
                        <div className={`row ${styles.forumRow}`}>
                            <div className={`col-12 d-flex gap-2 ${styles.forumEvent}`}>
                                <div className={`row mt-5 mb-3 justify-content-center`}>
                                    <h2 className={styles.forumHeading}>{article.article_title}</h2>
                                    <hr style={{ color: '#bbaf74' }} />

                                    <ContentTop />

                                    <article className={`row col-12`}>
                                        <p className={`mt-3 mb-3 ${styles.forumArticle}`}>{article.article}</p>
                                    </article>
                                    <figure>
                                        <Image
                                            className={`justify - content - center`}
                                            src={article.image}
                                            alt={article.article_title}
                                            width={850}
                                            height={550}

                                        />
                                        <figcaption className={styles.forumFigcaption}>{article.figcaption}</figcaption>
                                    </figure>


                                    <h3 className={`mt-4 ${styles.forumHeading}`}>More | 相關文章</h3>
                                    <hr style={{ color: '#bbaf74' }} />

                                    <ForumMore />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}