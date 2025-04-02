import axios from 'axios';

type UploadResponse = {
  redirect: string;
};

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<UploadResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Only accept 2xx responses
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // const stringParseURL = () =>
    // {
    //       return JSON.parse(JSON.stringify(response.data)).url as string;
    // };
    // const redirect = stringParseURL();
    const redirect = (response.data as any).url;

    if (redirect && typeof redirect === 'string') {
      return redirect;
    }

    throw new Error('No redirect path in server response');
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};
