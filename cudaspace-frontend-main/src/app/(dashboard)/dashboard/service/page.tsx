import ServicePageComponent from '@/components/pages/dashboard/Service/ServicePageComponent';
import WithAdmin from '@/role-wrappers/WithAdmin';
import React from 'react';

const ServicePage = () => {
    return (
        <WithAdmin>
            <ServicePageComponent/>
        </WithAdmin>
    );
};

export default ServicePage;