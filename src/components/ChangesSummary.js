import React, { useState } from 'react';
import { Card, Button, Typography, Space, Tag, Collapse, Alert } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, DiffOutlined } from '@ant-design/icons';
import * as Diff from 'diff';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const ChangesSummary = ({ previousContent, newContent, customFeedback }) => {
  const [showDetailedChanges, setShowDetailedChanges] = useState(false);

  // Generate text-based diff using the diff library
  const generateDiff = () => {
    if (!previousContent || !newContent) return [];
    
    // Split content into sentences for better diff granularity
    const sentences = Diff.diffSentences(previousContent, newContent);
    
    return sentences.filter(part => part.added || part.removed);
  };

  // Generate a summary of changes
  const generateChangeSummary = () => {
    const diffParts = generateDiff();
    const addedParts = diffParts.filter(part => part.added);
    const removedParts = diffParts.filter(part => part.removed);
    
    return {
      added: addedParts.length,
      removed: removedParts.length,
      totalChanges: diffParts.length
    };
  };

  // Render visual diff with highlighting
  const renderVisualDiff = () => {
    const diffParts = Diff.diffSentences(previousContent, newContent);
    
    return (
      <div style={{ fontFamily: 'monospace', lineHeight: 1.6, maxHeight: '400px', overflow: 'auto' }}>
        {diffParts.map((part, index) => {
          let backgroundColor = 'transparent';
          let color = 'inherit';
          let textDecoration = 'none';
          
          if (part.added) {
            backgroundColor = '#d4edda';
            color = '#155724';
          } else if (part.removed) {
            backgroundColor = '#f8d7da';
            color = '#721c24';
            textDecoration = 'line-through';
          }
          
          return (
            <span
              key={index}
              style={{
                backgroundColor,
                color,
                textDecoration,
                padding: part.added || part.removed ? '2px 4px' : '0',
                borderRadius: part.added || part.removed ? '3px' : '0',
                margin: part.added || part.removed ? '0 1px' : '0'
              }}
            >
              {part.value}
            </span>
          );
        })}
      </div>
    );
  };

  const summary = generateChangeSummary();
  
  if (!previousContent || !newContent || previousContent === newContent) {
    return null;
  }

  return (
    <Card 
      style={{ 
        marginBottom: '16px', 
        border: '1px solid #1890ff',
        borderRadius: '8px'
      }}
      size="small"
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
            <DiffOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Content Changes Applied
          </Title>
          <Button
            size="small"
            icon={showDetailedChanges ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setShowDetailedChanges(!showDetailedChanges)}
          >
            {showDetailedChanges ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>

        {customFeedback && (
          <Alert
            message="Your Feedback Applied"
            description={customFeedback}
            type="info"
            showIcon
            style={{ fontSize: '12px' }}
          />
        )}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {summary.added > 0 && (
            <Tag color="green">
              +{summary.added} sections added
            </Tag>
          )}
          {summary.removed > 0 && (
            <Tag color="red">
              -{summary.removed} sections removed
            </Tag>
          )}
          {summary.totalChanges === 0 && (
            <Tag color="blue">
              Content restructured
            </Tag>
          )}
        </div>

        {showDetailedChanges && (
          <Collapse ghost>
            <Panel header="Detailed Changes" key="1">
              <div style={{ 
                backgroundColor: '#fafafa', 
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid #d9d9d9'
              }}>
                <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>
                  <span style={{ color: '#d4edda', backgroundColor: '#155724', padding: '2px 4px', borderRadius: '3px', marginRight: '8px' }}>
                    Green
                  </span>
                  = Added content
                  <span style={{ color: '#f8d7da', backgroundColor: '#721c24', padding: '2px 4px', borderRadius: '3px', margin: '0 8px' }}>
                    Red
                  </span>
                  = Removed content
                </Text>
                {renderVisualDiff()}
              </div>
            </Panel>
          </Collapse>
        )}

        <Text style={{ fontSize: '12px', color: '#666' }}>
          The content has been updated based on your feedback. 
          {summary.totalChanges > 0 && ` ${summary.totalChanges} changes were made.`}
        </Text>
      </Space>
    </Card>
  );
};

export default ChangesSummary;