import React, { useEffect, useState } from 'react'
import s from './FullItemPage.module.sass'
import axios from '../../axios'
import { useNavigate, useParams } from 'react-router-dom'
import Slider from '../../components/slider/Slider'
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import Item from '../../components/Item/Item'
import { Helmet } from 'react-helmet'
import Calendar from 'react-calendar'



function FullItemPage() {

    const { lot } = useParams()
    const [appartment, setAppartment] = useState([])
    const [moreAppartments, setMoreAppatmerns] = useState()
    const [widthForMap, setWidthForMap] = useState('1200px')
    const [coordinate, setCoordinates] = useState([0, 0])

    useEffect(() => {
        console.log(window.innerWidth)
        if (window.innerWidth <= 1250) {
            setWidthForMap('800px')
        }
        if (window.innerWidth <= 850) {
            setWidthForMap('350px')
        } else {
            setWidthForMap('1200px')

        }
    }, [window.innerWidth])

    const cordinateConverter = (data) => {
        let coordinates = data.split(',')
        return [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
    }

    useEffect(() => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        axios.get('/posts')
            .then(res => {
                let moreOption = res.data.filter((elem) => elem.lot != lot && (elem.hidden == "false" || !elem.hidden)).slice(0, 3)
                setMoreAppatmerns(moreOption)
                return res.data
            })
            .then(data => data.find((elem) => elem.lot == lot))
            .then(appartment => {
                setAppartment(appartment)
                if (appartment) {
                    setCoordinates(cordinateConverter(appartment.map))
                }
            })
    }, [lot])

    const [entryCalendar, setEntryCalendar] = useState(false);
    const [entry, setEntry] = useState('');
    const [entryDate, setEntryDate] = useState(new Date());

    const [exitCalendar, setExitCalendar] = useState(false);
    const [exit, setExit] = useState('');
    const [exitDate, setExitDate] = useState(new Date())

    const [isOrder, setIsOrder] = useState(false)
    const [isOrder1, setIsOrder1] = useState(false)
    const [error, setError] = useState(false)
    const [error1, setError1] = useState(false)

    const [question, setQuestion] = useState()

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
        if (phone.length >= 5) {
            axios.post('/calls', {
                phone,
                question,
                date,
                title: appartment.title,
                lot
            })
                .then(response => response.data)
                .then(data => {
                    if (data) {
                        console.log('success');
                        setIsOrder1(true)
                    }
                })
        }
        else {
            setError1(true)
        }
    }


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
        // toggleEntryCalendar(); // закрываем календарь после выбора даты
        toggleEntryCalendar(); // закрываем календарь после выбора даты
    };

    const handleChangeExit = (date) => {
        setExitDate(date)
        updateExitDate(date);
        // toggleExitCalendar(); // закрываем календарь после выбора даты
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

    const sendInfo = () => {
        if (phone.length >= 5) {
            const fields = {
                entry,
                exit,
                quests: peoples,
                phone,
                date: formatDate(Date.now()),
                title: appartment.title,
                lot,
                
            }
            axios.post('/calls', fields)
                .then(response => response.data)
                .then(data => {
                    if (data) {
                        console.log('success')
                    }
                })

            setIsOrder(true)
        } else {
            setError(true)
        }
    }

    const handleChangeQuestion = (e) => {
        setQuestion(e.target.value)
    }

    const [popUp, setPopUp] = useState(false)
    const [popUp1, setPopUp1] = useState(false)

    const navigate = useNavigate()
    return (
        <div className={s.container}>
            {
                popUp1 &&
                <div className={s.overlay}></div>
            }
            {
                popUp1 && !isOrder1 &&
                <div className={s.pop_up} >
                    <img onClick={() => setPopUp1(prev => !prev)} src="/icons/closeIcon.jpg" alt="closeIcon" className={s.closeIcon} />
                    <div className={s.title}>Задать вопрос</div>
                    <input type="text" placeholder='Тел: ' className={s.block} id='phone' onChange={(e) => handleChangePhone(e)} style={{ paddingLeft: '30px', width: '240px', fontWeight: "bolder" }} />
                    <textarea type="text" placeholder='Вопрос: ' className={s.question} id='question' onChange={(e) => handleChangeQuestion(e)} style={{ paddingLeft: '30px', width: '240px', fontWeight: "bolder" }} />
                    {
                        error1 &&
                        <p style={{ color: 'red' }}>Введите номер телефона</p>
                    }
                    <button className={s.findBtn} onClick={fetchQuestion}>Отправить вопрос</button>
                </div>
            }

            {
                popUp1 && isOrder1 &&
                <div className={s.pop_up}>
                    <img onClick={() => setPopUp1(prev => !prev)} src="/icons/closeIcon.jpg" alt="closeIcon" className={s.closeIcon} />
                    <div className={s.title}>Задать впорос</div>
                    <img className={s.successIcon} src="https://icons.veryicon.com/png/o/miscellaneous/cloud-call-center/success-24.png" alt="" />
                    <p className={s.par}>Ваша заявка отправлена, <br />мы свяжемся с вами<br /> в ближайшее время!</p>
                    <button className={s.closeBtn} onClick={() => setPopUp1(prev => !prev)} >Закрыть окно</button>
                </div>
            }
            {
                appartment.title &&
                <Helmet>
                    <title>{appartment.title} — снять квартиру посуточно в Геленджике</title>
                    <meta name="description" content={"Квартира для посуточной аренды по адресу" + appartment.title + "в городе Геленджик. Агентство недвижимости Gelapart"} />
                </Helmet>
            }
            <div className={s.innerContainer}>
            <div className={s.path}>
                        <span onClick={() => navigate('/')}>Главная</span>
                        <span className={s.slash} > / </span>
                        <span onClick={() => navigate('/appartments')}>Квартиры</span>
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
                            <input type="text" placeholder='Тел: ' className={s.block} id='phone' onChange={(e) => handleChangePhone(e)} style={{ paddingLeft: '30px', width: '240px', fontWeight: "bolder" }} />
                            {
                                error &&
                                <p style={{ color: 'red' }}>Введите номер телефона</p>
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
                        <p className={s.par}>Ваша заявка отправлена, <br />мы свяжемся с вами<br /> в ближайшее время!</p>
                        <button className={s.closeBtn} onClick={() => setPopUp(prev => !prev)} >Закрыть окно</button>
                    </div>
                }
                {
                    appartment.lot ?
                        <>
                            <div className={s.infoSide}>
                                <Slider images={appartment.images}></Slider>
                                <div className={s.right}>
                                    <div className={s.title}>Геленджик, <br />{appartment.title}</div>
                                    <div className={s.priceBlock}>
                                        <div className={s.price}>от {appartment.price} руб./сутки</div>
                                        <div className={s.lot}>Лот: {appartment.lot}</div>
                                    </div>
                                    <div className={s.buttons}>
                                        <div className={s.bron} onClick={() => setPopUp(prev => !prev)}>Забронировать <img src="/icons/calendar_black.svg" alt="" /></div>
                                        <div className={s.question} onClick={() => setPopUp1(true)}>Задать вопрос <img src="/icons/question.svg" alt="question" /></div>
                                        <div className={s.whatsappBtn} onClick={() => window.location.href = "https://wa.me/79180411200"} style={{ display: 'none' }}>Чат в Whatsapp <img src="/icons/whatsapp_green (1).svg" alt="question" /></div>
                                    </div>

                                    <div className={s.more}>
                                        <div className={s.block}>
                                            <div><img src="/icons/icon-apart-1.svg" alt="icon" />Комнат: {appartment.rooms}</div>
                                            <div><img src="/icons/icon-apart-2.svg" alt="icon" />Площадь: {appartment.square}</div>
                                        </div>
                                        <div className={s.block}>
                                            <div><img src="/icons/icon-apart-3.svg" alt="icon" />Количество гостей: {appartment.quests}</div>
                                            <div><img src="/icons/icon-apart-4.svg" alt="icon" />Этаж: {appartment.floor}</div>
                                        </div>
                                    </div>

                                    <div className={s.text}>
                                        {appartment.text}
                                    </div>

                                </div>
                            </div>
                            <div className={s.optionSide}>
                                <div className={s.title}>
                                    <p className={s.slash}>/</p>
                                    <p className={s.titlePath}>Всё для комфорта</p>
                                </div>
                                <div className={s.options}>
                                    {
                                        Object.entries(appartment.options)
                                            .filter(([key, value]) => value)
                                            .map(([key, value]) =>
                                                <div className={s.option} key={key}>
                                                    <img src={`/icons/vectors/${key}.svg`} alt={key} />
                                                    <p>{key}</p>
                                                </div>
                                            )
                                    }
                                </div>
                            </div>

                            <div className={s.map}>
                                <div className={s.title}>
                                    <p className={s.slash}>/</p>
                                    <p className={s.titlePath}>Квартира на карте</p>
                                </div>
                                <YMaps>
                                    <div className={s.mainMap}>
                                        <Map  defaultState={{ center: coordinate, zoom: 17 }} width={widthForMap} height={'360px'}>
                                        <Placemark geometry={coordinate} />
                                        </Map>
                                    </div>
                                </YMaps>
                            </div>
                            {
                                moreAppartments &&
                                <div className={s.moreOptions}>
                                    <div className={s.title}>
                                        <p className={s.slash}>/</p>
                                        <p className={s.titlePath}>Похожие варианты</p>
                                    </div>
                                    <div className={s.appartments}>
                                        {
                                            moreAppartments.map((elem) =>
                                                <Item props={elem} key={elem.title} />
                                            )
                                        }
                                    </div>
                                </div>
                            }
                        </>
                        : <p>null</p>

                }
            </div>
        </div>
    )
}

export default FullItemPage