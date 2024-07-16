import React, { useEffect, useState } from 'react'
import s from './ContactsPage.module.sass'
import QuestionBlock from '../../components/QuestionBlock/QuestionBlock'
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'



function ContactsPage() {
  const [widthForMap, setWidthForMap] = useState()
  useEffect(() => {
      console.log(window.innerWidth)
      if(window.innerWidth <= 1250){
          setWidthForMap('800px')
      }
      if(window.innerWidth <= 850){
          setWidthForMap('350px')
      }else{
          setWidthForMap('1200px')

      }
  }, [window.innerWidth]) 

  const navigate = useNavigate()



  return (
    <div className={s.container}>

        <Helmet>
          <title>Контакты — агентство недвижимости Gelapart</title>
          <meta name="description" content="Адрес и телефон агентства недвижимости Gelapart в городе Геленджик" />
        </Helmet>
      <div className={s.innerContainer}>
        <div className={s.path} onClick={() => navigate('/')} style={{cursor: "pointer"}}>Главная</div>
        <div className={s.title}>
          <p className={s.slash}>/</p>
          <p className={s.titlePath}>Контакты</p>
        </div>
        <QuestionBlock></QuestionBlock>
        <div className={s.title}>
          <p className={s.slash}>/</p>
          <p className={s.titlePath}>Мы на карте</p>
        </div>
        <div className={s.map}>
          <YMaps>
            <div className={s.mainMap}>
              <Map defaultState={{ center: [44.547145, 38.076944], zoom: 17 }} width={widthForMap} height={'360px'} >
              <Placemark geometry={[44.547145, 38.076944]} />
              </Map>
            </div>
          </YMaps>
        </div>
      </div>
    </div>
  )
}

export default ContactsPage