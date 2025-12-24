import React from 'react';
import { Card } from 'antd';

const NewPostTab = ({ 
  currentStep,
  setCurrentStep,
  stepResults,
  setStepResults,
  websiteUrl,
  setWebsiteUrl,
  isLoading,
  setIsLoading,
  selectedTopic,
  setSelectedTopic,
  generatedContent,
  setGeneratedContent,
  contentStrategy,
  setContentStrategy,
  customFeedback,
  setCustomFeedback,
  // All other workflow state and functions will be passed as props
  workflowComponent
}) => {
  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="Create New Blog Post" 
        style={{ 
          border: 'none',
          boxShadow: 'none' 
        }}
      >
        {/* The workflow component will be embedded here */}
        {workflowComponent}
      </Card>
    </div>
  );
};

export default NewPostTab;