import React, { useState } from 'react'
import s from './AboutUsPage.module.sass'
import QuestionBlock from '../../components/QuestionBlock/QuestionBlock'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet';
import axios from '../../axios'

function AboutUsPage() {
    const navigate = useNavigate()

    const [popUp, setPopUp] = useState(false)
    const [isOrder, setIsOrder] = useState(false)
    
    const[phone, setPhone] = useState('')
    const[question, setQuestion] = useState('')
  
    const[error, setError] = useState(false)
  
    const formatDate = (timestamp) => {
      if (!timestamp) {
          console.error('Invalid timestamp:', timestamp);
          return '';
      }
  
      const date = new Date(timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы идут от 0 до 11
      const year = String(date.getFullYear()).slice(2); // Берем последние 2 цифры года
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
  
      console.log(`${day}.${month}.${year} ${hours}:${minutes}`);
      return `${day}.${month}.${year} ${hours}:${minutes}`;
  };
  const handleChangePhone = (e) => {
    setPhone(e.target.value)
  }
  const handleChangeQuestion = (e) => {
    setQuestion(e.target.value)
  }
  
  const fetchQuestion = () => {
    let date = formatDate(Date.now())
    console.log('Sending data:', { phone, question, date });
    if(phone.length >= 5){
        axios.post('/calls', {
            phone,
            question,
            date
        })
        .then(response => response.data)
        .then(data => {
            if(data){
                console.log('success');
                setIsOrder(true);
            }
        })
        .catch(error => {
            console.error('Error fetching question:', error);
        });
    } else {
        setError(true);
    }
  };
  return (
    <div className={s.container}>
              {
        popUp && !isOrder &&
        <div className={s.pop_up}>
          <img onClick={() => setPopUp(prev => !prev)} src="/icons/closeIcon.jpg" alt="closeIcon" className={s.closeIcon} />
          <div className={s.title}>Задать вопрос</div>
          <input type="text" placeholder='Тел: ' className={s.block} id='phone' onChange={(e) => handleChangePhone(e)} style={{ paddingLeft: '30px', width: '240px', fontWeight: "bolder" }} />
          <textarea type="text" placeholder='Вопрос: ' className={s.question} id='question' onChange={(e) => handleChangeQuestion(e)} style={{ paddingLeft: '30px', width: '240px', fontWeight: "bolder" }} />
          {
            error &&
            <p style={{ color: 'red' }}>Введите номер телефона</p>
          }
          <button className={s.findBtn} onClick={fetchQuestion}>Отправить вопрос</button>
        </div>
      }
      {
        popUp &&
        <div className={s.overlay}></div>
      }
      {
        popUp && isOrder &&
        <div className={s.pop_up}>
          <img onClick={() => setPopUp(prev => !prev)} src="/icons/closeIcon.jpg" alt="closeIcon" className={s.closeIcon} />
          <div className={s.title}>Задать впорос</div>
          <img className={s.successIcon} src="https://icons.veryicon.com/png/o/miscellaneous/cloud-call-center/success-24.png" alt="" />
          <p className={s.par}>Ваша заявка отправлена, <br />мы свяжемся с вами<br /> в ближайшее время!</p>
          <button className={s.closeBtn} onClick={() => setPopUp(prev => !prev)} >Закрыть окно</button>
        </div>
      }
        <Helmet>
            <title>Агентство недвижимости Gelapart в городе Геленджик</title>
            <meta name="description" content="Геленджик — популярный курорт на Черноморском побережье с большим выбором пляжей на любой вкус. Агентство недвижимости Gelapart поможет подобрать подходящую квартиру по вашим запросам" />
        </Helmet>
        <div className={s.innerContainer}>
            <div className={s.path} onClick={() => navigate('/')} style={{cursor: "pointer"}}>Главная</div>
            <div className={s.title}>
                <p className={s.slash}>/</p>
                <p className={s.titlePath}>О нас</p>
            </div>

            <div className={s.middleSide}>
                <div className={s.block}>
                    <img className={s.image} src="/images/01.jpg" alt="" />
                    <div className={s.text}>
                        <p>Агентство недвижимости «Gelapart»  предлагает широкий выбор комфортабельных квартир в Геленджике для посуточной аренды. Наши квартиры расположены в удобных местах города, рядом с пляжами.</p>
                        <button onClick={() => {navigate('/appartments')}}>Выбрать квартиру</button>
                    </div>
                </div>
                <div className={s.block}>
                    <div className={s.text}>
                        <p>Мы предлагаем уютные и стильные интерьеры, а также высокий уровень сервиса и гостеприимства. Наши квартиры идеально подходят для семейного отдыха и деловых поездок в любое время года.</p>
                        <button onClick={() => setPopUp(prev => !prev)}>Написать нам</button>
                    </div>
                    <img className={s.image} src="/images/02.jpg" alt="" />
                </div>
                <div className={s.block}>
                    <img className={s.image} src="/images/03.jpg" alt="" />
                    <div className={s.text}>
                        <p>Геленджик — популярный курорт на Черноморском побережье с большим выбором пляжей на любой вкус. В городе развитая инфраструктура с отелями, домами отдыха, парками развлечений, ресторанами и достопримечательностями. </p>
                        <button onClick={() => {navigate('/articles')}}>Узнать больше</button>
                    </div>
                </div>
            </div>

            <QuestionBlock></QuestionBlock>
        </div>
    </div>
  )
}

export default AboutUsPage