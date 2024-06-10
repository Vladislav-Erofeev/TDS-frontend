import React, {useEffect, useState} from 'react';
import {Backdrop} from "@mui/material";
import styles from "./styles/selectAttributesModal.module.css";
import {AttributeService} from "../../services/AttributeService";

const SelectAttributesModal = ({open, setOpen, callback, selected}) => {
    const [attributes, setAttributes] = useState([])
    const [selectedList, setSelectedList] = useState(selected)
    useEffect(() => {
        const fetch = async () => {
            setAttributes(await AttributeService.getAll())
        }
        if (!open || attributes.length !== 0)
            return
        fetch()
    }, [open])

    const isSelected = (attribute) => {
        return selectedList.findIndex(item => item.id === attribute.id) >= 0;
    }

    const handleClick = (item) => {
        if (isSelected(item)) {
            let arr = [...selectedList]
            arr.splice(selectedList.findIndex(i => i.id === item.id), 1)
            setSelectedList(arr)
        } else {
            setSelectedList([item, ...selectedList])
        }
    }
    return (
        <Backdrop open={open}>
            <div className={styles.modal}>
                <button className={styles.close_btn} onClick={() => {
                    setOpen(false)
                }}>
                    <img src={'/icons/close.svg'} width={'25px'}/>
                </button>
                <h1>Атрибуты</h1>
                <div className={styles.list}>
                    {attributes.map(item => <button key={item.id} onClick={() => {
                        handleClick(item)
                    }} className={isSelected(item) ? styles.selected : styles.layer}>
                        <p>{item.name} - {item.hname}</p>
                        <p>{item.dataType}</p>
                    </button>)}
                </div>
                <button className={styles.save_btn} onClick={() => {
                    callback(selectedList)
                    setOpen(false)
                }}>
                    сохранить
                </button>
            </div>
        </Backdrop>
    );
};

export default SelectAttributesModal;