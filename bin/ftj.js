#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs');

const csvConverter = require('../converters/csv-converter');
const excelConverter = require('../converters/excel-converter');

const program = new Command();

program
  .name('ftj')
  .description('Convert various file formats to JSON')
  .version('1.0.0');

program
  .command('csv')
  .description('Convert CSV files to JSON')
  .argument('<input>', 'Input CSV file path')
  .option('-o, --output <file>', 'Output JSON file (optional)')
  .option('-d, --delimiter <type>', 'Delimiter type: comma or semicolon', 'comma')
  .option('-p, --pretty', 'Format JSON with indentation')
  .action(async (input, options) => {
    try {
      await csvConverter.convert(input, options);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('excel')
  .description('Convert Excel files (.xlsx, .xls) to JSON')
  .argument('<input>', 'Input Excel file path')
  .option('-o, --output <file>', 'Output JSON file (optional)')
  .option('-s, --sheet <name>', 'Specific sheet name to convert (converts all sheets if not specified)')
  .option('-p, --pretty', 'Format JSON with indentation')
  .action(async (input, options) => {
    try {
      await excelConverter.convert(input, options);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('convert')
  .description('Auto-detect file type and convert to JSON')
  .argument('<input>', 'Input file path')
  .option('-o, --output <file>', 'Output JSON file (optional)')
  .option('-d, --delimiter <type>', 'CSV delimiter type: comma or semicolon', 'comma')
  .option('-s, --sheet <name>', 'Excel sheet name (if Excel file)')
  .option('-p, --pretty', 'Format JSON with indentation')
  .action(async (input, options) => {
    try {
      const ext = path.extname(input).toLowerCase();
      
      if (ext === '.csv') {
        await csvConverter.convert(input, options);
      } else if (ext === '.xlsx' || ext === '.xls') {
        await excelConverter.convert(input, options);
      } else {
        throw new Error(`Unsupported file type: ${ext}. Supported formats: .csv, .xlsx, .xls`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Display information about a file')
  .argument('<input>', 'Input file path')
  .action((input) => {
    try {
      if (!fs.existsSync(input)) {
        throw new Error(`File not found: ${input}`);
      }

      const stats = fs.statSync(input);
      const ext = path.extname(input).toLowerCase();
      const basename = path.basename(input);
      
      console.log('File Information:');
      console.log(`   Name: ${basename}`);
      console.log(`   Extension: ${ext}`);
      console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   Modified: ${stats.mtime.toLocaleString()}`);
      
      const supported = ['.csv', '.xlsx', '.xls'].includes(ext);
      console.log(`   Supported: ${supported ? 'Yes' : 'No'}`);
      
      if (supported) {
        console.log(`\nUsage suggestion:`);
        if (ext === '.csv') {
          console.log(`   file-to-json csv "${input}" --pretty`);
        } else {
          console.log(`   file-to-json excel "${input}" --pretty`);
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}