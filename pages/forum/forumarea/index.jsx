import { useEffect, useState } from 'react'
import styles from "@/styles/Forum.module.css"
import Link from "next/link"
import ForumCarousel2 from "@/components/forum/Forum-Carousel-2"
import ForumTab from "@/components/forum/Forum-Tab"
import Image from 'next/image'
import { useRouter } from "next/router";


export default function ForumArea() {
    const router = useRouter();

    const [articles, setArticles] = useState({
        Guide: [],
        Equipment: [],
        Map: [],
        Other: []
    });

    useEffect(() => {
        document.title = '論壇 | Dragonfire & Sorcery';
    }, []);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await fetch('http://localhost:8080/forum/articles/categorized');
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    // 渲染文章列表的函數
    const renderArticles = (category) => {
        return articles[category].map((article, index) => (
            <div className={`row mt-5 mb-3`} key={article.id}>
                <div className={`col-12 col-sm-6`}>
                    <Image
                        className={styles.contentImg}
                        width={600}
                        height={400}
                        src={article.image} alt={article.article_title} />
                </div>
                <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>{article.article_title}</h5>
                    <p>{article.article.substring(0, 100)}...</p>
                    <button
                        type="button"
                        className="col-3 mt-3 mb-5 btn btn-secondary"
                        onClick={() => router.push(`/forum/forumarea/forum-content/${article.id}`)}
                    >
                        Read All
                        <div class="button__horizontal"></div>
                        <div class="button__vertical"></div>
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <>
            <div className={`container-fluid flex-column ${styles.forumForumArea}`}>
                {/* 置頂輪播 */}
                <ForumCarousel2 />

                <div className={`row d-flex mt-5 mb-5 ${styles.forumRow}`}>
                    {/* popular */}
                    {/* <HotContent /> */}
                    {/* 有餘裕再做 */}

                    {/* forum tab */}
                    <ForumTab />
                </div>
            </div>
        </>
    )
}
