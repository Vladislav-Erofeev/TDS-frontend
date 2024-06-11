import React, {useState} from 'react';
import GeocodingReportModal from "./GeocodingReportModal";
import styles from './style/reportItem.module.css'
import {getTimeWithTz} from "../../data/functions";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem} from "@mui/material";
import {GeocodingService} from "../../services/GeocodingService";

const ReportItem = ({item, deleteCallback}) => {
    const [open, setOpen] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
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
                    <MenuItem sx={{
                        color: 'red'
                    }} onClose={handleClose} onClick={() => {
                        setOpenDeleteDialog(true)
                        handleClose()
                    }}>
                        Удалить
                    </MenuItem>
                </Menu>
            </div>
            <Dialog  open={openDeleteDialog}>
                <DialogTitle>Подвердите удаление</DialogTitle>
                <DialogContent>
                    Вы собираетесь удалить объект геокодирования. Данное действие нельзя будет отменить
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDeleteDialog(false)
                    }}>Отменить</Button>
                    <Button sx={{
                        color: 'red'
                    }} onClick={() => {
                        removeById(item.id)
                        setOpenDeleteDialog(false)
                    }}>Удалить</Button>
                </DialogActions>
            </Dialog>
            <GeocodingReportModal setOpen={setOpen} open={open} url={item.reportFile}/>
        </>
    );
};

export default ReportItem;