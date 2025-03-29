
export const generatePdfReport = async (
  result: any, 
  type: 'text' | 'file'
): Promise<string> => {
  // In a real-world scenario, we would use a library like jsPDF to generate a PDF
  // For this example, we will use a data URL to simulate a PDF download
  
  const fileName = type === 'file' 
    ? result.fileName || 'document-analysis.pdf'
    : 'text-analysis.pdf';
    
  const plagiarismScore = result.score || 0;
  const originalityScore = 100 - plagiarismScore;
  
  const timestamp = new Date().toLocaleString();
  
  // Create a simple HTML template for the report
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Plagiarism Analysis Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        .header { margin-bottom: 20px; }
        .summary { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
        .score { font-size: 24px; font-weight: bold; }
        .category { margin: 30px 0; }
        .item { margin: 15px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .plagiarized { border-left: 5px solid #ff4d4d; }
        .original { border-left: 5px solid #4caf50; }
        .source { color: #666; font-size: 12px; }
        .match { color: #ff4d4d; font-weight: bold; }
        .footer { margin-top: 40px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Plagiarism Analysis Report</h1>
        <p>Generated on: ${timestamp}</p>
        ${type === 'file' ? `<p>File name: ${result.fileName || 'Unknown'}</p>` : ''}
      </div>
      
      <div class="summary">
        <h2>Summary</h2>
        <p>Originality Score: <span class="score" style="color: #4caf50;">${originalityScore}%</span></p>
        <p>Plagiarism Score: <span class="score" style="color: ${plagiarismScore > 20 ? '#ff4d4d' : '#ff9800'};">${plagiarismScore}%</span></p>
        <p>Matched Sources: ${type === 'file' ? result.matches : (result.matches?.length || 0)}</p>
      </div>
      
      <div class="category">
        <h2 style="color: #ff4d4d;">Plagiarized Content</h2>
        ${renderPlagiarizedContent(result, type)}
      </div>
      
      <div class="category">
        <h2 style="color: #4caf50;">Original Content</h2>
        ${renderOriginalContent(result)}
      </div>
      
      <div class="footer">
        <p>This report was generated by PlagiaRight Plagiarism Detection Tool.</p>
        <p>© ${new Date().getFullYear()} PlagiaRight. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
  
  // Convert the HTML to a data URL
  const dataUrl = `data:application/pdf;base64,${btoa(unescape(encodeURIComponent(htmlContent)))}`;
  
  return dataUrl;
};

const renderPlagiarizedContent = (result: any, type: 'text' | 'file') => {
  const plagiarizedParts = type === 'file' ? result.plagiarizedParts : result.matches;
  
  if (!plagiarizedParts || plagiarizedParts.length === 0) {
    return '<p>No plagiarized content detected.</p>';
  }
  
  return plagiarizedParts.map((item: any, index: number) => `
    <div class="item plagiarized">
      <p><strong>Matched Text ${index + 1}:</strong></p>
      <p>"${item.text}"</p>
      <p class="match">${type === 'file' ? item.matchPercent : item.confidence}% match</p>
      ${item.source ? `<p class="source">Source: ${item.source}</p>` : ''}
    </div>
  `).join('');
};

const renderOriginalContent = (result: any) => {
  const originalContent = result.originalContent;
  
  if (!originalContent || originalContent.length === 0) {
    return '<p>No original content detected.</p>';
  }
  
  return originalContent.map((item: any, index: number) => `
    <div class="item original">
      <p><strong>Original Text ${index + 1}:</strong></p>
      <p>"${item.text}"</p>
      <p style="color: #4caf50;">${item.originalityPercent}% original</p>
    </div>
  `).join('');
};
