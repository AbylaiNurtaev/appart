import React, { useEffect, useState } from 'react'
import s from './ArticlesPage.module.sass'
import axios from '../../axios'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function ArticlesPage() {

    useEffect(() => {
        axios.get('/article')
        .then(response => {
            let articles = response.data.filter(elem => elem.hidden == "false" || !elem.hidden)
            setArticles(articles)
    })

    }, [])

    // const articles = [
    //     {
    //         id: 1,
    //         title: "Аренда квартиры в Геленджике: советы и рекомендации",
    //         image: "/images/01.jpg"
    //     },
    //     {
    //         id: 2,
    //         title: "Достопримечательности Геленджика",
    //         image: "/images/03.jpg"
    //     },
    //     {
    //         id: 3,
    //         title: "Все пляжи Геленджика",
    //         image: "/images/01.jpg"
    //     },
    //     {
    //         id: 4,
    //         title: "Список телефонов в Геленджике",
    //         image: "/images/03.jpg"
    //     },
    //     {
    //         id: 5,
    //         title: "Рестораны в Геленджике",
    //         image: "/images/01.jpg"
    //     },
    //     {
    //         id: 6,
    //         title: "Все парки в Геленджике",
    //         image: "/images/03.jpg"
    //     },
    // ]
    const [articles, setArticles] = useState([])
    const navigate = useNavigate()

  return (
    <div className={s.container}>
        <Helmet>
            <title>Статьи</title>
            <meta name="description" content="Информация для туристов и жителей города об отдыхе в Геленджике" />
        </Helmet>
        <div className={s.innerContainer}>
            <div className={s.path} onClick={() => navigate('/')} style={{cursor: "pointer"}}>Главная </div>
                <div className={s.title}>
                    <p className={s.slash}>/</p>
                    <p className={s.titlePath}>Статьи</p>
                </div>
            <div className={s.articles}>
                {
                    articles.length >= 1 && articles.map((item, index) => 
                    <div className={s.article} key={index}>
                        <img src={item.prewieImage} alt="article image" />
                        <p  onClick={() => navigate(`/articles/${item._id}`)}>{item.title}</p>
                    </div>
                    )
                }
            </div>
            </div>

    </div>
  )
}

export default ArticlesPage