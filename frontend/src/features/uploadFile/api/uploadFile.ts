import axios from 'axios';

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 400,
  });

  console.log(response);
  if (response.status === 303 || response.data === 302) {
    const location = response.headers['location'];

    const frontendPath = location.replace(/^\/api/, '');
    return frontendPath;
  } else {
    throw new Error('unexpected response');
  }
};
