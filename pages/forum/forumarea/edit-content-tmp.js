import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Forum.module.css';
import EditForm from '../../../components/forum/Edit-Form';

const EditContent = () => {
    const [formData, setFormData] = useState({
        article_title: '',
        area: '',
        category: '',
        article: '',
        figcaption: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = router.query;

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
                throw new Error('無法獲取文章');
            }
            const data = await response.json();
            setFormData(data);
            if (data.image) {
                setImagePreview(data.image);
            }
        } catch (error) {
            console.error('獲取文章時出錯:', error);
            setError('無法加載文章。請稍後再試。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setFormData(prevData => ({
                ...prevData,
                image: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            const response = await fetch(`http://localhost:8080/forum/articles/${id}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('無法更新文章');
            }

            alert('文章更新成功！');
            router.push('/my-articles');
        } catch (error) {
            console.error('更新文章時出錯:', error);
            setError('無法更新文章。請稍後再試。');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <p>正在加載文章...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={`container-fluid flex-column ${styles.forumNews}`}>
            <div className={`container mb-5 ${styles.forumContainer}`}>
                <div className={`row d-flex ${styles.forumRow}`}>
                    <h2 className={`mt-5 ${styles.forumHeading}`}>Edit | 修改文章</h2>
                    <EditForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        handleImageUpload={handleImageUpload}
                        imagePreview={imagePreview}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditContent;