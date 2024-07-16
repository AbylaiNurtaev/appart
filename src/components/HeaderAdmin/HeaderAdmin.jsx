import React, { useEffect, useState } from 'react'
import s from './HeaderAdmin.module.sass'

import { useNavigate } from 'react-router-dom'
import axios from '../../axios'

function HeaderAdmin() {
    const navigate = useNavigate()

    const[authorized, setAuthorized] = useState(false)
    const[questions, setQuestions] = useState()
    const[orders, setOrders] = useState()


    useEffect(() => {
        let adminData = localStorage.getItem('token')
        if(adminData){
            setAuthorized(true)
        }
    }, [])      

    const setBorder = (e) => {
        let element = e.target;
        let parent = element.parentNode;
        let pars = parent.querySelectorAll("p")
        
        for(let i = 0; i < pars.length; i++){
            pars[i].style.border = 'none'
        }

        element.style.border = "1px solid #2c58a4"
    }


    useEffect(() => {
        axios.get('/calls')
        .then(resp => resp.data)
        .then(data => {
            let questions = data.filter((elem) => elem.question && elem.hidden == "false")
            let orders = data.filter((elem) => !elem.question && elem. hidden == "false")
            setQuestions(questions)
            setOrders(orders)
        })
    }, [])

    return (
        <div className={s.header}>
            {
                authorized && <>
                    <div className={s.innerHeader}>
                        <img src="/logo.svg" alt="" />
                        <div className={s.options}>
                            <p onClick={(e) => { navigate('/admin/orders'); setBorder(e) }}  >Заявки <span>{orders ? orders.length : ""}</span></p>
                            <p onClick={(e) => { navigate('/admin/questions'); setBorder(e) }}>Вопросы <span>{questions ? questions.length : ""}</span></p>
                            <p onClick={(e) => { navigate('/admin/basicAppartments'); setBorder(e) }}>Квартиры</p>
                            <p onClick={(e) => { navigate('/admin/basicArticles'); setBorder(e) }}>Статьи</p>
                        </div>
                        <img className={s.exit} src="/icons/exit_admin.svg" onClick={() => {navigate('/'); localStorage.clear()}} alt="" />
                    </div>
                </>
            }
            {
                !authorized && 
                <div className={s.unheader}>
                    <img src="/logo.svg" onClick={() => navigate('/')} alt="" />
                </div>
            }

        </div>
    )
}

export default HeaderAdmin