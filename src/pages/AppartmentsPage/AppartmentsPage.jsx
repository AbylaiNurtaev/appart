import React, { useEffect, useState } from 'react';
import s from './AppartmentsPage.module.sass';
import axios from '../../axios';
import Calendar from 'react-calendar';
import Item from '../../components/Item/Item';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

function AppartmentsPage() {
  const [entryCalendar, setEntryCalendar] = useState(false);
  const [entry, setEntry] = useState('');
  const [entryDate, setEntryDate] = useState(new Date());

  const [exitCalendar, setExitCalendar] = useState(false);
  const [exit, setExit] = useState('');
  const [exitDate, setExitDate] = useState(new Date());

  const [appartments, setAppartments] = useState([]);
  const [allAppartments, setAllAppartments] = useState([]);
  const [displayedAppartments, setDisplayedAppartments] = useState([]);
  const [numGuests, setNumGuests] = useState(2);

  useEffect(() => {
    updateEntryDate(entryDate);
  }, [entryDate]);

  useEffect(() => {
    updateExitDate(exitDate);
  }, [exitDate]);

  useEffect(() => {
    window.scrollTo(0, 0)
    axios.get('/posts')
      .then(res => {
        let apparts = res.data.filter(elem => elem.hidden == "false" || !elem.hidden);
        setAllAppartments(apparts);
        setDisplayedAppartments(apparts.slice(0, 6));
      });
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

  const toggleExitCalendar = () => {
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
  const [peoples, setPeoples] = useState("2 гостя");

  const toggleSelect = () => {
    setSelect(prev => !prev);
  };

  const handleChangePeoples = (peoples) => {
    setPeoples(peoples);
    setNumGuests(parseInt(peoples));
  };

  const onSubmit = () => {
    const filteredAppartments = filterAppartments(numGuests);
    setDisplayedAppartments(filteredAppartments.slice(0, 6));
    window.scrollBy({ top: 300, behavior: "smooth" });
  };

  const filterAppartments = (numGuests) => {
    return allAppartments.filter((elem) => {
      if (numGuests <= 2) {
        return true; // показываем все квартиры
      } else {
        return elem.quests >= numGuests; // показываем квартиры с достаточным количеством мест
      }
    }).sort((a, b) => {
      if (numGuests <= 2) {
        // сортируем квартиры по количеству гостей, где 2 гостя выше
        if (a.quests === 2 && b.quests !== 2) return -1;
        if (a.quests !== 2 && b.quests === 2) return 1;
      }
      return 0;
    });
  };

  const seeMore = () => {
    const filteredAppartments = filterAppartments(numGuests);
    setDisplayedAppartments(filteredAppartments);
    let elem = document.querySelector('#seeMore');
    if (elem) {
      elem.style.display = 'none';
    }
  };

  const navigate = useNavigate();
  return (
    <div className={s.container}>
      <Helmet>
        <title>Квартиры с посуточной арендой в Геленджике</title>
        <meta name="description" content="Агентство недвижимости Gelapart предлагает комфортабельные квартиры для посуточной аренды в Геленджике. Наши квартиры идеально подходят для семейного отдыха и деловых поездок в любое время года" />
      </Helmet>
      <div className={s.innerContainer}>
        <div className={s.path} onClick={() => navigate('/')} style={{ cursor: "pointer" }}>Главная</div>
        <div className={s.title}>
          <p className={s.slash}>/</p>
          <p className={s.titlePath}>Квартиры</p>
        </div>

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
            <div className={s.block} onClick={(e) => toggleExitCalendar(e)}>
              <p className={s.text}>Выезд</p>
              <p className={s.data}>{exit}</p>
              <img src="/icons/calendar.svg" alt="" />
            </div>
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
          <button onClick={onSubmit} className={s.findBtn}>Показать</button>
        </div>
        <div className={s.appartments}>
          {displayedAppartments &&
            displayedAppartments.map((elem) => (
              <Item key={elem.title} props={elem}></Item>
            ))
          }
        </div>

        <div className={s.seeMore} id='seeMore'>
          <button onClick={seeMore}>Показать ещё</button>
        </div>
      </div>
    </div>
  );
}

export default AppartmentsPage;
