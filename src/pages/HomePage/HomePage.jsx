import React, { useEffect, useState } from 'react';
import s from './HomePage.module.sass';
import Calendar from 'react-calendar';
import './style.css'
import axios from '../../axios'
import Item from '../../components/Item/Item';
import { Helmet } from 'react-helmet';

function HomePage() {
  const [entryCalendar, setEntryCalendar] = useState(false);
  const [entry, setEntry] = useState('');
  const [entryDate, setEntryDate] = useState(new Date());

  const [exitCalendar, setExitCalendar] = useState(false);
  const [exit, setExit] = useState('');
  const [exitDate, setExitDate] = useState(new Date());

  const [appartments, setAppartments] = useState();
  const [allAppartments, setAllAppartments] = useState();

  useEffect(() => {
    updateEntryDate(entryDate);
  }, [entryDate]);

  useEffect(() => {
    updateExitDate(exitDate);
  }, [exitDate]);

  useEffect(() => {
    axios.get('/posts')
      .then(res => {
        let apparts = res.data.filter(elem => elem.hidden == "false" || !elem.hidden);
        setAllAppartments(apparts);
        return apparts.slice(0, 6);
      })
      .then(data => setAppartments(data));
  }, []);

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

  const toggleExitCalendar = (e) => {
    setExitCalendar(prev => !prev);
  };

  const handleChangeEntry = (date) => {
    setEntryDate(date);
    updateEntryDate(date);
    toggleEntryCalendar(); // закрываем календарь после выбора даты
  };

  const handleChangeExit = (date) => {
    setExitDate(date);
    updateExitDate(date);
    setExitCalendar(false); // закрываем календарь после выбора даты
  };

  const [select, setSelect] = useState(false);
  const [peoples, setPeoples] = useState("2 гостей");

  const toggleSelect = () => {
    setSelect(prev => !prev);
  };

  const handleChangePeoples = (peoples) => {
    setPeoples(peoples);
  };

  const onSubmit = () => {
    const numGuests = parseInt(peoples[0]);

    let filteredAppartments = allAppartments.filter((elem) => {
      if (numGuests <= 2) {
        return true; // показываем все квартиры
      } else {
        return elem.quests >= numGuests; // показываем квартиры с достаточным количеством мест
      }
    });

    if (numGuests <= 2) {
      // сортируем квартиры по количеству гостей, где 2 гостя выше
      filteredAppartments.sort((a, b) => {
        if (a.quests === 2 && b.quests !== 2) return -1;
        if (a.quests !== 2 && b.quests === 2) return 1;
        return 0;
      });
    }
    setAppartments(filteredAppartments.slice(0, 6));
    window.scrollBy({ top: 300, behavior: "smooth" });
  };

  return (
    <div className={s.container}>
      <Helmet>
        <title>Gelapart – аренда квартир посуточно в Геленджике</title>
        <meta name="description" content="Агентство недвижимости Gelapart предлагает посуточную аренду комфортабельных квартир в Геленджике. Мы предлагаем уютные и стильные интерьеры, а также высокий уровень сервиса и гостеприимства" />
      </Helmet>
      <div className={s.titleSide}>
        <div className={s.titleText}>Аренда квартир в Геленджике</div>
        <div className={s.filters}>

          <div className={s.calendarBlock}>
            <div className={s.block} onClick={toggleEntryCalendar}>
              <p className={s.text}>Заезд</p>
              <p className={s.data}>{entry}</p>
              <img src="/icons/calendar.svg" alt="" />
            </div>
            {entryCalendar && (
              <Calendar
                onChange={handleChangeEntry}
                value={entryDate}
                className={s.entryCalendar}
              />
            )}
          </div>

          <div className={s.calendarBlock}>
            <div className={s.block} onClick={toggleExitCalendar}>
              <p className={s.text}>Выезд</p>
              <p className={s.data}>{exit}</p>
              <img src="/icons/calendar.svg" alt="" />
            </div>
            {exitCalendar && (
              <Calendar
                onChange={handleChangeExit}
                value={exitDate}
                className={s.exitCalendar}
              />
            )}
          </div>

          <div className={s.selectBlock} onClick={toggleSelect}>
            <p className={s.text}>Гости</p>
            <p className={s.data}>{peoples}</p>
            <img src="/icons/arrow_down.svg" alt="" />

            {select && (
              <div className={s.optionsBlock}>
                <div className={s.option} onClick={() => handleChangePeoples("1 гость")}>1 гость</div>
                <div className={s.option} onClick={() => handleChangePeoples("2 гостя")}>2 гостя</div>
                <div className={s.option} onClick={() => handleChangePeoples("3 гостя")}>3 гостя</div>
                <div className={s.option} onClick={() => handleChangePeoples("4 гостя")}>4 гостя</div>
                <div className={s.option} onClick={() => handleChangePeoples("5 гостей")}>5 гостей</div>
                <div className={s.option} onClick={() => handleChangePeoples("6 гостей")}>6 гостей</div>
              </div>
            )}
          </div>
          <button onClick={onSubmit} className={s.findBtn}>Показать</button>
        </div>
      </div>

      <div className={s.innerContainer}>
        <div className={s.title}>
          <p className={s.slash}>/</p>
          <p className={s.titlePath}>Популярные варианты</p>
        </div>

        <div className={s.appartments}>
          {appartments && appartments.map((elem) => (
            <Item key={elem.title} props={elem}></Item>
          ))}
        </div>

        <div className={s.textSide}>
          <div className={s.title}>
            <p className={s.slash}>/</p>
            <p className={s.titlePath}>Снять квартиру в Геленджике</p>
          </div>
          <p className={s.text}>Геленджик — популярный курорт на Черноморском побережье с большим выбором пляжей на любой вкус. В городе развитая инфраструктура с отелями, домами отдыха, парками развлечений, ресторанами и достопримечательностями. Агентство недвижимости «Gelapart» предлагает широкий выбор комфортабельных квартир в Геленджике для посуточной аренды. Наши квартиры расположены в удобных местах города, рядом с пляжами. Мы предлагаем уютные и стильные интерьеры, а также высокий уровень сервиса и гостеприимства. Наши квартиры идеально подходят для семейного отдыха и деловых поездок в любое время года.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
