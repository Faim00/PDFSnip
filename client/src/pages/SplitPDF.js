import React, { useState } from 'react';
import axios from 'axios';

function SplitPDF() {
  const [file, setFile] = useState(null);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [splitLink, setSplitLink] = useState('');

  const handleSplit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('startPage', startPage);
    formData.append('endPage', endPage);

  //   try {
  //     const response = await axios.post('http://localhost:5000/pdf/split', formData, {
  //       responseType: 'blob',
  //     });

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     setSplitLink(url);
  //   } catch (err) {
  //     alert('Failed to split PDF');
  //     console.error(err);
  //   }
  // };
  try {
    const response = await axios.post('http://localhost:5000/pdf/split', formData, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'split_pages.zip');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    alert('Failed to split PDF');
  }
};

  return (
    <div className="container">
      <h2>Split PDF</h2>
      <form onSubmit={handleSplit}>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required />
        <input type="number" placeholder="Start Page" value={startPage} onChange={(e) => setStartPage(e.target.value)} required />
        <input type="number" placeholder="End Page" value={endPage} onChange={(e) => setEndPage(e.target.value)} required />
        <button type="submit">Split PDF</button>
      </form>

      {splitLink && (
        <a href={splitLink} download="split.pdf">Download Split PDF</a>
      )}
    </div>
  );
}

export default SplitPDF;
