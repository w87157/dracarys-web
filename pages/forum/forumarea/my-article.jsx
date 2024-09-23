import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "@/styles/Forum.module.css";
import { FaTrashCan, FaPenToSquare } from "react-icons/fa6";
import Link from "next/link";
import ContentSearch from '@/components/forum/ContentSearch';
import AutoCloseModal from "@/components/AutoCloseModalComponent.js";
import ConfirmModal from '@/components/ConfirmModal';
import animate from '@/styles/animation.module.css'

export default function MyArticle() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [articleIdToDelete, setArticleIdToDelete] = useState(null);
  const [articleToAnimate, setArticleToAnimate] = useState(null);
  const router = useRouter();

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8080/forum/articles');
      if (!response.ok) {
        throw new Error('無法獲取文章列表');
      }
      const data = await response.json();
      // 對文章進行降冪排序
      const sortedArticles = data.result.sort((a, b) => {
        // 首先按 id 降序排序
        if (b.id !== a.id) {
          return b.id - a.id;
        }
        // 如果 id 相同，則按 submit_time 降序排序
        return new Date(b.submit_time) - new Date(a.submit_time);
      });
      setArticles(sortedArticles);
    } catch (error) {
      console.error('獲取文章列表時出錯:', error);
      setError('無法獲取文章列表');
      setModalMessage('無法獲取文章列表，請稍後再試。');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    if (searchData.type === 'article_title') {
      const result = articles.filter((articles) =>
        articles.article_title.includes(searchData.value)
      );
      setArticles(result);
    }
  };

  const handleDelete = (id) => {
    setArticleIdToDelete(id);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setArticleIdToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/forum/articles/${articleIdToDelete}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('刪除文章失敗');
      }
      setArticleToAnimate(articleIdToDelete);
      setTimeout(() => {
        setModalMessage('文章已成功刪除');
        setShowModal(true);
        fetchArticles(); // 重新獲取文章列表
        setArticleToAnimate(null);
      }, 500); // 動畫持續時間
    } catch (error) {
      console.error('刪除文章時出錯:', error);
      setModalMessage('刪除文章失敗，請稍後再試。');
      setShowModal(true);
    } finally {
      closeConfirmModal();
    }
  };

  useEffect(() => {
    document.title = '論壇 | Dragonfire & Sorcery';
  }, []);

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <>
      <div className={`container-fluid flex-column ${styles.forumForumArea}`}>
        <div className={`container mb-3 ${styles.forumContainer}`}>
          <div className={`row mt-5 ${styles.forumRow}`}>
            <div className="col-12">
              <div className="row justify-content-center">
                <div className="col-11 col-md-6">
                  <h2 className={styles.forumHeading}>Articles | 文章列表</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`container ${styles.forumContainer}`}>
          <div className={`row d-flex mt-5 mb-5 ${styles.forumRow}`}>

            <div className="row d-flex justify-content-center">
              <button
                type="button"
                className="col-3 mt-2 mb-5 btn btn-secondary"
                onClick={() => router.push("/forum/forumarea/CreateForumForm")}
              >
                發布新文章
                <div className="button__horizontal"></div>
                <div className="button__vertical"></div>
              </button>
            </div>

            <div className="row d-flex col-lg-7 col-sm-5 mb-5 justify-content-center">
              <ContentSearch onSearch={handleSearch} />
            </div>

            <form className={`col-12 p-0 ${styles.forumForm}`}>
              <table className={`${styles.forumHeading} table`}>
                <colgroup>
                  <col className="col-2" />
                  <col className="col-2" />
                  <col className="col-3" />
                  <col className="col-3" />
                  <col className="col-2" />
                </colgroup>
                <thead className='border-0 '>
                  <tr className='border-bottom'>
                    {/* <th className="text-center fs-large" scope="col"></th> */}
                    <th className="text-center fs-large" scope="col">Category</th>
                    <th className="text-center fs-large col-5" scope="col">Article Title</th>
                    <th className="text-center fs-large col-4" scope="col">Submit Time</th>
                    <th className="text-center fs-large" scope="col">Actions</th>
                    <th className="text-center fs-large" scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article.id}
                      className={articleToAnimate === article.id ? animate["slide-out-elliptic-left-bck"] : null}
                    >
                      {/* <td className="text-center"></td> */}
                      <td className="text-center">{article.category}</td>
                      <td className="text-center col-5">
                        <Link
                          className={`link-primary link-opacity-75-hover ${styles.noUnderline}`}
                          href={`/forum/forumarea/forum-content/${article.id}`}
                        >
                          {article.article_title}
                        </Link>
                      </td>
                      <td className="text-center col-4">
                        {new Date(article.submit_time).toLocaleString()}
                      </td>
                      <td className="d-flex text-center justify-content-center">
                        <Link
                          role="button"
                          className="col-5 btn "
                          href={`/forum/forumarea/EditContent/${article.id}`}>
                          <FaPenToSquare
                            className="link-primary link-opacity-75-hover"
                          />
                        </Link>
                        <button
                          className="col-5 btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(article.id);
                          }}
                        >
                          <FaTrashCan
                            className="link-primary link-opacity-75-hover"
                          />
                        </button>
                      </td>
                      <td className="text-center"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={confirmDelete}
        message="確定要刪除這篇文章嗎？"
      />


      <AutoCloseModal
        show={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
      />
    </>
  )
}