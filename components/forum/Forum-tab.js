import React, { useState, useEffect } from "react";
import styles from "@/styles/Forum.module.css";
import Link from "next/link";
import Image from 'next/image'
import { useRouter } from "next/router";

export default function ForumTab() {
  const router = useRouter();

  const [articles, setArticles] = useState({
    Guide: [],
    Equipment: [],
    Map: [],
    Other: []
  });

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
      <div className={`row justify-content-center mt-5 mb-3`} key={article.id}>
        <div className={`row col-12 col-sm-6`}>
          <Image
            className={styles.contentImg}
            width={500}
            height={330}
            src={article.image}
            alt={article.article_title} />
        </div>
        <div className={`col-12 col-sm-6`}>
          <h5 className={styles.forumHeading}>{article.article_title}</h5>
          <p>{article.article.substring(0, 100)}......</p>
          <button
            type="button"
            className="col-3 mt-3 mb-5 btn btn-secondary"
            onClick={() => router.push(`/forum/forumarea/forum-content/${article.id}`)}
          >
            Read All
            <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* forum tab */}
      <div className={`row d-flex mt-5 mb-5 ${styles.forumRow}`}>
        <div className={`col-12 col-md-9 mb-1 d-flex flex-column`}>
          <div className={`row`}>
            {/* tabs */}
            <div className={`forum-tabs`}>
              <ul id="myTab" role="tablist" className={`nav nav-tabs`}>
                <li className={`nav-item`} role="presentation">
                  <button
                    className={`nav-link active`}
                    id="Guide-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Guide"
                    type="button"
                    role="tab"
                    aria-controls="Guide"
                    aria-selected="true"
                  >
                    Guide
                  </button>
                </li>
                <li className={`nav-item`} role="presentation">
                  <button
                    className={`nav-link`}
                    id="Equipment-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Equipment"
                    type="button"
                    role="tab"
                    aria-controls="Equipment"
                    aria-selected="false"
                  >
                    Equipment
                  </button>
                </li>
                <li className={`nav-item`} role="presentation">
                  <button
                    className={`nav-link`}
                    id="Map-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Map"
                    type="button"
                    role="tab"
                    aria-controls="Map"
                    aria-selected="false"
                  >
                    Map
                  </button>
                </li>
                <li className={`nav-item`} role="presentation">
                  <button
                    className={`nav-link`}
                    id="Other-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Other"
                    type="button"
                    role="tab"
                    aria-controls="Other"
                    aria-selected="false"
                  >
                    Other
                  </button>
                </li>
              </ul>
            </div>

            {/* tab contents */}
            <div
              className={`col-12 flex-column tab-content ${styles.forumEvent}`}
            >
              <div className={`row tab-pane fade show active`} id="Guide" role="tabpanel" aria-labelledby="Guide-tab">
                {renderArticles('Guide')}
              </div>
              <div className={`row tab-pane fade`} id="Equipment" role="tabpanel" aria-labelledby="Equipment-tab">
                {renderArticles('Equipment')}
              </div>
              <div className={`row tab-pane fade`} id="Map" role="tabpanel" aria-labelledby="Map-tab">
                {renderArticles('Map')}
              </div>
              <div className={`row tab-pane fade`} id="Other" role="tabpanel" aria-labelledby="Other-tab">
                {renderArticles('Other')}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
