import React, {useState} from 'react';
import {Backdrop, CircularProgress, TextField} from "@mui/material";
import styles from './styles/addCodeModal.module.css'
import {CodeService} from "../services/CodeService";
import SelectLayerModal from "./SelectLayerModal";

const nullCode = {
    code: '',
    description: '',
    name: '',
    layer: null
}
const AddCodeModal = ({open, setOpen, layer, add, selectLayer}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [openSelectLayer, setOpenSelectLayer] = useState(false)
    const [code, setCode] = useState(nullCode)

    const saveCode = () => {
        setIsLoading(true)
        let push = async () => {
            if (!selectLayer)
                code.layer = layer
            let res = await CodeService.saveCode(code)
            setIsLoading(false)
            setCode(nullCode)
            setOpen(false)
            add(res)
        }

        push()
    }

    const setLayer = (layer) => {
        setCode(code => ({...code, layer: layer}))
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

                    {code.layer != null ? <p className={styles.layer}>{code.layer.name} - {code.layer.hname}</p> : null}
                    {
                        selectLayer ? <button className={styles.selectLayer} onClick={() => {
                            setOpenSelectLayer(true)
                        }}>выбрать слой</button> : null
                    }
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
            <SelectLayerModal setLayer={setLayer} setOpen={setOpenSelectLayer} open={openSelectLayer} />
        </Backdrop>
    );
};

export default AddCodeModal;