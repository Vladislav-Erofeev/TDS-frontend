import React, {useState} from 'react';
import {Backdrop, CircularProgress, TextField} from "@mui/material";
import styles from './styles/addCodeModal.module.css'
import {CodeService} from "../services/CodeService";

const nullCode = {
    code: '',
    description: '',
    name: '',
    layer: null
}
const AddCodeModal = ({open, setOpen, layer, add}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState(nullCode)

    const saveCode = () => {
        setIsLoading(true)
        let push = async () => {
            code.layer = layer
            let res = await CodeService.saveCode(code)
            setIsLoading(false)
            setCode(nullCode)
            setOpen(false)
            add(res)
        }

        push()
    }
    return (
        <Backdrop open={open}>
            <div className={styles.modal}>
                <button className={styles.close_btn} onClick={() => {
                    setOpen(false)
                }}>
                    <img src={'/icons/close.svg'} width={'25px'}/>
                </button>
                <h1>Добавление кода</h1>
                <div className={styles.inputs}>
                    <TextField label={'Код'}
                               value={code.code}
                               onChange={(e) => {
                                   setCode({...code, code: parseInt(e.target.value)})
                               }}/>
                    <TextField label={'Наименование'} value={code.name}
                               onChange={(e) => {
                                   setCode({...code, name: e.target.value})
                               }}/>
                    <TextField label={'Описание'} multiline value={code.description}
                               onChange={(e) => {
                                   setCode({...code, description: e.target.value})
                               }} rows={4}/>
                    {isLoading ? <CircularProgress sx={{
                            margin: 'auto'
                        }}/> :
                        <button className={styles.save_btn} onClick={() => {
                            saveCode()
                        }}>
                            сохранить
                        </button>}
                </div>
            </div>
        </Backdrop>
    );
};

export default AddCodeModal;