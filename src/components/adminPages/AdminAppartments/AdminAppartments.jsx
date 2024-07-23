import React, { useState, useRef, useEffect } from 'react'
import s from './AdminAppartments.module.sass'
import axios from '../../../axios'
import { useNavigate, useParams } from 'react-router-dom'

function AdminAppartments() {
    const { lot } = useParams()
    const [authorized, setAuthorized] = useState(false)
    const [lotNumber, setLotNumber] = useState('')
    const [appartment, setAppartment] = useState(null)
    const [allAppartments, setAllAppartments] = useState([])

    useEffect(() => {
        let adminData = localStorage.getItem('token')
        if (adminData) {
            setAuthorized(true)
        }

        axios.get('/posts')
            .then(response => response.data)
            .then(data => {
                let appartment = data.find((elem) => elem.lot == lot)
                setAllAppartments(data)
                if (appartment) {
                    setAppartment(appartment)
                    setTitle(appartment.title)
                    setText(appartment.text)
                    setPrice(appartment.price)
                    setRooms(appartment.rooms)
                    setSquare(appartment.square)
                    setQuests(appartment.quests)
                    setFloor(appartment.floor)
                    setImages(appartment.images)
                    setMap(appartment.map)
                    setOptions(appartment.options)
                }
                const maxLot = Math.max(...data.map(appt => parseInt(appt.lot)))
                setLotNumber(convertLot(maxLot + 1))
            })
    }, [lot])

    const convertLot = (lot) => {
        if (lot >= 1000) {
            return `${lot}`
        }
        if (lot >= 100) {
            return `0${lot}`
        }
        if (lot >= 10) {
            return `00${lot}`
        }
        return `000${lot}`
    }

    const [options, setOptions] = useState({
        "Wi-fi": false,
        'Балкон': false,
        "Душ": false,
        "Кондиционер": false,
        "Можно с детьми": false,
        "Парковка": false,
        "Полотенца": false,
        "Посудомоечная машина": false,
        "Стиральная машина": false,
        "Телевизор": false,
        "Утюг": false,
        "Фен": false,
    })

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [price, setPrice] = useState('')
    const [rooms, setRooms] = useState('')
    const [square, setSquare] = useState('')
    const [quests, setQuests] = useState('')
    const [floor, setFloor] = useState('')
    const [images, setImages] = useState([])
    const [map, setMap] = useState('')
    const inputFileRefs = useRef([])
    const [deletedItem, setDeletedItem] = useState('')

    const navigate = useNavigate()

    const handleChangeFile = async (e, index) => {
        try {
            const formData = new FormData();
            const file = e.target.files[0];
            formData.append('image', file);
            
            const { data } = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            const imageUrl = `${process.env.REACT_APP_BASE_URL}${data.url}`;
            console.log(imageUrl);
            
            setImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[index] = imageUrl;
                return newImages;
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleChange = (e, value) => {
        value(e.target.value)
    }
    const createBtn = () => {
        const fields = {
            title,
            text,
            price,
            lot: lotNumber,
            rooms,
            square,
            quests,
            floor,
            images,
            map,
            images,
            options
        }
        axios.post('/posts', fields)
            .then(data => {
                if (data.data) {
                    alert("товар успешно создан")
                }
            })
    }

    const updateBtn = () => {
        const fields = {
            title,
            text,
            price,
            lot,
            rooms,
            square,
            quests,
            floor,
            images,
            map,
            images,
            options
        }
        axios.patch(`/posts/update/${lot}`, fields)
            .then(data => {
                if (data.data) {
                    console.log(data)
                    navigate('/admin/basicAppartments')
                }
            })
            .catch((err) => console.log(err))
    }

    const deleteItem = () => {
        axios.delete(`/posts/${deletedItem}`)
            .then((data) => {
                if (data.data) {
                    alert('товар успешно удалён')
                    const updatedAppartments = allAppartments.filter((app) => app.lot !== deletedItem)
                    setAllAppartments(updatedAppartments)
                    updatedAppartments.forEach((app, index) => {
                        app.lot = convertLot(index + 1)
                        axios.patch(`/posts/update/${app.lot}`, { lot: app.lot })
                    })
                    setLotNumber(convertLot(updatedAppartments.length + 1))
                }
            })
    }

    return (
        <div>
            {authorized && appartment == null && (
                <div className={s.adminPanel}>
                    <div className={s.createItem}>
                        <h1><span>/</span> Лот №{lotNumber}</h1>

                        <div className={s.topSideInputs}>
                            <div className={s.leftSideInputs}>
                                <p>Адрес</p>
                                <input type="text" onChange={(e) => handleChange(e, setTitle)} />
                                <p>Стоимость (от)</p>
                                <input type="text" onChange={(e) => handleChange(e, setPrice)} />
                                <p>Комнат (в цифрах)</p>
                                <input type="text" onChange={(e) => handleChange(e, setRooms)} />
                                <p>Площадь (м²)</p>
                                <input type="text" onChange={(e) => handleChange(e, setSquare)} />
                                <p>Количество гостей (в цифрах)</p>
                                <input type="text" onChange={(e) => handleChange(e, setQuests)} />
                                <p>Этаж: (пример: 5/11)</p>
                                <input type="text" onChange={(e) => handleChange(e, setFloor)} />
                            </div>

                            <div className={s.rightSideInputs}>
                                <p>Описание</p>
                                <textarea className={s.textarea} type="text" onChange={(e) => handleChange(e, setText)} />
                            </div>
                        </div>

                        <p className={s.photosText}>Фотографии</p>
                        <div className={s.photos}>
                            {[...Array(12)].map((_, index) => (
                                <div key={index} onClick={() => inputFileRefs.current[index].click()}>
                                    <input
                                        type="file"
                                        onChange={(e) => handleChangeFile(e, index)}
                                        hidden
                                        ref={(el) => (inputFileRefs.current[index] = el)}
                                    />
                                    <button onClick={() => inputFileRefs.current[index].click()}>
                                        {
                                            images[index] ? (
                                                <img
                                                    style={{ width: '170px', height: '108px', objectFit: 'cover', borderRadius: "8px" }}
                                                    src={images[index]}
                                                    alt={`Картинка ${index + 1}`}
                                                />
                                            ) :
                                                <img src="/icons/plus.svg" alt="" />
                                        }
                                    </button>
                                    {
                                        images[index] && (
                                            <p className={s.dltText} onClick={(e) => { e.stopPropagation(); setImages(images.filter((elem) => elem !== images[index])) }}> <img src="/icons/delete.svg" alt="" />удалить</p>
                                        )
                                    }
                                </div>
                            ))}
                        </div>

                        <p style={{ width: "100%" }}>Иконки</p>

                        <div className={s.options}>
                            {
                                Object.keys(options).map((elem) =>
                                    <div className={s.option} key={elem} >
                                        <img src={`/icons/vectors/${elem}.svg`} alt="" />
                                        <input type="checkbox" value={options[elem]} onChange={(e) => setOptions(prev => ({ ...prev, [elem]: e.target.checked }))} />
                                        <p>{elem}</p>
                                        <img src={options[elem] ? '/icons/eye.svg' : '/icons/eye_grey.svg'} alt="" />
                                    </div>
                                )
                            }
                        </div>

                        <div className={s.yandexBlock}>
                            <p style={{ width: "100%" }}>
Код карты</p>
<input className={s.yandex} type="text" onChange={(e) => handleChange(e, setMap)} />
</div>

                    <div className={s.button}>

                        <button className={s.createBtn} onClick={createBtn}>Создать товар</button>
                    </div>
                </div>

                {/* <div className={s.deleteItem}>
                    <h1>Удалить товар</h1>
                    <input type="text" onChange={(e) => { handleChange(e, setDeletedItem) }} placeholder='Лот товара' />
                    <button className={s.deleteBtn} onClick={deleteItem}>Удалить</button>
                </div> */}
            </div>
        )}
        {authorized && appartment && (
            <div className={s.adminPanel}>
                <div className={s.createItem}>
                    <h1><span>/</span> Лот №{appartment.lot}</h1>

                    <div className={s.topSideInputs}>
                        <div className={s.leftSideInputs}>
                            <p>Адрес</p>
                            <input type="text" value={title} onChange={(e) => handleChange(e, setTitle)} />
                            <p>Стоимость (от)</p>
                            <input type="text" value={price} onChange={(e) => handleChange(e, setPrice)} />
                            <p>Комнат (в цифрах)</p>
                            <input type="text" value={rooms} onChange={(e) => handleChange(e, setRooms)} />
                            <p>Площадь (м²)</p>
                            <input type="text" value={square} onChange={(e) => handleChange(e, setSquare)} />
                            <p>Количество гостей (в цифрах)</p>
                            <input type="text" value={quests} onChange={(e) => handleChange(e, setQuests)} />
                            <p>Этаж: (пример: 5/11)</p>
                            <input type="text" value={floor} onChange={(e) => handleChange(e, setFloor)} />
                        </div>

                        <div className={s.rightSideInputs}>
                            <p>Описание</p>
                            <textarea className={s.textarea} value={text} type="text" onChange={(e) => handleChange(e, setText)} />
                        </div>
                    </div>

                    <p className={s.photosText}>Фотографии</p>
                    <div className={s.photos}>
                        {[...Array(12)].map((_, index) => (
                            <div key={index} onClick={() => inputFileRefs.current[index].click()}>
                                <input
                                    type="file"
                                    onChange={(e) => handleChangeFile(e, index)}
                                    hidden
                                    ref={(el) => (inputFileRefs.current[index] = el)}
                                />
                                <button onClick={() => inputFileRefs.current[index].click()}>
                                    {
                                        images[index] ? (
                                            <img
                                                style={{ width: '170px', height: '108px', objectFit: 'cover', borderRadius: "8px" }}
                                                src={images[index]}
                                                alt={`Картинка ${index + 1}`}
                                            />
                                        ) :
                                            <img src="/icons/plus.svg" alt="" />
                                    }
                                </button>
                                {
                                    images[index] && (
                                        <p className={s.dltText} onClick={(e) => { e.stopPropagation(); setImages(images.filter((elem) => elem !== images[index])) }}> <img src="/icons/delete.svg" alt="" />удалить</p>
                                    )
                                }
                            </div>
                        ))}
                    </div>

                    <p style={{ width: "100%" }}>Иконки</p>

                    <div className={s.options}>
                        {
                            Object.keys(options).map((elem) =>
                                <div className={s.option} key={elem} >
                                    <img src={`/icons/vectors/${elem}.svg`} alt="" />
                                    <input type="checkbox" value={options[elem]} onChange={(e) => setOptions(prev => ({ ...prev, [elem]: e.target.checked }))} />
                                    <p>{elem}</p>
                                    <img src={options[elem] ? '/icons/eye.svg' : '/icons/eye_grey.svg'} alt="" />
                                </div>
                            )
                        }
                    </div>

                    <div className={s.yandexBlock}>
                        <p style={{ width: "100%" }}>Код карты</p>
                        <input className={s.yandex} value={map} type="text" onChange={(e) => handleChange(e, setMap)} />
                    </div>

                    <div className={s.button}>

                        <button className={s.createBtn} onClick={updateBtn}>Сохранить</button>
                    </div>
                </div>

                {/* <div className={s.deleteItem}>
                    <h1>Удалить товар</h1>
                    <input type="text" onChange={(e) => { handleChange(e, setDeletedItem) }} placeholder='Лот товара' />
                    <button className={s.deleteBtn} onClick={deleteItem}>Удалить</button>
                </div> */}
            </div>
        )}
    </div>
)
}

export default AdminAppartments