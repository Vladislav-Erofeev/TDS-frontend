import React, {useState} from 'react';
import GeocodingReportModal from "./GeocodingReportModal";
import styles from './style/reportItem.module.css'
import moment from "moment/moment";
import {getTimeWithTz} from "../../data/functions";

const ReportItem = ({item}) => {
    const [open,setOpen] = useState(false)
    return (
        <>
        <div key={item.id} className={item.status === 'DONE' ? styles.report_item : styles.in_process}>
            <p>{getTimeWithTz(item.creationDate)}</p>
            <p>всего: {item.total}</p>
            <p>найдено: {item.found}</p>
            <a href={`${process.env.REACT_APP_STATIC_URL}/${item.sourceFile}`}>исходник</a>
            <button onClick={() => {
                if (item.status === 'DONE')
                    setOpen(true)
            }} className={styles.report_btn}>результат</button>
        </div>
            <GeocodingReportModal setOpen={setOpen} open={open} url={item.reportFile}/>
        </>
    );
};

export default ReportItem;