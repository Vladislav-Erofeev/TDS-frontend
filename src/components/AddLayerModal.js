import React, {useState} from 'react';
import {Backdrop, CircularProgress, TextField} from "@mui/material";
import styles from './styles/addLayerModal.module.css'
import {LayerService} from "../services/LayerService";

const nullLayer = {
    name: '',
    hname: '',
    geometryType: 'POLYGON',
    description: '',
    iconUrl: 'sdf'
}
const AddLayerModal = ({open, close, add}) => {
    const [newLayer, setNewLayer] = useState(nullLayer)
    const [isLoading, setIsLoading] = useState(false)

    const addLayer = () => {
        setIsLoading(true)
        const push = async () => {
            let res = await LayerService.addLayer(newLayer)
            setIsLoading(false)
            setNewLayer(nullLayer)
            close(false)
            add(res)
        }
        push()
    }
    return (
        <Backdrop open={open}>
            <div className={styles.modal}>
                <button className={styles.close_btn} onClick={() => {
                    close(false)
                }}>
                    <img src={'/icons/close.svg'} width={'25px'}/>
                </button>
                <h1>Новый слой</h1>
                <div className={styles.inputs}>
                    <TextField fullWidth
                               label={'Название'}
                               value={newLayer.name}
                               onChange={(e) => {
                                   setNewLayer({...newLayer, name: e.target.value})
                               }}
                               helperText={'Например: bldpol'}/>
                    <TextField fullWidth
                               label={'Расшифровка имени'}
                               value={newLayer.hname}
                               onChange={(e) => {
                                   setNewLayer({...newLayer, hname: e.target.value})
                               }}
                               helperText={'Например: строения'}/>
                    <TextField fullWidth select
                               value={newLayer.geometryType}
                               onChange={(e) => {
                                   setNewLayer({...newLayer, geometryType: e.target.value})
                               }}
                               label={'Геометрия'}
                               SelectProps={{native: true}}>
                        <option key={'POLYGON'} value={'POLYGON'}>POLYGON</option>
                        <option key={'POINT'} value={'POINT'}>POINT</option>
                        <option key={'LINE'} value={'LINE'}>LINE</option>
                    </TextField>
                    <TextField fullWidth
                               multiline
                               value={newLayer.description}
                               onChange={(e) => {
                                   setNewLayer({...newLayer, description: e.target.value})
                               }}
                               rows={4} label={'Описание'}/>
                </div>
                {isLoading ? <CircularProgress sx={{
                    marginTop: '20px'
                }}/> : <button onClick={() => {
                    addLayer()
                }} className={styles.save_btn}>Сохранить
                </button>}

            </div>
        </Backdrop>
    );
};

export default AddLayerModal;