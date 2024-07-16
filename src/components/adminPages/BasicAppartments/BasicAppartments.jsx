import React, { useEffect, useState } from 'react'
import s from './basicAppartments.module.sass'
import axios from '../../../axios'
import { useNavigate } from 'react-router-dom'


function BasicAppartments() {
  const[appartments, setAppartments] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/posts')
    .then(response => response.data)
    .then(data => setAppartments(data))
  }, [])


  const hideAppartment = (lot, hidden) => {
    console.log(lot, hidden);
    axios.patch(`/posts/${lot}`, { hidden })
        .then(response => response.data)
        .then(data => setAppartments(prev => 
            prev.map(elem => 
                elem.lot === data.lot ? { ...elem, hidden: data.hidden } : elem
            )
        ))
        .catch(error => {
            console.error("Failed to update visibility:", error);
        });
};
  const deleteAppartment = (lot) => {
    axios.delete(`/posts/${lot}`)
    .then(data => {
      if(data.data){
        setAppartments(prev => prev.filter(elem => elem.lot != lot))
      }})
      .catch((err) => console.log(err))
  }


  return (
    <div className={s.container}>
        <div className={s.innerContainer}>
            <div className={s.topSide}>
                <div className={s.title}>
                    <span>/</span> Квартиры
                </div>
                <button onClick={() => navigate('/admin/Appartments')}>Добавить</button>
            </div>

            <div className={s.appartmentsSide}>
              { appartments &&
                appartments.map((elem, index) => (
                  <div className={s.appartment} key={index}>
                    <div className={s.lot} onClick={() => navigate(`/admin/Appartments/${elem.lot}`)}>Лот №{elem.lot}</div>
                    <div className={s.title} onClick={() => navigate(`/admin/Appartments/${elem.lot}`)}>{elem.title}</div>
                    <div className={s.hide} onClick={() => hideAppartment(elem.lot, elem.hidden == "false" || !elem.hidden ? "true" : "false" )}><img src={elem.hidden == "false" || !elem.hidden ? "/icons/eye.svg" : "/icons/eye_grey.svg"} alt="" />{elem.hidden == "false" || !elem.hidden ? "скрыть" : "показать"}</div>
                    <div className={s.delete} onClick={() => deleteAppartment(elem.lot)}><img src="/icons/delete.svg" alt="" />удалить</div>
                  </div>
                ))
              }
            </div>
        </div>
    </div>
  )
}

export default BasicAppartments