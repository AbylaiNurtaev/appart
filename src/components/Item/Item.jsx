import React, { useEffect, useState } from 'react'
import s from './Item.module.sass'
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios'
function Item({props}) {
  console.log(props)
    const [entryCalendar, setEntryCalendar] = useState(false);
    const [entry, setEntry] = useState('');
    const [entryDate, setEntryDate] = useState(new Date());
  
    const [exitCalendar, setExitCalendar] = useState(false);
    const [exit, setExit] = useState('');
    const [exitDate, setExitDate] = useState(new Date())

    const[isOrder, setIsOrder] = useState(false)
    const[error, setError] = useState(false)
    const navigate = useNavigate()

  useEffect(() => {
    updateEntryDate(entryDate);
  }, [entryDate]);

  useEffect(() => {
    updateExitDate(exitDate);
  }, [exitDate]);

  const updateEntryDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    setEntry(`${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`);
  };

  const updateExitDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    setExit(`${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`);
  };

  const toggleEntryCalendar = () => {
    setEntryCalendar(prev => !prev);
  };
  const toggleExitCalendar = () => {
    setExitCalendar(prev => !prev);
  };

  const handleChangeEntry = (date) => {
    setEntryDate(date);
    updateEntryDate(date);
    toggleEntryCalendar(); // закрываем календарь после выбора даты
    toggleEntryCalendar(); // закрываем календарь после выбора даты
  };

  const handleChangeExit = (date) => {
    setExitDate(date)
    updateExitDate(date);
    toggleExitCalendar(); // закрываем календарь после выбора даты
    toggleExitCalendar();
  }
  const [select, setSelect] = useState(false)
  const [phone, setPhone] = useState(false)
  const [peoples, setPeoples] = useState("2 гостей")

  const toggleSelect = () => {
    setSelect(prev => !prev)
  }

  const handleChangePeoples = (peoples) => {
    setPeoples(peoples)
  }
  
  const handleChangePhone = (e) => {
    setPhone(e.target.value)
  }
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
  const sendInfo = () => {
    if(phone.length >= 5){
      const fields = {
        entry,
        exit,
        quests: peoples,
        phone,
        lot: props.lot,
        date: formatDate(Date.now()),
        title: props.title,

      }
      axios.post('/calls', fields)
      .then(response => response.data)
      .then(data => {
        if(data){
          console.log('success')
        }
      })

      setIsOrder(true)
    }else{
      setError(true)
    }
  }

    const[popUp, setPopUp] = useState(false)
  return (<div className={s.big}>
    <div className={s.container}>
        <img  onClick={() => navigate(`/appartments/${props.lot}`)} style={{cursor: 'pointer'}} src={props.images[0]} alt="" />
        <h5 className={s.title}>{props.title}</h5>
        <p className={s.price}>от {props.price} руб./сутки</p>
        <div className={s.options}>
            <p>Комнат: {props.rooms}</p>
            <p>Количество гостей: {props.quests}</p>
            <p>Площадь: {props.square} м²</p>
            <p>Этаж: {props.floor}</p>
        </div>

        <div className={s.buttons}>
            <button onClick={() => navigate(`/appartments/${props.lot}`)} className={s.detailsBtn}>Подробнее</button>
            <button onClick={() => setPopUp(prev => !prev)} className={s.bookingBtn}>Бронировать</button>
        </div>
        <div className={s.whatsappBtn} style={{display: "none"}}>
          <button onClick={() => window.location.href = "https://wa.me/79180411200"}>Бронировать в WhatsApp <img style={{height: 'auto'}} src="/icons/whatsapp_green (1).svg" alt="question" /></button>
        </div>
    </div>
    {
      popUp &&
    <div className={s.overlay}></div>
    }
        {
          popUp && !isOrder &&
        <div className={s.pop_up}>
            <img onClick={() => setPopUp(prev => !prev)} src="/icons/closeIcon.jpg" alt="closeIcon" className={s.closeIcon} />
            <div className={s.title}>Забронировать</div>
            <div className={s.filters}>
            <div className={s.block} onClick={toggleEntryCalendar}>
            <p className={s.text}>Заезд</p>
            <p className={s.data}>{entry}</p>
            <img src="/icons/calendar.svg" alt="" />
            {entryCalendar && (
              <Calendar
                onChange={handleChangeEntry}
                value={entryDate}
                className={s.entryCalendar}
              />
            )}
          </div>
          
          <div className={s.block} onClick={toggleExitCalendar}>
            <p className={s.text}>Выезд</p>
            <p className={s.data}>{exit}</p>
            <img src="/icons/calendar.svg" alt="" />
            {
              exitCalendar &&
            <Calendar
                onChange={handleChangeExit}
                value={exitDate}
                className={s.exitCalendar}
              />
            }
          </div>

          <div className={s.selectBlock} onClick={toggleSelect}>
            <p className={s.text}>Гости</p>
            <p className={s.data}>{peoples}</p>
            <img src="/icons/arrow_down.svg" alt="" />

            {
              select && 
            <div className={s.optionsBlock}>
              <div className={s.option} onClick={() => handleChangePeoples("1 гость")}>1 гость</div>
              <div className={s.option} onClick={() => handleChangePeoples("2 гостя")}>2 гостя</div>
              <div className={s.option} onClick={() => handleChangePeoples("3 гостя")}>3 гостя</div>
              <div className={s.option} onClick={() => handleChangePeoples("4 гостя")}>4 гостя</div>
              <div className={s.option} onClick={() => handleChangePeoples("5 гостей")}>5 гостей</div>
              <div className={s.option} onClick={() => handleChangePeoples("6 гостей")}>6 гостей</div>
            </div>
            }


          </div>
            <input type="text" placeholder='Тел: ' className={s.block} id='phone' onChange={(e) => handleChangePhone(e)} style={{paddingLeft: '30px', width: '240px', fontWeight: "bolder"}}/>
            {
              error &&
              <p style={{color: 'red'}}>Введите номер телефона</p>
            }
            <button className={s.findBtn} onClick={sendInfo}>Отправить заявку</button>
          </div>
        </div> 
        }

        {
          popUp && isOrder &&
          <div className={s.pop_up}>
            <img onClick={() => setPopUp(prev => !prev)} src="/icons/closeIcon.jpg" alt="closeIcon" className={s.closeIcon} />
            <div className={s.title}>Забронировать</div>
            <img className={s.successIcon} src="https://icons.veryicon.com/png/o/miscellaneous/cloud-call-center/success-24.png" alt="" />
            <p className={s.par}>Ваша заявка отправлена, <br/>мы свяжемся с вами<br/> в ближайшее время!</p>
            <button className={s.closeBtn} onClick={() => setPopUp(prev => !prev)} >Закрыть окно</button>
        </div>
        }
        
  </div>
  )
}

export default Item