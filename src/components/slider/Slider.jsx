import React, { useEffect, useState } from 'react';
import s from './Slider.module.sass';




function Slider({images}) {
    const [currentImage, setCurrentImage] = useState(0)

    const changeIndex = (e, index) => {
        e.stopPropagation()
        if (currentImage + index == images.length) {
            setCurrentImage(0)
            
        } else if (currentImage + index < 0) {
            setCurrentImage(images.length - 1)
        }
        else {
            setCurrentImage(prev => prev + index);
        }
    }

    const handleChooseImage = (index) => {
        setCurrentImage(index)
    }

    return (
        <div className={s.container}>
        <meta httpEquiv="Cache-Control" content="max-age=3600"></meta>


        <div className={s.left}>
            <div className={s.prew} style={{cursor: 'pointer'}}>
                <button onClick={(e) => { changeIndex(e, -1) }} className={s.leftButton}><img src="/icons/s-right.svg" alt="" /></button>
                <img src={images[currentImage]} alt="preview" />
                <button onClick={(e) => { changeIndex(e, 1) }} className={s.rightButton}><img src="/icons/s-right.svg" alt="" /></button>
            </div>
            <div className={s.rulet}>
                {images ? (
                    images.map((image, index) => (
                        <img
                            onClick={() => {handleChooseImage(index)}}
                            src={image}
                            key={index}
                            alt={`image-${index}`}
                            id={index == currentImage ? s.light : null}
                        />
                    ))
                ) : null}
            </div>
        </div>

        </div>
    );
}

export default Slider;
