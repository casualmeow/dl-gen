import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../api/uploadFile';
import { useNavigate } from 'react-router';

const DragAndDrop = () => {
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const isSupported =
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      if (!isSupported) {
        console.error('Invalid file type:', file.type);
        continue;
      }

      try {
        const redirectPath = await uploadFile(file);
        if (redirectPath) {
          // Navigate to /edit/{hash} or whatever the backend gave
          navigate(redirectPath);
        } else {
          console.error('No redirect path returned from server');
        }
      } catch (error) {
        console.error('File upload error:', error);
      }
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        padding: '20px',
        border: '2px dashed #ccc',
        borderRadius: '10px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      <p>
        {isDragActive
          ? 'Drop the file here...'
          : 'Drag and drop a .pdf or .doc/.docx file here, or click to select'}
      </p>
    </div>
  );
};

export default DragAndDrop;
