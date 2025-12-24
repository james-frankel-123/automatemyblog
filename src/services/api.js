// AutoBlog API Service
class AutoBlogAPI {
  constructor() {
    // Use environment variable for backend URL
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  /**
   * Make HTTP request to backend API
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add timeout with fallback for older browsers (60s for DALL-E generation)
    const timeoutSignal = typeof AbortSignal.timeout === 'function' 
      ? AbortSignal.timeout(60000) 
      : undefined;
    
    const requestOptions = {
      ...defaultOptions,
      ...options,
      ...(timeoutSignal && { signal: timeoutSignal }),
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // For file downloads, return the response directly
        return response;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      throw new Error(`API Error: ${error.message}`);
    }
  }

  /**
   * Analyze website content and extract business information
   */
  async analyzeWebsite(url) {
    try {
      const response = await this.makeRequest('/api/analyze-website', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });

      return response;
    } catch (error) {
      throw new Error(`Failed to analyze website: ${error.message}`);
    }
  }

  /**
   * Generate trending topics for a business
   */
  async getTrendingTopics(businessType, targetAudience, contentFocus) {
    try {
      const response = await this.makeRequest('/api/trending-topics', {
        method: 'POST',
        body: JSON.stringify({
          businessType,
          targetAudience,
          contentFocus,
        }),
      });

      return response.topics || [];
    } catch (error) {
      throw new Error(`Failed to generate trending topics: ${error.message}`);
    }
  }

  /**
   * Generate blog post content
   */
  async generateContent(topic, businessInfo, additionalInstructions = '') {
    try {
      const response = await this.makeRequest('/api/generate-content', {
        method: 'POST',
        body: JSON.stringify({
          topic,
          businessInfo,
          additionalInstructions,
        }),
      });

      return response.blogPost;
    } catch (error) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  /**
   * Export blog post in different formats
   */
  async exportContent(blogPost, format) {
    try {
      const response = await this.makeRequest('/api/export', {
        method: 'POST',
        body: JSON.stringify({
          blogPost,
          format,
        }),
      });

      // For exports, we get the raw content back
      if (response instanceof Response) {
        const blob = await response.blob();
        return blob;
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to export content: ${error.message}`);
    }
  }

  /**
   * Analyze changes between two versions of content
   */
  async analyzeChanges(previousContent, newContent, customFeedback = '') {
    try {
      const response = await this.makeRequest('/api/analyze-changes', {
        method: 'POST',
        body: JSON.stringify({
          previousContent,
          newContent,
          customFeedback,
        }),
      });

      return response.analysis;
    } catch (error) {
      throw new Error(`Failed to analyze changes: ${error.message}`);
    }
  }

  /**
   * Test API connectivity
   */
  async healthCheck() {
    try {
      const response = await this.makeRequest('/health');
      return response;
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  /**
   * Get API information
   */
  async getAPIInfo() {
    try {
      const response = await this.makeRequest('/api');
      return response;
    } catch (error) {
      throw new Error(`Failed to get API info: ${error.message}`);
    }
  }

  /**
   * User authentication methods
   */
  async login(email, password) {
    try {
      const response = await this.makeRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async register(userData) {
    try {
      const response = await this.makeRequest('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async me() {
    try {
      const response = await this.makeRequest('/api/v1/auth/me');
      return response;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await this.makeRequest('/api/v1/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      return response;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  async logout() {
    try {
      await this.makeRequest('/api/v1/auth/logout', {
        method: 'POST',
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

// Create singleton instance
const autoBlogAPI = new AutoBlogAPI();

export default autoBlogAPI;