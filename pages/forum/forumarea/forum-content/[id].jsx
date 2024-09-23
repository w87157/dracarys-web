import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "@/styles/Forum.module.css";
import ContentTop from "@/components/forum/Content-Top";
import Image from "next/image";
import Link from "next/link";
import ForumMore from '@/components/forum/Forum-More'

export default function ForumContent() {
  const [formData, setFormData] = useState({
    article_title: '',
    area: '',
    category: '',
    article: '',
    figcaption: ''
  });
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    document.title = '論壇 | Dragonfire & Sorcery';
  }, []);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/forum/articles/${articleId}`);
      if (!response.ok) {
        throw new Error('Error fetch article');
      }
      const data = await response.json();
      setArticle(data);

    } catch (error) {
      console.error('Error fetch article:', error);
      setError('');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>正在加載文章...</p>;
  if (error) return <p>{error}</p>;
  if (!article) return <p>找不到文章</p>;

  return (
    <div className={`container-fluid flex-column ${styles.forumForumArea}`}>
      <div className={`container mb-5 ${styles.forumContainer}`}>
        <div className={`row d-flex mb-5 ${styles.forumRow}`}>

          <div className={`row ${styles.forumRow}`}>
            <div className={`col-12 d-flex gap-2 ${styles.forumEvent}`}>
              <div className={`row mt-5 mb-3`}>

                <h2 className={styles.forumHeading}>{article.article_title}</h2>
                <hr style={{ color: '#bbaf74' }} />

                <ContentTop />

                <article className={`row col-12`}>
                  <p className={`mt-3 mb-3 ${styles.forumArticle}`}>{article.article}</p>
                </article>


                <figure>
                  <Image
                    className={`justify - content - center ${styles.contentImg}`}
                    src={article.image.startsWith('http') ? article.image : `http://localhost:8080${article.image}`}
                    alt={article.article_title}
                    width={850}
                    height={600}

                  />
                  <figcaption className={`mt-3 ${styles.forumFigcaption}`}>{article.figcaption}</figcaption>
                </figure>

                {/* <h3 className={`mt-4 ${styles.forumHeading}`}>More | 相關文章</h3>
                <hr style={{ color: '#bbaf74' }} />

                <ForumMore /> */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}