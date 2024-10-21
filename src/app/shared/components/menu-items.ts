interface MenuItems {
    title: string;
    icon: string;
    link: string;
    subMenu?: MenuItems[];
}

export const menuItems: MenuItems[] = [
    {
        title: 'Dashboard',
        icon: 'dashboard',
        link: 'admin/dashboard'
    },
    {
        title: 'Customers',
        icon: 'supervisor_account',
        link: 'admin/customers',
        subMenu: [
            {
                title: 'Active Customers',
                icon: 'person',
                link: 'admin/customers/active'
            },
            {
                title: 'Inactive Customers',
                icon: 'person_outline',
                link: 'admin/customers/inactive',
                subMenu: [
                    {
                        title: 'Edit Customers',
                        icon: 'edit',
                        link: 'admin/customers/edit'
                    },
                    {
                        title: 'View Customers',
                        icon: 'delete',
                        link: 'admin/customers/delete'
                    }
                ]
            }
        ]
    },
    {
        title: 'Users',
        icon: 'group',
        link: 'admin/users'
    },
    {
        title: 'Invoices',
        icon: 'file_copy',
        link: 'admin/invoices',
    }
];