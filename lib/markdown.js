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

  // 3. Headings conversion (supporting optional leading whitespace and flexible formatting)
  html = html.replace(/^\s*###\s+(.*$)/gim, '<h3 class="text-base font-extrabold text-gray-900 dark:text-white mt-5 mb-2">$1</h3>');
  html = html.replace(/^\s*##\s+(.*$)/gim, '<h2 class="text-lg font-black text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-6 mb-3">$1</h2>');
  html = html.replace(/^\s*#\s+(.*$)/gim, '<h1 class="text-xl font-black text-gray-900 dark:text-white mt-8 mb-4">$1</h1>');

  // 4. Bold conversion
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-950 dark:text-white">$1</strong>');

  // 5. Unordered lists conversion
  // Match single bullet points and wrap them in <li> tags
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-sm text-gray-700 dark:text-gray-300">$1</li>');

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
  finalHtml = finalHtml.replace(/(<li[^>]*>.*?<\/li>(\s*\n\s*<li[^>]*>.*?<\/li>)*)/gs, '<ul class="space-y-1.5 my-4">$1</ul>');

  return finalHtml;
}
