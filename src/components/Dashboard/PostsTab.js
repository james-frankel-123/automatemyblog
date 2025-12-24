import React from 'react';
import { Card, Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const PostsTab = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="Blog Posts" 
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            New Post
          </Button>
        }
      >
        <Empty
          description="No blog posts yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />}>
            Create Your First Post
          </Button>
        </Empty>
      </Card>
    </div>
  );
};

export default PostsTab;