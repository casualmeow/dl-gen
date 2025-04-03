// import { getDocument } from 'pdfjs-dist';

// export async function extractMetadata(file: File) {
//   const arrayBuffer = await file.arrayBuffer();
//   const pdf = await getDocument({ data: arrayBuffer }).promise;
//   const meta = await pdf.getMetadata();
  
//   return {
//     title: meta.info.Title ?? '',
//     author: meta.info.Author ?? '',
//     subject: meta.info.Subject ?? '',
//     keywords: meta.info.Keywords ?? ''
//   };
// }
