import React from 'react';
import styles from '@/styles/Forum.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';


const EditForm = ({ formData, handleChange, handleSubmit, handleImageUpload, imagePreview }) => {
    const router = useRouter();

    return (
        <>
            <form
                name="form-a"
                onSubmit={handleSubmit}
                className={styles.forumForm}
            >

                {/* article title */}
                <h4 className={`mt-3 ${styles.forumHeading}`}>Title 標題</h4>
                <div className='form-floating mt-3 mb-3'>
                    <input
                        type="text"
                        name="article_title"
                        id='floatingInput'
                        className='form-control'
                        placeholder="文章標題"
                        value={formData.article_title}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor='floatingInput' className={styles.forumHeading}>文章標題</label>
                </div>

                {/* area & category */}
                <h4 className={`mt-3 ${styles.forumHeading}`}>Forum Type 討論類型</h4>
                <div>
                    <div className='form-floating mb-3'>
                        <select
                            className="form-select"
                            id="floatingSelect"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            aria-label="Floating label select example"
                            required
                        >
                            <option value="">Select Forum Area</option>
                            <option value="Forum Area">Forum Area 討論區</option>
                        </select>
                        <label htmlFor="floatingSelect" className={styles.forumHeading}>Forum Area</label>
                    </div>

                    <div className='form-floating mt-3 mb-3'>
                        <select
                            className="form-select"
                            id="floatingSelect"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            aria-label="Floating label select example"
                        >
                            <option value="">Select Category</option>
                            <option value="Guide">Guide 攻略</option>
                            <option value="Equipment">Equipment 裝備</option>
                            <option value="Map">Map 地圖</option>
                            <option value="Other">Other 其他</option>
                        </select>
                        <label htmlFor="floatingSelect" className={styles.forumHeading}>Forum Category</label>
                    </div>
                </div>

                {/* article */}
                <h4 className={`mt-3 ${styles.forumHeading}`}>Article 文章內容</h4>
                <div className='form-floating'>
                    <textarea
                        name="article"
                        className='form-control'
                        id="floatingTextarea2"
                        placeholder="Text Your Content"
                        value={formData.article}
                        onChange={handleChange}
                        cols="50"
                        style={{ height: "300px" }}
                        required
                    />
                    <label htmlFor='floatingTextarea2' className={styles.forumHeading}>發表新文章</label>
                </div>

                {/* image */}
                <h4 className={`mt-3 ${styles.forumHeading}`}>Upload Picture 圖片上傳</h4>
                <div className='mt-3 mb-3'>
                    <input
                        className="form-control"
                        type="file"
                        name="image"
                        id="formFile"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {imagePreview && (
                        <div className="mt-3">
                            <Image
                                src={imagePreview} alt="預覽"
                                className={styles.imagePreview}
                                // style={{ maxWidth: '100%', maxHeight: '300px' }}
                                width={960}
                                height={400}
                            />
                        </div>
                    )}
                </div>

                {/* figcaption */}
                <h4 className={`mt-3 ${styles.forumHeading}`}>Figcaption 圖說</h4>
                <div className='form-floating'>
                    <textarea
                        name="figcaption"
                        className='form-control'
                        id="floatingTextarea2"
                        placeholder="Text Figcaption"
                        value={formData.figcaption}
                        onChange={handleChange}
                        cols="50"
                        style={{ height: "100px" }}
                    />
                    <label htmlFor='floatingTextarea2' className={styles.forumHeading}>圖說</label>
                </div>

                <div className="row justify-content-center justify-content-md-center">
                    <button
                        type="submit"
                        className='col-3 mt-5 mb-5 btn btn-secondary'
                        style={{ justifyContent: 'center' }}
                    // onClick={() => router.push()}
                    >
                        Submit 送出
                        <div className="button__horizontal"></div>
                        <div className="button__vertical"></div>
                    </button>
                </div>
            </form>

            {/* <AutoCloseModal
                show={showModal}
                onClose={() => setShowModal(false)}
                message={modalMessage}
            /> */}
        </>
    );
};

export default EditForm;