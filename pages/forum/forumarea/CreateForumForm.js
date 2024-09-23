import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EditForm from "@/components/forum/Edit-Form";
import styles from '@/styles/Forum.module.css';
import AutoCloseModal from '@/components/AutoCloseModalComponent';

const CreateForumForm = () => {
  useEffect(() => {
    document.title = '論壇 | Dragonfire & Sorcery';
  }, []);

  const router = useRouter();
  const [formData, setFormData] = useState({
    area: '',
    category: '',
    article_title: '',
    article: '',
    image: '',
    figcaption: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prevState => ({
          ...prevState,
          image: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetch('http://localhost:8080/forum/articles', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setModalMessage(data.message);
      setShowModal(true);

      // 延遲導航,給用戶時間看到成功消息
      setTimeout(() => {
        router.push(`/forum/forumarea/forum-content/${data.forum.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating forum:', error);
      setModalMessage('Error creating forum');
      setShowModal(true);
    }
  };

  return (
    <div className={`container-fluid flex-column ${styles.forumForumArea}`}>
      <div className={`container mb-5 ${styles.forumContainer}`}>
        <div className={`row d-flex ${styles.forumRow}`}>
          <h2 className={`mt-5 ${styles.forumHeading}`}>
            New Article | 發布文章
          </h2>

          <EditForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleImageUpload={handleImageUpload}
            imagePreview={imagePreview}
          />
          <AutoCloseModal
            show={showModal}
            onClose={() => setShowModal(false)}
            message={modalMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateForumForm;