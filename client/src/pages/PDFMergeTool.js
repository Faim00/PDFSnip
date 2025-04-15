
import React, { useState } from 'react';
import axios from 'axios';
import './PDFMergeTool.css';

function PDFMergeTool() {
  const [files, setFiles] = useState([]);
  const [mergedFile, setMergedFile] = useState(null);

  const handleChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('pdfs', files[i]);
    }

    try {
      const res = await axios.post('http://localhost:5000/pdf/merge', formData, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setMergedFile(url);
    } catch (err) {
      console.error('Merge failed', err);
    }
  };

  return (
    <div className="page merge">
      <h2>Merge PDF Files</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" multiple onChange={handleChange} />
        <button type="submit">Merge PDFs</button>
      </form>
      {mergedFile && <a href={mergedFile} download="merged.pdf">Download Merged PDF</a>}
    </div>
  );
}

export default PDFMergeTool;