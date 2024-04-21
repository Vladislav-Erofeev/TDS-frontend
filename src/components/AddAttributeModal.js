import React, {useState} from 'react';
import {Backdrop, CircularProgress, TextField} from "@mui/material";
import styles from "./styles/addLayerModal.module.css";
import {AttributeService} from "../services/AttributeService";

const nullAttribute = {
    name: '',
    hname: '',
    dataType: 'INTEGER',
    description: ''
}
const AddAttributeModal = ({open, setOpen, callback}) => {
    const [newAttribute, setNewAttribute] = useState(nullAttribute)
    const [isLoading, setIsLoading] = useState(false)

    const save = () => {
        const push = async () => {
            let res = await AttributeService.save(newAttribute)
            setIsLoading(true)
            callback(res)
            setOpen(false)
        }
        setIsLoading(true)
        push()
    }
    return (
        <Backdrop open={open}>
            <div className={styles.modal}>
                <button className={styles.close_btn} onClick={() => {
                    setNewAttribute(nullAttribute)
                    setOpen(false)
                }}>
                    <img src={'/icons/close.svg'} width={'25px'}/>
                </button>
                <h1>Новый слой</h1>
                <div className={styles.inputs}>
                    <TextField value={newAttribute.name} onChange={(e) => {
                        setNewAttribute({...newAttribute, name: e.target.value})
                    }} label={'Название'} helperText={"Например: addr_street"} fullWidth/>
                    <TextField value={newAttribute.hname} onChange={(e) => {
                        setNewAttribute({...newAttribute, hname: e.target.value})
                    }} label={'Расшифровка'} helperText={"Например: улица"} fullWidth/>
                    <TextField value={newAttribute.dataType} onChange={(e) => {
                        setNewAttribute({...newAttribute, dataType: e.target.value})
                    }} label={'Тип данных'} select fullWidth SelectProps={{native: true}}>
                        <option value={"INTEGER"} key={"INTEGER"}>INTEGER</option>
                        <option value={"BOOLEAN"} key={"BOOLEAN"}>BOOLEAN</option>
                        <option value={"DOUBLE"} key={"DOUBLE"}>DOUBLE</option>
                        <option value={"STRING"} key={"STRING"}>STRING</option>
                    </TextField>
                    <TextField value={newAttribute.description} onChange={(e) => {
                        setNewAttribute({...newAttribute, description: e.target.value})
                    }} placeholder={"Описание"} multiline rows={4}/>
                </div>
                {isLoading ? <CircularProgress sx={{
                        marginTop: '20px'
                    }}/> :
                    <button onClick={() => {
                        save()
                    }} className={styles.save_btn}>Сохранить
                    </button>
                }
            </div>
        </Backdrop>
    );
};

export default AddAttributeModal;