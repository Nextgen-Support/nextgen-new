// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Get the authorization token from environment variables
const getAuthToken = (): string | null => {
  return import.meta.env.VITE_API_AUTH_TOKEN || null;
};

// Helper function to create headers with auth token
const createAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    // Using the standard Authorization header with Bearer scheme
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const helpDeskHeader = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    // Using the standard Authorization header with Bearer scheme
    // console.log(`token: ${token}`)
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  _subject?: string;
  _captcha?: string;
  _template?: string;
  _autoresponse?: string;
}

export interface ServiceRequestData {
  subject: string;
  problem: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  currentCustomer: 'yes' | 'no';
  recaptchaToken?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ServiceRequestResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

export const getServiceRequests = async (): Promise<ApiResponse<ServiceRequestResponse[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/service-requests`, {
      headers: createAuthHeaders()
    });
    
    const data = await response.json();

    if (!response.ok) {
      // Handle 401 Unauthorized (token expired/invalid)
      if (response.status === 401) {
        // TODO: Add your token refresh or logout logic here
        console.error('Authentication failed');
      }
      throw new Error(data.message || 'Failed to fetch service requests');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Common headers for API requests
const getAuthHeaders = () => {
  const token = import.meta.env.VITE_API_AUTH_TOKEN;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const submitContactForm = async (data: ContactFormData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sendEmail`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to submit contact form');
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const submitServiceRequest = async (data: ServiceRequestData): Promise<ApiResponse<ServiceRequestResponse>> => {
  try {
    // Prepare the request body
    const body: any = { ...data };
    
    // Add reCAPTCHA token if available
    if (window.grecaptcha) {
      body.recaptchaToken = await window.grecaptcha.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'your-recaptcha-site-key', 
        { action: 'submit' }
      );
    }

    // const response = await fetch(`${API_BASE_URL}/service-requests`, {
    const response = await fetch(`${API_BASE_URL}/createRequest`, {
      // authorization: 'Bearer sometoken here'
      method: 'POST',
      headers: helpDeskHeader(),
      body: JSON.stringify(body),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {

      // console.log(responseData)
      // If there are validation errors, include them in the error message
      if (response.status === 400 && responseData.errors) {
        const errorMessages = responseData.errors
          .map((error: any) => `${error.path}: ${error.msg}`)
          .join('\n');
        throw new Error(`Validation failed:\n${errorMessages}`);
      }
      throw new Error(responseData.message || 'Failed to submit service request');
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
