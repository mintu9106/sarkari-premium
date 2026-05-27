/**
 * A lightweight, dependency-free Markdown parser that converts basic markdown
 * (headings, bold, lists, and tables) into sanitized HTML strings.
 * Perfect for server components in Next.js.
 */
export function renderMarkdown(md) {
  if (!md) return "";

  // 1. Basic HTML sanitization (escape tags to prevent XSS, but let us safely generate our own)
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Normalize line endings (strip carriage returns completely)
  html = html.replace(/\r/g, "");

  // 3. Headings conversion (supporting H1 to H6 dynamically and removing trailing hashes)
  for (let level = 6; level >= 1; level--) {
    const hashes = '#'.repeat(level);
    // Matches "^### Title ###" or "^### Title"
    const regex = new RegExp(`^\\s*${hashes}\\s+(.*?)(?:\\s*${hashes})?\\s*$`, 'gim');
    const classes = {
      1: 'text-xl font-black text-gray-900 dark:text-white mt-8 mb-4',
      2: 'text-lg font-black text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-6 mb-3',
      3: 'text-base font-extrabold text-gray-900 dark:text-white mt-5 mb-2',
      4: 'text-sm font-bold text-gray-900 dark:text-white mt-4 mb-2',
      5: 'text-sm font-semibold text-gray-800 dark:text-gray-205 mt-3 mb-1',
      6: 'text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2 mb-1'
    }[level];
    html = html.replace(regex, `<h${level} class="${classes}">$1</h${level}>`);
  }

  // 4. Bold conversion
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-950 dark:text-white">$1</strong>');

  // 5. Unordered lists conversion
  // Match single bullet points (dashes or asterisks) and wrap them in <li> tags
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');

  // 6. Table Parser
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = "";
  const resultLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if the line is part of a markdown table
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        // Start table tag
        tableHtml = '<div class="overflow-x-auto my-6 border border-gray-205 dark:border-gray-800 rounded-xl shadow-sm"><table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse">';
        // Parse header
        const cols = line.split('|').slice(1, -1).map(c => c.trim());
        tableHtml += '<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-850 dark:text-gray-300 border-b border-gray-200 dark:border-gray-850"><tr>';
        cols.forEach(col => {
          tableHtml += `<th scope="col" class="px-6 py-3 font-bold">${col}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
      } else {
        // Skip separator line (e.g. |---|---|)
        if (line.replace(/[\s-:|]/g, '') === '') {
          continue;
        }
        // Parse table row
        const cols = line.split('|').slice(1, -1).map(c => c.trim());
        tableHtml += '<tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">';
        cols.forEach(col => {
          tableHtml += `<td class="px-6 py-4 text-xs font-semibold text-gray-800 dark:text-gray-200">${col}</td>`;
        });
        tableHtml += '</tr>';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table></div>';
        resultLines.push(tableHtml);
        tableHtml = "";
      }
      resultLines.push(lines[i]);
    }
  }

  // Close table if file ends with table
  if (inTable) {
    tableHtml += '</tbody></table></div>';
    resultLines.push(tableHtml);
  }

  // Assemble back and group adjacent lists inside <ul>
  let finalHtml = resultLines.join('\n');
  
  // Replace sequential <li> tags with <ul><li>...</li></ul>
  // A simple regex match handles wrapping lists
  finalHtml = finalHtml.replace(/(<li[^>]*>.*?<\/li>(\s*\n\s*<li[^>]*>.*?<\/li>)*)/gs, '<ul class="markdown-list">$1</ul>');

  return finalHtml;
}

/**
 * Strips sections (headings and their content) from markdown text based on keyword matches in heading titles.
 */
export function stripSections(md, keywords = []) {
  if (!md) return "";
  const lines = md.split('\n');
  const resultLines = [];
  let skipping = false;
  let skipHeadingLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimLine = line.trim();

    // Check if it is a heading (supporting H1 to H6)
    const headingMatch = trimLine.match(/^(\s*)(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const hashes = headingMatch[2];
      const level = hashes.length;
      // Strip trailing hashes if present
      let title = headingMatch[3].trim();
      if (title.endsWith(hashes)) {
        title = title.substring(0, title.length - hashes.length).trim();
      }
      title = title.toLowerCase();

      // Check if this heading matches any of the forbidden keywords
      const matchesKeyword = keywords.some(k => title.includes(k.toLowerCase()));

      if (matchesKeyword) {
        skipping = true;
        skipHeadingLevel = level;
        continue; // Skip this heading line
      } else if (skipping) {
        // Stop skipping if we hit a heading of equal or higher importance (level <= skipHeadingLevel)
        if (level <= skipHeadingLevel) {
          skipping = false;
        }
      }
    }

    if (!skipping) {
      resultLines.push(line);
    }
  }

  return resultLines.join('\n');
}
