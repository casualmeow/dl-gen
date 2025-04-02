import axios from 'axios';

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // First attempt: Don't follow redirects and handle them manually
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Don't follow redirects automatically
      maxRedirects: 0,
      // Accept both success and redirect status codes
      validateStatus: (status) => status >= 200 && status < 400,
    });

    console.log('Upload response:', response);
    
    // Case 1: Server returned a redirect status code (302 or 303)
    if (response.status === 302 || response.status === 303) {
      const location = response.headers.location || '';
      return location.startsWith('/') ? location : `/${location}`;
    }
    
    // Case 2: Server returned a JSON response with a redirect field
    if (response.data && typeof response.data === 'object' && response.data.redirect) {
      const redirect = response.data.redirect;
      return redirect.startsWith('/') ? redirect : `/${redirect}`;
    }
    
    // Case 3: Server returned HTML content (possibly the page after redirect)
    if (response.data && typeof response.data === 'string') {
      // Look for edit/{hash} pattern in the HTML
      const editPathMatch = response.data.match(/\/edit\/(\w+)/);
      if (editPathMatch && editPathMatch[0]) {
        return editPathMatch[0]; // Return the /edit/{hash} path
      }
    }
    
    // If we couldn't find a valid redirect path, throw an error
    throw new Error('No valid redirect path found in server response');
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};
