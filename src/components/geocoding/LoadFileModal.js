import React, {useRef, useState} from 'react';
import {Backdrop, CircularProgress} from "@mui/material";
import styles from './style/loadFileModal.module.css'
import {GeocodingService} from "../../services/GeocodingService";

const LoadFileModal = ({setGeocodings, open, setOpen}) => {
    const [dragActive, setDragActive] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef()
    const [file, setFile] = useState(null)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    };

    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const load = () => {
        const push = async () => {
            let res = await GeocodingService.createNew(file)
            setGeocodings(state => [...state, res])
            setIsLoading(false)
            setOpen(false)
        }
        setIsLoading(true)
        push()
    }

    return (
        <Backdrop open={open}>
            <div className={styles.container}>
                <button className={styles.close_btn} onClick={() => {
                    setOpen(false)
                }}>
                    <img src={'/icons/close.svg'} width={'25px'}/>
                </button>
                <h1>Загрузить файл</h1>
                <p></p>
                <form className={styles.form_file_upload}
                      onDragEnter={handleDrag}>
                    <input onChange={handleChange} ref={inputRef} style={{display: 'none'}} type={'file'}/>
                    <label className={dragActive ? styles.label_active :
                        styles.label_file} onClick={onButtonClick}>
                        <div>
                            {file ? <p>{file.name}</p> : <p>Загрузите свой файл</p>}
                        </div>
                    </label>
                    {dragActive && <div className={styles.drag_element}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag} onDragOver={handleDrag}
                                        onDrop={handleDrop}></div>}

                </form>
                {isLoading ? <CircularProgress/> :
                    <button onClick={load}>
                        Загрузить
                    </button>
                }
            </div>
        </Backdrop>
    );
};

export default LoadFileModal;