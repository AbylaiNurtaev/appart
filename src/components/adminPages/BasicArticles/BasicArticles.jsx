import  React, { useEffect, useState } from 'react'
import s from './BasicArticles.module.sass'
import axios from '../../../axios'
import { useNavigate } from 'react-router-dom'

function BasicArticles() {
    const[appartments, setAppartments] = useState()
    const navigate = useNavigate()
    useEffect(() => {
      axios.get('/article')
      .then(response => response.data)
      .then(data => setAppartments(data))
    }, [])

    const hideAppartment = (title, hidden) => {
      axios.patch(`/article/${title}`, { hidden })
          .then(response => response.data)
          .then(data => setAppartments(prev => 
              prev.map(elem => 
                  elem.title === data.title ? { ...elem, hidden: data.hidden } : elem
              )
          ))
          .catch(error => {
              console.error("Failed to update visibility:", error);
          });
  };
    const deleteAppartment = (title) => {
      axios.delete(`/article/${title}`)
      .then(data => {
        if(data.data){
          setAppartments(prev => prev.filter(elem => elem.title != title))
        }})
        .catch((err) => console.log(err))
    }
  return (
    <div className={s.container}>
        <div className={s.innerContainer}>
            <div className={s.topSide}>
                <div className={s.title}>
                    <span>/</span> Статьи
                </div>
                <button onClick={() => navigate('/admin/AArticles')}>Добавить</button>
            </div>

            <div className={s.appartmentsSide}>
              { appartments &&
                appartments.map((elem, index) => (
                  <div className={s.appartment} key={index}>
                    <div className={s.title} onClick={() => navigate(`/admin/AArticles/${elem.title}`)}>{elem.title}</div>
                    <div className={s.hide} onClick={() => hideAppartment(elem.title, elem.hidden == "false" || !elem.hidden ? "true" : "false" )}><img src={elem.hidden == "false" || !elem.hidden ? "/icons/eye.svg" : "/icons/eye_grey.svg"} alt="" />{elem.hidden == "false" || !elem.hidden ? "скрыть" : "показать"}</div>
                    <div className={s.delete} onClick={() => deleteAppartment(elem.title)}><img src="/icons/delete.svg" alt="" />удалить</div>
                  </div>
                ))
              }
            </div>
        </div>
    </div>
  )
}

export default BasicArticles