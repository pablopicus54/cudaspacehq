import UserServicePageComponent from '@/components/pages/dashboard/UserService/UserServicePageComponent';
import WithAdmin from '@/role-wrappers/WithAdmin';
import React from 'react';

const UserServicePage = () => {
    return (
        <WithAdmin>
            <UserServicePageComponent/>
        </WithAdmin>
    );
};

export default UserServicePage;