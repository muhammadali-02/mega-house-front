const Menu: any = [
  {
    header: 'sidebar.main'
  },
  {
    title: 'sidebar.dashboard',
    icon: 'dashboard',
    link: '/'
  },
  {
    title: 'sidebar.rent',
    icon: 'receipt_long',
    link: '/'
  },
  {
    header: 'sidebar.bills_title'
  },
  {
    title: 'sidebar.account_number',
    icon: 'format_list_numbered',
    link: '/account-number'
  },
  {
    title: 'sidebar.bills_report',
    icon: 'file_copy',
    children: [
      {
        title: 'sidebar.hot',
        icon: 'opacity',
        link: '/report/hot'
      },
      {
        title: 'sidebar.cold',
        icon: 'water_drop',
        link: '/report/cold'
      },
      {
        title: 'sidebar.gaz',
        icon: 'local_fire_department',
        link: '/report/gaz'
      },
      {
        title: 'sidebar.electronic',
        icon: 'bolt',
        link: '/report/electronic'
      },
      {
        title: 'sidebar.garbage',
        icon: 'delete_forever',
        link: '/report/garbage'
      },
      {
        title: 'sidebar.communal',
        icon: 'contact_support',
        link: '/report/communal'
      },
      {
        title: 'sidebar.tax',
        icon: 'verified',
        link: '/report/tax'
      }
    ]
  },
  {
    title: 'sidebar.bills',
    icon: 'real_estate_agent',
    children: [
      {
        title: 'sidebar.hot',
        icon: 'opacity',
        link: '/bills/hot'
      },
      {
        title: 'sidebar.cold',
        icon: 'water_drop',
        link: '/bills/cold'
      },
      {
        title: 'sidebar.gaz',
        icon: 'local_fire_department',
        link: '/bills/gaz'
      },
      {
        title: 'sidebar.electronic',
        icon: 'bolt',
        link: '/bills/electronic'
      },
      // {
      //   title: 'sidebar.garbage',
      //   icon: 'delete_forever',
      //   link: '/bills/garbage'
      // },
      // {
      //   title: 'sidebar.communal',
      //   icon: 'contact_support',
      //   link: '/bills/communal'
      // },
      // {
      //   title: 'sidebar.tax',
      //   icon: 'verified',
      //   link: '/bills/tax'
      // }
    ]
  },
  {
    header: 'sidebar.management'
  },
  {
    title: 'sidebar.home',
    icon: 'house',
    link: '/houses'
  },
  {
    title: 'sidebar.person',
    icon: 'groups',
    link: '/persons'
  },
  {
    title: 'sidebar.user',
    icon: 'group',
    link: '/users'
  },
  {
    title: 'sidebar.role',
    icon: 'storage',
    link: '/roles'
  },
  {
    header: 'sidebar.references'
  },
  {
    title: 'sidebar.communal_type',
    icon: 'toggle_on',
    link: '/communal-type'
  },
  {
    title: 'sidebar.region',
    icon: 'public',
    link: '/region'
  }
]

export default Menu
