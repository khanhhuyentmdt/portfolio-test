// Script to update the portfolio HTML file
const fs = require('fs');

// Read the original file
let html = fs.readFileSync('index_backup.html', 'utf8');

// 1. Update navigation to include DỰ ÁN
html = html.replace(
  /nav: \[\s*\{ label: 'TRANG CHỦ', href: '#home',\s*section: 'home'\s*\},\s*\{ label: 'KỸ NĂNG',\s*href: '#skills',\s*section: 'skills'\s*\},\s*\{ label: 'LIÊN HỆ',\s*href: '#contact', section: 'contact' \},/g,
  `nav: [
          { label: 'TRANG CHỦ', href: '#home',     section: 'home'     },
          { label: 'DỰ ÁN',     href: '#projects', section: 'projects' },
          { label: 'KỸ NĂNG',   href: '#skills',   section: 'skills'   },
          { label: 'LIÊN HỆ',   href: '#contact',  section: 'contact'  },
        ],`
);

// Save the modified file
fs.writeFileSync('index_new.html', html, 'utf8');
console.log('File updated successfully!');
