import React, { useState } from 'react'
import s from './Header.module.sass'
import whatsapp from "../../whatsapp.png"
import { Link, useNavigate } from 'react-router-dom'

function Header() {
    const navigate = useNavigate()
    const [isOpenMenu, setIsOpenMenu] = useState(false)

    const toggleBurgerMenu = () => {
        setIsOpenMenu(prev => !prev)
    }
  return (
    <div className={s.container}>
        <div className={s.innerContainer}>
            <img src="/logo.svg"  alt="logo" className={s.logo} onClick={() => navigate('/')} />
            <div className={s.navbar}>
                <Link to={'/about-us'} className={s.link}>О нас</Link>
                <Link to={"/appartments"} className={s.link}>Квартиры</Link>
                <Link className={s.link} to={'/articles'}>Статьи</Link>
                <Link className={s.link} to={'/contacts'}>Контакты</Link>
            </div>

            <div className={s.contacts}>
                <img src="/icons/phone.svg" alt="" />
                <p>+7 918 041 12 00</p>
            </div>

        </div>

        <div className={s.mobileContainer}>
            <div className={s.top}>
                <img src="/logo.svg"  alt="logo" className={s.logo} onClick={() => navigate('/')} />
                <img onClick={toggleBurgerMenu} className={s.burgerMenu} src="/icons/menu_blue.svg" alt="" />
            </div>
            
            <div className={s.contacts}>    
                <img src="/icons/phone.svg" alt="" />
                <p onClick={() => window.location.href = "tel:+79180411200"}>+7 918 041 12 00</p>
            </div>
        </div>

        {
            isOpenMenu &&
            <div className={s.burgerMenuSide}>
                <img onClick={toggleBurgerMenu} className={s.burgerMenu} src="/icons/navbar.png" alt="" />
                <div className={s.links}>
                    <Link className={s.link} to={'/about-us'} onClick={toggleBurgerMenu}>О нас</Link>
                    <Link className={s.link} to={'/appartments'} onClick={toggleBurgerMenu}>Квартиры</Link>
                    <Link className={s.link} to={'/articles'} onClick={toggleBurgerMenu}>Статьи</Link>
                    <Link className={s.link}  to={'/contacts'} onClick={toggleBurgerMenu}>Контакты</Link>
                </div>

                <div className={s.button} onClick={() => window.location.href = "https://wa.me/79180411200"}>
                    <p>Написать в Whatsapp</p>
                    <img src={whatsapp} alt="img" />
                </div>
            </div>
        }
    </div>
  )
}

export default Header