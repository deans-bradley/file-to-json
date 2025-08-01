# File to JSON Converter

A powerful and flexible Node.js CLI tool that converts various file formats to JSON with clean, well-structured output.

## Features

- **Multiple formats** - Convert CSV and Excel files (.xlsx, .xls) to JSON
- **Smart detection** - Auto-detect file types or use specific commands
- **Data cleaning** - Automatically trims whitespace and handles empty cells
- **Flexible output** - Custom filenames, pretty formatting, and sheet selection
- **Fast processing** - Efficient streaming for large files
- **Professional CLI** - Built with Commander.js for excellent UX
- **Clear feedback** - Detailed progress and conversion statistics

## Installation

1. **Clone or download** the project files
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Make executable (optional):**
   ```bash
   chmod +x bin/ftj.js
   ```

## Usage

### CSV Conversion

Convert comma or semicolon-delimited CSV files to JSON:

```bash
# Basic CSV conversion
ftj csv data.csv

# Custom output with pretty formatting
ftj csv employees.csv -o staff.json --pretty

# Semicolon-delimited CSV
ftj csv european-data.csv --delimiter comma --pretty
```

### Excel Conversion

Convert Excel workbooks (.xlsx, .xls) to JSON:

```bash
# Convert all sheets
ftj excel workbook.xlsx --pretty

# Convert specific sheet
ftj excel sales-data.xlsx --sheet "Q4 Results" -o q4.json

# Custom output file
ftj excel report.xlsx -o converted-report.json --pretty
```

### Auto-Detection

Let the tool detect the file type automatically:

```bash
# Auto-detect and convert
ftj convert data.csv --pretty
ftj convert spreadsheet.xlsx --sheet "Summary"
```

### File Information

Get detailed information about your files:

```bash
# Check file details and get usage suggestions
ftj info myfile.xlsx
ftj info data.csv
```

## Command Reference

### `csv` - Convert CSV files

| Option               | Short | Description                                 |
|----------------------|-------|---------------------------------------------|
| `--output <file>`    | `-o`  | Specify output JSON file                    |
| `--delimiter <type>` | `-d`  | Delimiter: `semicolon` (default) or `comma` |
| `--pretty`           | `-p`  | Format JSON with indentation                |

### `excel` - Convert Excel files

| Option            | Short | Description                                            |
|-------------------|-------|--------------------------------------------------------|
| `--output <file>` | `-o`  | Specify output JSON file                               |
| `--sheet <name>`  | `-s`  | Convert specific sheet (converts all if not specified) |
| `--pretty`        | `-p`  | Format JSON with indentation                           |

### `convert` - Auto-detect and convert

| Option               | Short | Description                      |
|----------------------|-------|----------------------------------|
| `--output <file>`    | `-o`  | Specify output JSON file         |
| `--delimiter <type>` | `-d`  | CSV delimiter (if CSV file)      |
| `--sheet <name>`     | `-s`  | Excel sheet name (if Excel file) |
| `--pretty`           | `-p`  | Format JSON with indentation     |

### `info` - File information

Displays file details, supported status, and usage suggestions.

## Examples

### CSV Example

**Input (employees.csv):**
```csv
name;age;department;salary
John Doe;30;Engineering;75000
Jane Smith;28;Marketing;65000
Bob Johnson;35;Engineering;80000
```

**Command:**
```bash
ftj csv employees.csv --pretty
```

**Output (employees.json):**
```json
[
  {
    "name": "John Doe",
    "age": "30",
    "department": "Engineering",
    "salary": "75000"
  },
  {
    "name": "Jane Smith",
    "age": "28",
    "department": "Marketing",
    "salary": "65000"
  },
  {
    "name": "Bob Johnson",
    "age": "35",
    "department": "Engineering",
    "salary": "80000"
  }
]
```

### Excel Example

**Input:** Excel file with multiple sheets (Sales, Inventory, Staff)

**Command:**
```bash
ftj excel company-data.xlsx --sheet "Sales" --pretty
```

**Output:** JSON object with data from the "Sales" sheet

**Convert all sheets:**
```bash
ftj excel company-data.xlsx --pretty
```

**Output:** JSON object with all sheets as separate properties:
```json
{
  "Sales": [
    { "product": "Widget A", "revenue": 5000 }
  ],
  "Inventory": [
    { "item": "Widget A", "stock": 150 }
  ],
  "Staff": [
    { "name": "John Doe", "role": "Manager" }
  ]
}
```

## Supported File Types

| Format    | Extensions      | Features                                                       |
|-----------|-----------------|----------------------------------------------------------------|
| **CSV**   | `.csv`          | Comma/semicolon delimiters, header detection, data cleaning    |
| **Excel** | `.xlsx`, `.xls` | Multiple sheets, sheet selection, cell formatting preservation |

## File Structure

```
file-to-json/
├── bin/
│   └── ftj.js                 # Main CLI application
├── converters/
│   ├── csv-converter.js       # CSV conversion logic
│   └── excel-converter.js     # Excel conversion logic
├── package.json               # Project configuration
└── README.md                  # Documentation
```

## Global Installation (Optional)

Install globally to use from anywhere on your system:

```bash
# Install globally
npm install -g .

# Use from any directory
ftj csv ~/Documents/data.csv --pretty
ftj excel ~/Downloads/report.xlsx --sheet "Summary"
```

## Path Handling

The tool works with both relative and absolute paths:

```bash
# Same directory
ftj csv data.csv

# Relative path
ftj csv ../documents/data.csv

# Absolute path (Windows)
ftj csv "C:\Users\brad\Documents\data.csv"

# Absolute path (Unix/Mac)
ftj csv /home/user/documents/data.csv
```

**Tip:** If your file path contains spaces, wrap it in quotes!

## Data Processing

### CSV Processing
- Automatically detects and cleans headers
- Trims whitespace from all values
- Skips empty rows
- Supports both comma (`,`) and semicolon (`;`) delimiters
- Each row becomes a JSON object in an array

### Excel Processing
- Processes all sheets or specific sheets
- Cleans column headers and cell values
- Handles empty cells gracefully
- Maintains data types where possible
- Multiple sheets become separate JSON properties

## Troubleshooting

**File not found:**
- Check the file path and ensure the file exists
- Use quotes around paths with spaces

**Permission denied:**
- Make the script executable: `chmod +x bin/ftj.js`
- Check file permissions for input/output directories

**Excel sheet not found:**
- Use `ftj info file.xlsx` to see available sheet names
- Sheet names are case-sensitive

**Wrong CSV output:**
- Try `--delimiter comma`
- Check if your CSV uses a different delimiter

**Memory issues with large files:**
- The tool streams data efficiently, but very large Excel files may need more memory
- Consider converting one sheet at a time for huge workbooks

## Requirements

- **Node.js** 14.0 or higher
- **npm** for package management

## Dependencies

- `commander` (^14.0.0) - Professional CLI framework
- `csv-parser` (^3.2.0) - Robust CSV parsing
- `xlsx` (^0.18.5) - Excel file processing

## Contributing

This tool is designed to be extensible! Ideas for future enhancements:

- **Additional formats**: JSON to other formats, TSV files, XML conversion
- **Data transformation**: Type conversion, field mapping, filtering
- **Advanced Excel features**: Formula evaluation, cell styling preservation
- **Performance**: Progress bars, parallel processing for multiple files
- **Validation**: Schema validation, data quality checks

## License

MIT License - Feel free to use and modify as needed.

## Getting Help

```bash
# General help
ftj --help

# Command-specific help
ftj csv --help
ftj excel --help

# File information and suggestions
ftj info your-file.csv
```