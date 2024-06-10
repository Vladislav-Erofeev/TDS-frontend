import React, {useState} from 'react';
import GeocodingReportModal from "./GeocodingReportModal";
import styles from './style/reportItem.module.css'

const ReportItem = ({item}) => {
    const [open,setOpen] = useState(false)
    return (
        <>
        <div className={styles.report_item}>
            <p>{item.creationDate}</p>
            <p>всего: {item.total}</p>
            <p>найдено: {item.found}</p>
            <a href={`${process.env.REACT_APP_STATIC_URL}/${item.sourceFile}`}>исходник</a>
            <button onClick={() => {
                setOpen(true)
            }} className={styles.report_btn}>результат</button>
        </div>
            <GeocodingReportModal setOpen={setOpen} open={open} url={item.reportFile}/>

        </>
    );
};

export default ReportItem;