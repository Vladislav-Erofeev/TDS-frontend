import React, {useEffect, useState} from 'react';
import styles from './styles/attributesTabComponent.module.css'
import AddAttributeModal from "./AddAttributeModal";
import {AttributeService} from "../services/AttributeService";
import {hasRole} from "../data/functions";

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

    const removeAttribute = (item) => {
        const push =  async () => {
            await AttributeService.removeAttribute(item.id)
        }
        push()
        setAttributes(attributes => {
            let arr = [...attributes]
            arr.splice(arr.findIndex(attr => attr.id === item.id), 1)
            return arr
        })
    }
    return (
        <div>
            <div className={styles.attributes_list}>
                {attributes.map(attribute => <div key={attribute.id} className={styles.attribute}>
                    <p>{attribute.name} - {attribute.hname}</p>
                    <p>{attribute.dataType}</p>
                    <p>{attribute.creationDate}</p>
                    <button className={styles.remove_btn} onClick={() => {
                        removeAttribute(attribute)
                    }}>
                        <img src={'/icons/remove.svg'} width={'20px'}/>
                    </button>
                </div>)}
            </div>
            {hasRole("ADMIN") ? <button className={styles.add_layer} onClick={() => {
                setOpenAddAttribute(true)
            }}>
                <span><img src={'/icons/add.svg'} width={'20px'}/> Добавить атрибут</span>
            </button> : null}

            <AddAttributeModal callback={addAttribute} open={openAddAttribute} setOpen={setOpenAddAttribute}/>
        </div>
    );
};

export default AttributesTabComponent;