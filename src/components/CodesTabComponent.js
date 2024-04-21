import React, {useEffect, useState} from 'react';
import {CodeService} from "../services/CodeService";
import CodeComponent from "./CodeComponent";
import styles from './styles/codeTabComponent.module.css'
import AddCodeModal from "./AddCodeModal";
import {hasRole} from "../data/functions";

const CodesTabComponent = () => {
    const [list, setList] = useState([])
    const [openAddCodeModal, setOpenCodeModal] = useState(false)
    useEffect(() => {
        const fetch = async () => {
            setList(await CodeService.getAll())
        }

        fetch()
    }, [])

    const removeCode = (id) => {
        CodeService.deleteCode(id)
        setList(list => {
            let newList = [...list]
            newList.splice(newList.indexOf(i => i.id === id), 1)
            return newList
        })
    }

    const addCode = (code) => {
        setList(list => ([code, ...list]))
    }
    return (
        <div>
            <div className={styles.list}>
                {list.length === 0 ? <h2>Список пуст</h2> :
                    list.map(code => <CodeComponent remove={removeCode} code={code}/>)}
            </div>
            {hasRole('ADMIN') ? <button className={styles.add_layer} onClick={() => {
                setOpenCodeModal(true)
            }}>
                <span><img src={'/icons/add.svg'} width={'20px'}/> Добавить код</span>
            </button> : null}

            <AddCodeModal selectLayer add={addCode} open={openAddCodeModal} setOpen={setOpenCodeModal}/>
        </div>
    );
};

export default CodesTabComponent;