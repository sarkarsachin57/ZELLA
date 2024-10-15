import path from 'path';
import fs from 'fs';
import mime from 'mime-types'; // To determine the correct content type

export default async function handler(req, res) {
  const { filePath } = req.query;  // Get the file path from query parameters

  if (!filePath) {
    return res.status(400).json({ error: 'File path is required.' });
  }

  try {
    const absolutePath = path.join(process.cwd(), 'backend', filePath); // Adjust this to match your backend directory structure
    console.log("absolutePath: ", absolutePath);

    // Normalize the path to handle different OS environments
    const normalizedPath = path.normalize(absolutePath);
    console.log("Normalized Path: ", normalizedPath);

    // Optionally replace '/frontend' with an empty string if needed for your structure
    const modifiedPath = normalizedPath.replace(`${path.sep}frontend`, '');
    console.log("Modified Path: ", modifiedPath);

    if (!fs.existsSync(modifiedPath)) {
      return res.status(404).json({ error: 'File not found.' });
    }

    const stat = fs.statSync(modifiedPath);
    const mimeType = mime.lookup(modifiedPath);  // Get the correct mime type

    // Set headers to trigger the file download
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);

    const fileStream = fs.createReadStream(modifiedPath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Error downloading the file.' });
  }
}
