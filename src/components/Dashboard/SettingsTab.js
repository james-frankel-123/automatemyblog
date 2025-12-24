import React from 'react';
import { Card, Tabs } from 'antd';
import { UserOutlined, BankOutlined, CreditCardOutlined } from '@ant-design/icons';

const ProfileSettings = () => (
  <div style={{ padding: '20px 0' }}>
    <h4>Profile Settings</h4>
    <p>Profile management coming soon...</p>
  </div>
);

const OrganizationSettings = () => (
  <div style={{ padding: '20px 0' }}>
    <h4>Organization Settings</h4>
    <p>Organization management coming soon...</p>
  </div>
);

const BillingSettings = () => (
  <div style={{ padding: '20px 0' }}>
    <h4>Billing Settings</h4>
    <p>Billing management coming soon...</p>
  </div>
);

const SettingsTab = () => {
  const items = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      children: <ProfileSettings />,
    },
    {
      key: 'organization',
      label: 'Organization',
      icon: <BankOutlined />,
      children: <OrganizationSettings />,
    },
    {
      key: 'billing',
      label: 'Billing',
      icon: <CreditCardOutlined />,
      children: <BillingSettings />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Settings">
        <Tabs items={items} />
      </Card>
    </div>
  );
};

export default SettingsTab;