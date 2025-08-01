const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

/**
 * Convert Excel file to JSON
 */
async function convert(inputFile, options = {}) {
  try {
    // Validate input file
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    let outputFile = options.output;
    if (!outputFile) {
      const ext = path.extname(inputFile);
      outputFile = path.basename(inputFile, ext) + '.json';
    }

    console.log(`Converting Excel to JSON...`);
    console.log(`   Input: ${inputFile}`);
    console.log(`   Output: ${outputFile}`);

    const workbook = XLSX.readFile(inputFile);
    const sheetNames = workbook.SheetNames;
    
    console.log(`   Available sheets: ${sheetNames.join(', ')}`);

    let result = {};
    let totalRows = 0;

    if (options.sheet) {
      if (!sheetNames.includes(options.sheet)) {
        throw new Error(`Sheet "${options.sheet}" not found. Available sheets: ${sheetNames.join(', ')}`);
      }
      
      console.log(`Converting sheet: ${options.sheet}`);
      const worksheet = workbook.Sheets[options.sheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: ''
      });

      const processedData = cleanSheetData(jsonData);
      result = processedData;
      totalRows = processedData.length;
      
    } else {
      console.log(`Converting all sheets...`);
      
      for (const sheetName of sheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: ''
        });
        
        const processedData = cleanSheetData(jsonData);
        result[sheetName] = processedData;
        totalRows += processedData.length;
        
        console.log(`      ✓ ${sheetName}: ${processedData.length} rows`);
      }
    }

    // Convert to JSON string
    const jsonString = options.pretty 
      ? JSON.stringify(result, null, 2)
      : JSON.stringify(result);

    // Write to output file
    fs.writeFileSync(outputFile, jsonString, 'utf8');
    
    console.log('Conversion completed successfully!');
    console.log(`   Total rows converted: ${totalRows}`);
    console.log(`   File size: ${(jsonString.length / 1024).toFixed(2)} KB`);
    console.log(`   Saved to: ${path.resolve(outputFile)}`);

    return result;

  } catch (error) {
    throw new Error(`Excel conversion failed: ${error.message}`);
  }
}

/**
 * Clean and process sheet data
 */
function cleanSheetData(rawData) {
  if (rawData.length === 0) return [];
  
  const headers = rawData[0].map(header => 
    typeof header === 'string' ? header.trim() : String(header || '')
  );
  
  if (headers.every(h => h === '')) return [];
  
  const processedRows = [];
  
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    
    if (!row || row.every(cell => cell === '' || cell == null)) continue;
    
    const rowObject = {};
    let hasData = false;
    
    headers.forEach((header, index) => {
      if (header) {
        let cellValue = row[index];
        
        if (cellValue != null) {
          if (typeof cellValue === 'string') {
            cellValue = cellValue.trim();
          }
          rowObject[header] = cellValue;
          if (cellValue !== '') hasData = true;
        } else {
          rowObject[header] = '';
        }
      }
    });
    
    if (hasData) {
      processedRows.push(rowObject);
    }
  }
  
  return processedRows;
}

/**
 * Get information about an Excel file
 */
function getFileInfo(inputFile) {
  try {
    const workbook = XLSX.readFile(inputFile);
    const info = {
      sheets: [],
      totalSheets: workbook.SheetNames.length
    };
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      const rowCount = Math.max(0, range.e.r - range.s.r);
      const colCount = Math.max(0, range.e.c - range.s.c + 1);
      
      info.sheets.push({
        name: sheetName,
        rows: rowCount,
        columns: colCount
      });
    });
    
    return info;
  } catch (error) {
    throw new Error(`Cannot read Excel file: ${error.message}`);
  }
}

module.exports = {
  convert,
  getFileInfo
};