import WithAdmin from '@/role-wrappers/WithAdmin';
import React from 'react';

const page = () => {
    return (
        <WithAdmin>
            profile
        </WithAdmin>
    );
};

export default page;