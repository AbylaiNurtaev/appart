import React, { useState } from 'react'
import s from './QuestionBlock.module.sass'
import axios from "../../axios"
function QuestionBlock() {
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


  const handleChangePhone = (e) => {
    setPhone(e.target.value)
  }
  const handleChangeQuestion = (e) => {
    setQuestion(e.target.value)
  }
  return (
    <div className={s.contacts}>
      <div className={s.phone}>
        <img src="/icons/phone.svg" alt="phone" />
        <p className={s.phoneText}>+7 918 041 12 00</p>
        <p className={s.subPhoneText}>(WhatsApp, Telegram)</p>
      </div>

      <div className={s.adress}>
        <img src="/icons/map.svg" alt="" />
        <p className={s.adressText}>Геленджик, ул. Грибоедова, 31</p>
      </div>
      <button onClick={() => setPopUp(true)} className={s.questionBtn}>Задать вопрос <img src="/icons/question.svg" alt="question" /></button>
      {
        popUp &&
        <div className={s.overlay}></div>
      }
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
        popUp && isOrder &&
        <div className={s.pop_up}>
          <img onClick={() => setPopUp(prev => !prev)} src="/icons/closeIcon.jpg" alt="closeIcon" className={s.closeIcon} />
          <div className={s.title}>Задать впорос</div>
          <img className={s.successIcon} src="https://icons.veryicon.com/png/o/miscellaneous/cloud-call-center/success-24.png" alt="" />
          <p className={s.par}>Ваша заявка отправлена, <br />мы свяжемся с вами<br /> в ближайшее время!</p>
          <button className={s.closeBtn} onClick={() => setPopUp(prev => !prev)} >Закрыть окно</button>
        </div>
      }
    </div>
  )
}

export default QuestionBlock