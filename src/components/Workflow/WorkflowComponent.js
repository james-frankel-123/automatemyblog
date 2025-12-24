import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Typography, Radio, Spin, Progress, Input, message, Space, Tag, Form, Select, Slider, ColorPicker, Modal, Divider, Steps, Collapse } from 'antd';
import { SearchOutlined, BulbOutlined, EditOutlined, CheckOutlined, ReloadOutlined, GlobalOutlined, ScanOutlined, EyeOutlined, SettingOutlined, ApiOutlined, CloudUploadOutlined, CodeOutlined, DownOutlined, CloudDownloadOutlined, FileMarkdownOutlined, FileTextOutlined, DatabaseOutlined, FileZipOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import autoBlogAPI from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const WorkflowComponent = ({ embedded = false }) => {
  const { user } = useAuth();
  
  // All the workflow state that was previously in App.js
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [scanningMessage, setScanningMessage] = useState('');
  const [editingStep, setEditingStep] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedCMS, setSelectedCMS] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState([]);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [strategyCompleted, setStrategyCompleted] = useState(false);
  const [blogGenerating, setBlogGenerating] = useState(false);
  
  // Post state and content strategy management
  const [postState, setPostState] = useState('draft'); // 'draft', 'exported', 'locked'
  const [contentStrategy, setContentStrategy] = useState({
    goal: 'awareness', // 'awareness', 'consideration', 'conversion', 'retention'
    voice: 'expert', // 'expert', 'friendly', 'insider', 'storyteller'
    template: 'problem-solution', // 'how-to', 'problem-solution', 'listicle', 'case-study', 'comprehensive'
    length: 'standard' // 'quick', 'standard', 'deep'
  });
  const [customFeedback, setCustomFeedback] = useState('');
  const [showStrategyGate, setShowStrategyGate] = useState(false);
  const [showExportWarning, setShowExportWarning] = useState(false);
  
  // Change tracking for regeneration
  const [previousContent, setPreviousContent] = useState('');
  const [showChanges, setShowChanges] = useState(false);
  
  // Customer strategy selection
  const [selectedCustomerStrategy, setSelectedCustomerStrategy] = useState(null);
  const [strategySelectionCompleted, setStrategySelectionCompleted] = useState(false);
  
  // Web search research insights
  const [webSearchInsights, setWebSearchInsights] = useState({
    brandResearch: null,
    keywordResearch: null,
    researchQuality: 'basic' // 'basic', 'enhanced', 'premium'
  });
  
  // Demo mode for testing (bypass payment gates)
  const [demoMode, setDemoMode] = useState(
    process.env.REACT_APP_DEMO_MODE === 'true' || 
    window.location.search.includes('demo=true') ||
    localStorage.getItem('automyblog_demo_mode') === 'true'
  );
  
  // Step results storage
  const [stepResults, setStepResults] = useState({
    websiteAnalysis: {
      businessType: 'Child Wellness & Parenting',
      businessName: '',
      // Backward compatibility fields
      targetAudience: 'Parents of children aged 2-12',
      contentFocus: 'Emotional wellness, child development, mindful parenting',
      brandVoice: 'Warm, expert, supportive',
      description: '',
      keywords: [],
      // New customer psychology fields
      decisionMakers: 'Parents of children aged 2-12',
      endUsers: 'Children experiencing anxiety or emotional challenges',
      customerProblems: [],
      searchBehavior: '',
      customerLanguage: [],
      contentIdeas: [],
      connectionMessage: '',
      businessModel: '',
      websiteGoals: '',
      blogStrategy: '',
      scenarios: [],
      brandColors: {
        primary: '#6B8CAE',
        secondary: '#F4E5D3',
        accent: '#8FBC8F'
      }
    },
    trendingTopics: [],
    selectedContent: null,
    finalContent: ''
  });

  // Unified auth gate helper function
  const requireAuth = (action, context = 'gate') => {
    if (!user) {
      // For embedded mode, we'll handle this differently
      if (embedded) {
        message.warning('Please log in to access premium features');
        return false;
      }
      // Handle authentication requirement
      return false;
    }
    return true;
  };

  // This component will contain all the workflow logic that was previously in App.js
  // For now, let's create a placeholder that shows the step structure
  
  return (
    <div style={{ width: '100%' }}>
      {/* Workflow content will be implemented here */}
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Title level={3}>Blog Post Workflow</Title>
        <Text>
          This component will contain the full workflow logic.
          Current Step: {currentStep}
        </Text>
        <br /><br />
        <Button 
          type="primary" 
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={currentStep >= 5}
        >
          Next Step (Demo)
        </Button>
      </div>
    </div>
  );
};

export default WorkflowComponent;