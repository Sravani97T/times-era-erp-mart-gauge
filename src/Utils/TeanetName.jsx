import React, { useEffect, useState } from 'react';

const TeanetName = () => {
    const [tenantName, setTenantName] = useState('');

    useEffect(() => {
        const storedTenantName = localStorage.getItem('tenantName');
        if (storedTenantName) {
            setTenantName(storedTenantName);
        }
    }, []);

    return (
        <div>
            {tenantName ? (
                <span>{tenantName}</span>
            ) : (
                <span>No tenant name found in localStorage.</span>
            )}
        </div>
    );
};

export default TeanetName;