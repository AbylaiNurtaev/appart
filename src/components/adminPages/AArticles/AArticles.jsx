import React, { useState, useRef, useEffect } from 'react'
import s from './AArticles.module.sass'
import axios from '../../../axios'
import { useNavigate, useParams } from 'react-router-dom'

function AArticles() {
    const handleChange = (e, setter) => {
        setter(e.target.value)
    }

    const [article, setArticle] = useState(null)

    const [articlesTitle, setArticlesTitle] = useState('')
    const [articlesText, setArticlesText] = useState('')
    const [seoTitle, setSeoTitle] = useState('')
    const [seoDescription, setSeoDescription] = useState('')
    const [prewieImage, setPrewieImage] = useState('')

    const inputArticleRef = useRef([])
    const { title } = useParams()

    const sendArticle = () => {
        const fields = {
            title: articlesTitle,
            code: articlesText,
            seoTitle,
            seoDescription,
            prewieImage
        }
        axios.post(`/article`, fields)
            .then(data => {
                console.log(data);
                if (data.data) {
                    alert('Успешно создана статья')
                }
            })
    }

    const navigate = useNavigate()

    const updateArticle = () => {
        const fields = {
            title: articlesTitle,
            code: articlesText,
            seoTitle,
            seoDescription,
            prewieImage
        }
        axios.patch(`/article/update/${article.title}`, fields)
            .then(resp => resp.data)
            .then(data => {
                if (data) {
                    navigate('/admin/basicArticles')
                }
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        if (title) {
            axios.get(`/article`)
                .then(resp => resp.data)
                .then(data => data.find((elem) => elem.title === title))
                .then(article => {
                    if (article) {
                        setArticle(article)
                        setArticlesTitle(article.title)
                        setArticlesText(article.code)
                        setSeoTitle(article.seoTitle)
                        setSeoDescription(article.seoDescription)
                        setPrewieImage(article.prewieImage)
                    }
                })
        }
    }, [title])

    const handleChangeFileArticles = async (e) => {
        try {
            const formData = new FormData();
            const file = e.target.files[0];
            formData.append('image', file);
            const { data } = await axios.post('/upload', formData);
            const imageUrl = `https://appartmentsback-production-18a0.up.railway.app${data.url}`;
            setPrewieImage(imageUrl);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={s.container}>
            <div className={s.articles}>
                <div className={s.title}>
                    <p className={s.slash}>/</p>
                    <p className={s.titlePath}>Статьи</p>
                </div>
                {
                    !article ? (
                        <>
                            <p>Заголовок</p>
                            <input type="text" onChange={(e) => handleChange(e, setArticlesTitle)} />
                            <p>Код статьи</p>
                            <textarea type="text" className={s.codeInput} onChange={(e) => handleChange(e, setArticlesText)} />
                            <p>Title</p>
                            <input type="text" onChange={(e) => handleChange(e, setSeoTitle)} />
                            <p>Description</p>
                            <input
                                type="text"
                                className={s.descriptionInput}
                                onChange={(e) => handleChange(e, setSeoDescription)}
                            />
                            <input
                                type="file"
                                className={s.descriptionInput}
                                hidden
                                ref={inputArticleRef}
                                onChange={handleChangeFileArticles}
                            />
                            <button
                                onClick={() => inputArticleRef.current.click()}
                                className={s.inputBtn}
                            >Загрузить Фото</button>
                            {prewieImage && (
                                <img
                                    style={{ width: '100px' }}
                                    src={prewieImage}
                                    alt="Превью"
                                />
                            )}
                            <button onClick={sendArticle} className={s.createBtn}>Опубликовать</button>
                        </>
                    ) : (
                        <>
                            <p>Заголовок</p>
                            <input type="text" value={articlesTitle} onChange={(e) => handleChange(e, setArticlesTitle)} />
                            <p>Код статьи</p>
                            <textarea type="text" value={articlesText} className={s.codeInput} onChange={(e) => handleChange(e, setArticlesText)} />
                            <p>Title</p>
                            <input type="text" value={seoTitle} onChange={(e) => handleChange(e, setSeoTitle)} />
                            <p>Description</p>
                            <input
                                type="text"
                                value={seoDescription}
                                className={s.descriptionInput}
                                onChange={(e) => handleChange(e, setSeoDescription)}
                            />
                            <input
                                type="file"
                                className={s.descriptionInput}
                                hidden
                                ref={inputArticleRef}
                                onChange={handleChangeFileArticles}
                            />
                            <button
                                onClick={() => inputArticleRef.current.click()}
                                className={s.inputBtn}
                            >Загрузить Фото</button>
                            {prewieImage && (
                                <img
                                    style={{ width: '100px' }}
                                    src={prewieImage}
                                    alt="Превью"
                                />
                            )}
                            <button onClick={updateArticle} className={s.createBtn}>Сохранить</button>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default AArticles
