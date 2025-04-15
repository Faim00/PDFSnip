const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

exports.mergePDFs = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length < 2) {
      return res.status(400).json({ error: 'At least two PDF files are required to merge.' });
    }

    const mergedPdf = await PDFDocument.create();

    for (let file of files) {
      const fileBuffer = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(fileBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = path.join('server/uploads', `merged-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, mergedPdfBytes);

    res.json({ file: outputPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to merge PDFs' });
  }
};

exports.splitPDF = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No PDF file uploaded.' });

    const pdfBuffer = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const outputPaths = [];
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const newPdfBytes = await newPdf.save();
      const outputPath = path.join('server/uploads', `page-${i + 1}-${Date.now()}.pdf`);
      fs.writeFileSync(outputPath, newPdfBytes);
      outputPaths.push(outputPath);
    }

    res.json({ files: outputPaths });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to split PDF' });
  }
};