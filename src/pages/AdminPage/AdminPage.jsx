import React, { useEffect, useRef, useState } from 'react'
import s from './AdminPage.module.sass'
import axios from '../../axios'
import { useNavigate } from 'react-router-dom'

function AdminPage() {
    const [authorized, setAuthorized] = useState(false)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [errorLogin, setErrorLogin] = useState(false)

    const fetchlogin = () => {
        axios.post('/auth/login', {
            email: login,
            password
        }).then(response => {
            if (response.data) {
                localStorage.setItem('token', response.data.token)
                setAuthorized(true)
                navigate('/admin/basicAppartments')
                window.location.reload();
            } else {
                setErrorLogin(true)
            }
        }).catch(error => {
            setErrorLogin(true)
        })
    }

    const handleChangeLogin = (e) => {
        setLogin(e.target.value)
    }
    const handleChangePass = (e) => {
        setPassword(e.target.value)
    }

    const navigate = useNavigate()


    




    useEffect(() => {
        let adminData = localStorage.getItem('token')
        
        if(adminData){
            setAuthorized(true)
            navigate('/admin/basicAppartments')
        }
    }, [])    


    return (
        <div className={s.container}>
            
            <div className={s.innerContainer}>
                {!authorized && (
                    <div className={s.inputs}>
                        <h2><span>/   </span>   Войти</h2>
                        <input type="text" placeholder='login:' onChange={handleChangeLogin} />
                        <input type="password" placeholder='password:' onChange={handleChangePass} />
                        <button onClick={fetchlogin}>Войти</button>
                        {
                            errorLogin &&
                        <p className={s.errorLogin}>Неверный логин или пароль</p>
                        }
                    </div>
                )}


                


            </div>
        </div>
    )
}

export default AdminPage
