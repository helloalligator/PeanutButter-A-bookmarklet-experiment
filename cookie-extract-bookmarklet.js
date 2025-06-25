(function() {
  // Remove existing overlay if present
  const existing = document.getElementById('cookie-poetic-overlay');
  if (existing) existing.remove();

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #cookie-poetic-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(245, 240, 255, 0.92);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Georgia', serif;
      animation: fadeIn 1s;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .cookie-poetic-header {
      font-size: 1.5em;
      margin-bottom: 1em;
      color: #6a4e7c;
      font-family: 'Georgia', serif;
      text-align: center;
      text-shadow: 0 2px 8px #fff8, 0 1px 0 #e9d8f4;
    }
    .cookie-poetic-table {
      background: #fff8fc;
      border-radius: 18px;
      box-shadow: 0 8px 32px #6a4e7c22;
      padding: 1.5em 2em;
      margin-bottom: 1em;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 420px;
      font-family: 'Fira Mono', 'Consolas', monospace;
      font-size: 1em;
      transition: box-shadow 0.3s;
    }
    .cookie-poetic-table th, .cookie-poetic-table td {
      padding: 0.5em 1em;
      border-bottom: 1px solid #e9d8f4;
      text-align: left;
    }
    .cookie-poetic-table th {
      color: #a084ca;
      font-weight: bold;
      background: #f3eaff;
      font-family: 'Georgia', serif;
    }
    .cookie-poetic-table tr:last-child td {
      border-bottom: none;
    }
    .cookie-poetic-footer {
      margin-top: 1em;
      color: #6a4e7c;
      font-size: 1.1em;
      font-family: 'Georgia', serif;
      text-align: center;
      cursor: pointer;
      user-select: none;
      transition: color 0.2s;
    }
    .cookie-poetic-footer:hover {
      color: #a084ca;
      text-decoration: underline wavy #a084ca;
    }
    .cookie-glitch {
      animation: glitch 0.4s;
      color: #fff;
      background: #a084ca;
      text-shadow: 2px 0 #f3eaff, -2px 0 #6a4e7c;
    }
    @keyframes glitch {
      0% { transform: translateX(0); }
      20% { transform: translateX(-2px) skewX(-8deg); }
      40% { transform: translateX(2px) skewX(8deg); }
      60% { transform: translateX(-1px) skewX(-4deg); }
      80% { transform: translateX(1px) skewX(4deg); }
      100% { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'cookie-poetic-overlay';

  // Header
  const header = document.createElement('div');
  header.className = 'cookie-poetic-header';
  header.textContent = 'What is hidden, now revealed. The crumbs of your passage, gathered here.';
  overlay.appendChild(header);

  // --- Cookie Extraction Functions ---
  function extractFromTables() {
    // Heuristics: look for tables with headers like name, purpose, provider, duration
    const headerKeywords = [
      ['name', 'cookie'],
      ['purpose', 'use', 'usage'],
      ['provider', 'domain', 'host'],
      ['duration', 'expiry', 'expires', 'retention']
    ];
    const tables = Array.from(document.querySelectorAll('table'));
    let found = [];
    tables.forEach(table => {
      const ths = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim().toLowerCase());
      // Check if at least 2 header groups are present
      let matches = 0;
      headerKeywords.forEach(group => {
        if (group.some(keyword => ths.some(h => h.includes(keyword)))) matches++;
      });
      if (matches >= 2) {
        // Map header index to field
        const map = {};
        ths.forEach((h, i) => {
          if (headerKeywords[0].some(k => h.includes(k))) map.name = i;
          if (headerKeywords[1].some(k => h.includes(k))) map.purpose = i;
          if (headerKeywords[2].some(k => h.includes(k))) map.provider = i;
          if (headerKeywords[3].some(k => h.includes(k))) map.duration = i;
        });
        Array.from(table.querySelectorAll('tbody tr')).forEach(tr => {
          const tds = Array.from(tr.querySelectorAll('td'));
          if (tds.length >= 2) {
            found.push({
              name: tds[map.name]?.textContent.trim() || '',
              purpose: tds[map.purpose]?.textContent.trim() || '',
              provider: tds[map.provider]?.textContent.trim() || '',
              duration: tds[map.duration]?.textContent.trim() || ''
            });
          }
        });
      }
    });
    return found;
  }

  function extractFromDocumentCookie() {
    // Parse document.cookie string
    return document.cookie.split(';').map(c => {
      const [name, ...rest] = c.split('=');
      return name.trim() ? {
        name: name.trim(),
        purpose: '(browser cookie)',
        provider: window.location.hostname,
        duration: '(session or as set)'
      } : null;
    }).filter(Boolean);
  }

  function extractFromJSONLD() {
    // Look for <script type="application/ld+json"> and try to find cookie info
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    let found = [];
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        // Heuristic: look for arrays of objects with cookie-like fields
        const arrs = Array.isArray(data) ? [data] : Object.values(data).filter(Array.isArray);
        arrs.forEach(arr => {
          arr.forEach(obj => {
            if (obj && typeof obj === 'object' && (
              obj.name && (obj.purpose || obj.description)
            )) {
              found.push({
                name: obj.name || '',
                purpose: obj.purpose || obj.description || '',
                provider: obj.provider || obj.domain || '',
                duration: obj.duration || obj.expiry || ''
              });
            }
          });
        });
      } catch (e) {}
    });
    return found;
  }

  // --- Gather and deduplicate cookies ---
  let cookies = [
    ...extractFromTables(),
    ...extractFromDocumentCookie(),
    ...extractFromJSONLD()
  ];
  // Deduplicate by name+provider
  const seen = new Set();
  cookies = cookies.filter(c => {
    const key = c.name + '|' + c.provider;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!cookies.length) {
    cookies = [{
      name: '(none found)',
      purpose: 'No cookies or policy tables detected on this page.',
      provider: '',
      duration: ''
    }];
  }

  // Table
  const table = document.createElement('table');
  table.className = 'cookie-poetic-table';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Name</th><th>Purpose</th><th>Provider</th><th>Duration</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  cookies.forEach(row => {
    const tr = document.createElement('tr');
    ['name', 'purpose', 'provider', 'duration'].forEach(key => {
      const td = document.createElement('td');
      td.textContent = row[key];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  overlay.appendChild(table);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'cookie-poetic-footer';
  footer.textContent = 'To close, draw the veil.';
  footer.onclick = () => overlay.remove();
  overlay.appendChild(footer);

  document.body.appendChild(overlay);

  // Glitch effect: randomly glitch a cell every 2-4 seconds
  function glitchCell() {
    const cells = overlay.querySelectorAll('.cookie-poetic-table td');
    if (!cells.length) return;
    const cell = cells[Math.floor(Math.random() * cells.length)];
    cell.classList.add('cookie-glitch');
    setTimeout(() => cell.classList.remove('cookie-glitch'), 400);
    setTimeout(glitchCell, 2000 + Math.random() * 2000);
  }
  setTimeout(glitchCell, 2000);
})(); 