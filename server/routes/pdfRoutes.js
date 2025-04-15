const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const archiver = require('archiver');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/merge', upload.array('pdfs'), async (req, res) => {
  try {
    const mergedPdf = await PDFDocument.create();

    for (let file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      fs.unlinkSync(file.path);
    }

    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = path.join(__dirname, '..', 'uploads', 'merged.pdf');
    fs.writeFileSync(outputPath, mergedPdfBytes);

    res.download(outputPath, 'merged.pdf', () => {
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to merge PDFs');
  }
});

router.post('/split', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();

    const zip = new (require('adm-zip'))();

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const newPdfBytes = await newPdf.save();

      zip.addFile(`page_${i + 1}.pdf`, Buffer.from(newPdfBytes));
    }

    fs.unlinkSync(filePath); // Delete uploaded file

    const zipPath = path.join(__dirname, '../uploads/split_pages.zip');
    zip.writeZip(zipPath);

    res.download(zipPath, 'split_pages.zip', () => {
      fs.unlinkSync(zipPath); // Clean up zip file after sending
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error splitting PDF');
  }
});


module.exports = router;
