import React from 'react'

function aMessages() {
    const handleChange = (e, value) => {
        value(e.target.value)
    }
    useEffect(() => {
        axios.get('/calls')
        .then(response => response.data)
        .then(data => {
            let questions = data.filter((elem) => !elem.entry)
            let orders = data.filter((elem) => elem.entry)
            setQuestions(questions)
            setOrder(orders)
        })
    }, [])    
    const[order, setOrder] = useState()
    const[questions, setQuestions] = useState()
    

    const deleteOrder = (id) => {
        axios.delete(`/calls/${id}`)
        .then(resp => resp.data)
        .then(data => {
            if(data){
               let filtered = order.filter((elem) => elem._id != id)
               setOrder(filtered)
            }
        })
    }

    const deleteQuestion = (id) => {
        axios.delete(`/calls/${id}`)
        .then(resp => resp.data)
        .then(data => {
            if(data){
               let filtered = questions.filter((elem) => elem._id != id)
               setQuestions(filtered)
            }
        })
    }
  return (
    <div>
            {
        authorized && currentPage == 'messages' && questions && order &&
        <div className={s.messages}>
            <div>

            <div className={s.title}>Вопросы</div>
            {
                questions.map((elem, index) => (
                    <div className={s.question} key={index}>
                        <div>{elem.question}</div>
                        <div>{elem.phone}</div>
                        <button onClick={() => deleteQuestion(elem._id)}><img src="/icons/closeIcon.jpg" alt="" /></button>
                    </div>
                ))
            }
            </div>
            <div>

            <div className={s.title}>Заявки</div>
            {
                order.map((elem, index) => (
                    <div className={s.order} key={index}>
                        <div><p>Заезд: </p>{elem.entry}</div>
                        <div><p>Выезд: </p>{elem.exit}</div>
                        <div><p>Телефон: </p>{elem.phone}</div>
                        <div><p>Кол-во гостей: </p>{elem.quests}</div>
                        <button onClick={() => deleteOrder(elem._id)}><img src="/icons/closeIcon.jpg" alt="" /></button>
                    </div>
                ))
            }
            </div>
            
        </div>
    }
    </div>
  )
}

export default aMessages