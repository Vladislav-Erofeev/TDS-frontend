import React from 'react';

const TabComponent = ({value, currentValue, component}) => {
    return (
        <>
            {currentValue === value ? component : null}
        </>
    );
};

export default TabComponent;