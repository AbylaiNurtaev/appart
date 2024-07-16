import React, { useEffect, useState } from 'react';
import s from './QuestionsPage.module.sass';
import axios from '../../../axios';

function QuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        axios.get('/calls')
            .then(response => response.data)
            .then(data => data.filter(elem => elem.question))
            .then(questions => {
                // Добавление фиксированного номера каждому вопросу
                const questionsWithNumbers = questions.map((question, index) => ({
                    ...question,
                    fixedNumber: index + 1
                }));

                const sortedQuestions = questionsWithNumbers.sort((a, b) => {
                    if (a.hidden === "false" && (b.hidden === "true" || b.hidden)) return -1;
                    if (a.hidden === "true" || a.hidden) return 1;
                    return 0;
                });

                setAllQuestions(sortedQuestions);
                setQuestions(sortedQuestions.slice(0, visibleCount));
            })
            .catch(error => {
                console.error("Failed to fetch questions:", error);
            });
    }, []);

    useEffect(() => {
        setQuestions(allQuestions.slice(0, visibleCount));
    }, [visibleCount, allQuestions]);

    const updateQuestions = (updatedQuestions) => {
        setAllQuestions(updatedQuestions);
        setQuestions(updatedQuestions.slice(0, visibleCount));
    };

    const hideCall = (_id, hidden) => {
        axios.patch(`/calls/${_id}`, { hidden })
            .then(response => response.data)
            .then(data => {
                const updatedQuestions = allQuestions.map(elem =>
                    elem._id === data._id ? { ...elem, hidden: data.hidden } : elem
                );
                updateQuestions(updatedQuestions);
            })
            .catch(error => {
                console.error("Failed to update visibility:", error);
            });
    };

    const deleteCall = (_id) => {
        axios.delete(`/calls/${_id}`)
            .then(data => {
                if (data.data) {
                    const updatedQuestions = allQuestions.filter(elem => elem._id !== _id);
                    updateQuestions(updatedQuestions);
                }
            })
            .catch(err => {
                console.error("Failed to delete call:", err);
            });
    };

    const seeMore = () => {
        setVisibleCount(prevCount => prevCount + 3);
    };

    return (
        <div className={s.container}>
            <div className={s.innerContainer}>
                <h2><span>/</span>Вопросы</h2>
                {questions.map((elem) => (
                    <div className={s.question} key={elem._id} style={elem.hidden === "true" ? { filter: 'grayscale(100%)' } : null}>
                        <div className={s.date}>
                            <div className={s.number}>№{elem.fixedNumber}</div>
                            <div className={s.dateText}>{elem.date}</div>
                        </div>

                        <div className={s.info}>
                            {elem.title && <div className={s.title}>{elem.title} <span>(Лот №{elem.lot})</span></div>}
                            <div className={s.phone}>Телефон: {elem.phone}</div>
                            <div className={s.questionText}>{elem.question}</div>
                        </div>

                        <div className={s.hide} onClick={() => hideCall(elem._id, elem.hidden === "false" || !elem.hidden ? "true" : "false")}>
                            <img src={elem.hidden === "false" || !elem.hidden ? "/icons/eye.svg" : "/icons/eye_grey.svg"} alt="" />
                            {elem.hidden === "false" || !elem.hidden ? "новая" : "просмотрено"}
                        </div>
                        <div className={s.delete} onClick={() => deleteCall(elem._id)}>
                            <img src="/icons/delete.svg" alt="" />удалить
                        </div>
                    </div>
                ))}
                {visibleCount < allQuestions.length && (
                    <button className={s.seeMoreBtn} onClick={seeMore}>Показать ещё</button>
                )}
            </div>
        </div>
    );
}

export default QuestionsPage;
