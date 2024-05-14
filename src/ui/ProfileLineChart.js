import React, {useEffect, useState} from 'react';
import {LineChart} from "@mui/x-charts";
import {GeodataService} from "../services/GeodataService";

const ProfileLineChart = () => {
    const [data, setData] = useState({
        keys: [],
        values: []
    })

    useEffect(() => {
        let fetch = async () => {
            let res = await GeodataService.getItemsCountByPersonIdGroupBuDay()
            res.keys = res.keys.map(item => new Date(item))
            setData(res)
        }

        fetch()
    }, [])
    return (
        <div style={{
            margin: 'auto',
            width: 'min-content'
        }}>
            <LineChart
                xAxis={[{
                    data: data.keys,
                    scaleType: 'time',
                    tickInterval: data.keys,
                    valueFormatter: (day) => day.toLocaleDateString()
                }]}
                series={[
                    {
                        data: data.values
                    }
                ]} width={700} height={400}/>
        </div>
    );
};

export default ProfileLineChart;