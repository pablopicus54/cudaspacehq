import UpdateService from '@/components/pages/dashboard/Service/UpdateService/UpdateService';
import WithAdmin from '@/role-wrappers/WithAdmin';
import React from 'react';

const ServiceUpdatePage = () => {
    return (
        <WithAdmin>
            <UpdateService/>
        </WithAdmin>
    );
};

export default ServiceUpdatePage;