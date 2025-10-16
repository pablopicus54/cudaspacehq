import ManageOrdersPageComponent from '@/components/pages/dashboard/ManageOrders/ManageOrdersPageComponent';
import WithAdmin from '@/role-wrappers/WithAdmin';
import React from 'react';

const ManageOrdersPage = () => {
    return (
        <WithAdmin>
            <ManageOrdersPageComponent/>
        </WithAdmin>
    );
};

export default ManageOrdersPage;