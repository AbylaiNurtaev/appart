import React, { useEffect, useState } from 'react'
import s from './FullArticle.module.sass'
import axios from '../../axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function FullArticle() {
    const { id } = useParams()
    const [item, setItem] = useState()
    const [articles, setArticles] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        axios.get('/article')
            .then(response => {
                let otherArticles = response.data.filter((elem) => elem._id != id && (elem.hidden =="false" || !elem.hidden))
                setArticles(otherArticles)
                return response.data.find(elem => elem._id == id)
            })
            .then(elem => setItem(elem))
    }, [id])
    console.log(item)
    return (
        <div className={s.container}>
            {
                item &&
                <Helmet>
                    <title>{item.seoTitle}</title>
                    <meta name="description" content={item.seoDescription} />
                </Helmet>
            }
            {item &&
                <div className={s.innerContainer}>
                    <div className={s.path}>
                        <span onClick={() => navigate('/')}>Главная</span>
                        <span className={s.slash} > / </span>
                        <span onClick={() => navigate('/articles')}>Статьи</span>
                    </div>
                    <div className={s.title}>
                        <p className={s.slash}>/</p>
                        <h1 className={s.titlePath}>{item.title}</h1>
                    </div>

                    <div className={s.content} dangerouslySetInnerHTML={{ __html: item.code }} />

                    <div className={s.moreArticles}>
                        <button style={{cursor: 'pointer'}} onClick={() => navigate('/appartments')}>Выбрать квартиру в Gelapart</button>
                    </div>

                    <div className={s.title}>
                        <p className={s.slash}>/</p>
                        <p className={s.titlePath}>Другие статьи</p>
                    </div>

                    {
                        articles.length >= 1 && articles.map((item, index) =>
                            <div className={s.article} key={index}>
                                <img src={item.prewieImage} alt="article image" />
                                <p onClick={() => navigate(`/articles/${item._id}`)}>{item.title}</p>
                            </div>
                        )
                    }

                </div>
            }
        </div>
    )
}

export default FullArticle