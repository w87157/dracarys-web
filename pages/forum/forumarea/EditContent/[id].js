import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Forum.module.css';
import EditCreate from '@/components/forum/Edit-Create';

export default function EditContent() {
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
                throw new Error('Error fetching article');
            }
            const data = await response.json();
            setFormData(data);
            if (data.image) {
                setImagePreview(data.image);
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            setError('Failed to fetch article');
        } finally {
            setIsLoading(false);
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
                throw new Error('Failed to update article');
            }

            const updatedArticle = await response.json();
            // alert('Edit Article Success.');
            router.push(`/forum/forumarea/forum-content/${id}`);
        } catch (error) {
            console.error('Update Error:', error);
            setError('Failed to update article');
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

    if (isLoading) return <p>Loading article...</p>;
    if (error) return <p>{error}</p>;
    if (!id) return <p>No article ID provided</p>;

    return (

        <div className={`container-fluid flex-column ${styles.forumForumArea}`}>
            <div className={`container mb-5 ${styles.forumContainer}`}>
                <div className={`row d-flex ${styles.forumRow}`}>
                    <h2 className={`mt-5 ${styles.forumHeading}`}>Edit | 修改文章</h2>
                    <EditCreate
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
}