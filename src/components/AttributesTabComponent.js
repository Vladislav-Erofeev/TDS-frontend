import React, {useEffect, useState} from 'react';
import styles from './styles/attributesTabComponent.module.css'
import AddAttributeModal from "./AddAttributeModal";
import {AttributeService} from "../services/AttributeService";

const AttributesTabComponent = () => {
    const [openAddAttribute, setOpenAddAttribute] = useState(false)
    const [attributes, setAttributes] = useState([])

    useEffect(() => {
        let fetch = async () => {
            setAttributes(await AttributeService.getAll())
        }
        fetch()
    }, [])

    const addAttribute = (attribute) => {
        setAttributes(attributes => ([...attributes, attribute]))
    }
    return (
        <div>
            <div className={styles.attributes_list}>
                {attributes.map(attribute => <div className={styles.attribute}>
                    <p>{attribute.name} - {attribute.hname}</p>
                    <p>{attribute.dataType}</p>
                    <p>{attribute.creationDate}</p>
                </div>)}
            </div>
            <button className={styles.add_layer} onClick={() => {
                setOpenAddAttribute(true)
            }}>
                <span><img src={'/icons/add.svg'} width={'20px'}/> Добавить атрибут</span>
            </button>
            <AddAttributeModal callback={addAttribute} open={openAddAttribute} setOpen={setOpenAddAttribute}/>
        </div>
    );
};

export default AttributesTabComponent;