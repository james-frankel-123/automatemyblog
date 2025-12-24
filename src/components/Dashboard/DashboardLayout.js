import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import NewPostTab from './NewPostTab';
import OverviewTab from './OverviewTab';
import PostsTab from './PostsTab';
import ProjectsTab from './ProjectsTab';
import AnalyticsTab from './AnalyticsTab';
import SettingsTab from './SettingsTab';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('newpost');
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: 'newpost',
      icon: <EditOutlined />,
      label: 'New Post',
    },
    {
      key: 'overview',
      icon: <DashboardOutlined />,
      label: 'Overview',
    },
    {
      key: 'posts',
      icon: <FileTextOutlined />,
      label: 'Posts',
    },
    {
      key: 'projects',
      icon: <FolderOutlined />,
      label: 'Projects',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'newpost':
        return <NewPostTab />;
      case 'overview':
        return <OverviewTab />;
      case 'posts':
        return <PostsTab />;
      case 'projects':
        return <ProjectsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <NewPostTab />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={240}
      >
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: collapsed ? '14px' : '18px' }}>
            {collapsed ? 'AB' : 'AutoBlog'}
          </h3>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          items={menuItems}
          onClick={({ key }) => setActiveTab(key)}
          style={{ border: 'none' }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div>
            <h2 style={{ margin: 0, textTransform: 'capitalize' }}>
              {activeTab}
            </h2>
          </div>

          <Space>
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
            >
              <Button type="text" style={{ height: 'auto', padding: '4px' }}>
                <Space>
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <span>
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </span>
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px', 
          background: '#fff',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;