const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Convert CSV file to JSON
 */
async function convert(inputFile, options = {}) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    if (!fs.existsSync(inputFile)) {
      reject(new Error(`Input file not found: ${inputFile}`));
      return;
    }

    let outputFile = options.output;
    if (!outputFile) {
      const ext = path.extname(inputFile);
      outputFile = path.basename(inputFile, ext) + '.json';
    }

    let delimiter = ',';
    if (options.delimiter) {
      const delimiterType = options.delimiter.toLowerCase();
      if (delimiterType === 'semicolon' || delimiterType === 'semi') {
        delimiter = ';';
      } else if (delimiterType === 'comma') {
        delimiter = ',';
      } else {
        reject(new Error('Invalid delimiter type. Use "comma" or "semicolon"'));
        return;
      }
    }

    const delimiterName = delimiter === ';' ? 'semicolon' : 'comma';
    console.log(`Converting CSV to JSON...`);
    console.log(`   Input: ${inputFile}`);
    console.log(`   Output: ${outputFile}`);
    console.log(`   Delimiter: ${delimiterName}`);

    fs.createReadStream(inputFile)
      .pipe(csv({separator: delimiter}))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        try {
          const jsonString = options.pretty 
            ? JSON.stringify(results, null, 2)
            : JSON.stringify(results);

          fs.writeFileSync(outputFile, jsonString, 'utf8');
          
          console.log('Conversion completed successfully!');
          console.log(`   Rows converted: ${results.length}`);
          console.log(`   File size: ${(jsonString.length / 1024).toFixed(2)} KB`);
          console.log(`   Saved to: ${path.resolve(outputFile)}`);
          
          resolve(results);
        } catch (error) {
          reject(new Error(`Error writing output file: ${error.message}`));
        }
      })
      .on('error', (error) => {
        reject(new Error(`Error reading CSV file: ${error.message}`));
      });
  });
}

module.exports = {
  convert
};