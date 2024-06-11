import React, {useState} from 'react';
import GeocodingReportModal from "./GeocodingReportModal";
import styles from './style/reportItem.module.css'
import {getTimeWithTz} from "../../data/functions";
import {Menu, MenuItem} from "@mui/material";
import {GeocodingService} from "../../services/GeocodingService";

const ReportItem = ({item, deleteCallback}) => {
    const [open, setOpen] = useState(false)
    const [anchor, setAnchor] = useState(null)
    const openMenu = Boolean(anchor)

    const handleClick = (e) => {
        if (item.status === 'DONE')
            setAnchor(e.currentTarget);
    };
    const handleClose = () => {
        setAnchor(null);
    };

    const removeById = (id) => {
        const push = async () => {
            await GeocodingService.deleteByyId(id)
        }

        push()
        deleteCallback(id)
    }

    return (
        <>
            <div key={item.id} className={item.status === 'DONE' ? styles.report_item : styles.in_process}>
                <p>{getTimeWithTz(item.creationDate)}</p>
                <p>всего: {item.total}</p>
                <p>найдено: {item.found}</p>
                <button onClick={() => {
                    if (item.status === 'DONE')
                        setOpen(true)
                }} className={styles.report_btn}>результат
                </button>
                <button onClick={handleClick} className={styles.open_menu_btn}>
                    <img src={'/icons/3844442-dot-menu-more-vertical_110310.svg'} width={'25px'}/>
                </button>
                <Menu transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                      anchorOrigin={{
                          horizontal: 'right',
                          vertical: 'bottom'
                      }}
                      open={openMenu} onClose={handleClose} anchorEl={anchor}>
                    <MenuItem onClick={handleClose}><a className={styles.menu_link}
                                                       href={`${process.env.REACT_APP_STATIC_URL}/${item.csvReport}`}>Скачать
                        отчёт</a></MenuItem>
                    <MenuItem onClick={handleClose}><a className={styles.menu_link}
                                                       href={`${process.env.REACT_APP_STATIC_URL}/${item.sourceFile}`}>Скачать
                        исходник</a></MenuItem>
                    <MenuItem onClose={handleClose} onClick={() => {
                        removeById(item.id)
                        handleClose()
                    }}>
                        Удалить
                    </MenuItem>
                </Menu>
            </div>
            <GeocodingReportModal setOpen={setOpen} open={open} url={item.reportFile}/>
        </>
    );
};

export default ReportItem;