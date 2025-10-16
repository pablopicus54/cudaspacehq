import AddServicePageComponent from '@/components/pages/dashboard/Service/AddService/AddServicePageComponent';
import WithAdmin from '@/role-wrappers/WithAdmin';
import React from 'react';

const AddServicePage = () => {
    return (
        <WithAdmin>
            <AddServicePageComponent/>
        </WithAdmin>
    );
};

export default AddServicePage;