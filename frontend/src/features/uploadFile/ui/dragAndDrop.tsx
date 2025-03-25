import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../api/uploadFile';
import { redirect } from 'react-router';
const DragAndDrop = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        uploadFile(file)
          .then((data) => {
            redirect(data.replace('/api', ''));
          })
          .catch((error) => {
            console.error('File upload error:', error);
          });
      } else {
        console.error('Invalid file type:', file.type);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px solid #cccccc',
        borderRadius: '5px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag or drop .word/.pdf files here</p>
      )}
    </div>
  );
};

export default DragAndDrop;
