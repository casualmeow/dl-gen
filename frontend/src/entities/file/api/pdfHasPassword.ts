import axios from 'axios';

export const checkPdfHasPassword = async (file: File): Promise<boolean> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/v2/pdfHasPassword',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.hasPassword;
};
