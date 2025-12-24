import React from 'react';
import { Card, Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ProjectsTab = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="Projects" 
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            New Project
          </Button>
        }
      >
        <Empty
          description="No projects yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />}>
            Create Your First Project
          </Button>
        </Empty>
      </Card>
    </div>
  );
};

export default ProjectsTab;