import React from 'react'
import s from './Footer.module.sass';
import { Link, useNavigate } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate()
  return (
    <div className={s.container}>
        <div className={s.innerContainer}>
            <div className={s.logoSide}>
                <img src="/logo.svg" alt="" />
                <p className={s.politicText} onClick={() => navigate('/policy')}>Политика конфидециальности</p>
            </div>

            <div className={s.contacts}>
                <img src="/icons/phone.svg" alt="" />
                <p onClick={() => window.location.href = "tel:+79180411200"}>+7 918 041 12 00</p>
            </div>

            <div className={s.infoSide}>
                <p className={s.bold}>Адрес:</p>
                <p className={s.default}>Геленджик, ул. Грибоедова, 31</p>
                <p className={s.bold}>Телефон:</p>
                <p className={s.default}>+7 918 041 12 00</p>
            </div>

            <div className={s.links}>
                <Link className={s.link} to={'/about-us'}>О нас</Link>
                <Link className={s.link} to={'/appartments'}>Квартиры</Link>
                <Link className={s.link} to={'/articles'}>Статьи</Link>
                <Link className={s.link} to={'/contacts'}>Контакты</Link>
            </div>

            <div className={s.icons}>
            <a href="https://vk.com/gelapart" target="_blank" rel="noopener noreferrer">
                <img src="/icons/vk.svg" alt="vk" />
            </a>
            <a href="https://t.me/gel_apart" target="_blank" rel="noopener noreferrer">
                <img src="/icons/telegram.svg" alt="Telega" />
            </a>
        </div>
        </div>
    </div>
  )
}

export default Footer