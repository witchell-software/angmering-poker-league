document.addEventListener('DOMContentLoaded', function() {
    // Get the table elements
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) {
      console.error('Could not find tbody with id "leaderboard-body"');
      return;
    }
    
    const sortableHeaders = document.querySelectorAll('th.sortable');
    let currentSort = {
      column: 'profit',
      ascending: false
    };
  
    // Add click handlers to all sortable headers
    sortableHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const column = header.dataset.sort;
        
        // If clicking the same column, reverse the sort direction
        if (currentSort.column === column) {
          currentSort.ascending = !currentSort.ascending;
        } else {
          currentSort.column = column;
          currentSort.ascending = true;
        }
  
        // Update sort icons
        updateSortIcons(header);
        
        // Perform the sort
        sortTable(column, currentSort.ascending);
      });
    });
  
    function updateSortIcons(activeHeader) {
      // Remove sort classes from all headers
      sortableHeaders.forEach(header => {
        header.classList.remove('sort-asc');
      });
      
      // Add sort class to active header if ascending
      if (currentSort.ascending) {
        activeHeader.classList.add('sort-asc');
      }
    }
  
    function sortTable(column, ascending) {
      const rows = Array.from(tbody.getElementsByTagName('tr'));
  
      const columnIndex = {
        'player': 0,
        'games': 1,
        'rebuys': 2,
        'cashPlacements': 3,
        'wins': 4,
        'profit': 5
      }[column];
  
      rows.sort((a, b) => {
        const cellA = a.cells[columnIndex];
        const cellB = b.cells[columnIndex];
        
        if (!cellA || !cellB) {
          console.error('Could not find cells for comparison');
          return 0;
        }
  
        let valueA = cellA.textContent.trim();
        let valueB = cellB.textContent.trim();
  
        // For player names, remove emojis and special characters
        if (column === 'player') {
          valueA = valueA.replace(/[^\w\s]/g, '').trim();
          valueB = valueB.replace(/[^\w\s]/g, '').trim();
          return ascending ? 
            valueA.localeCompare(valueB) : 
            valueB.localeCompare(valueA);
        } else {
          // For numeric columns, parse the numbers
          valueA = parseInt(valueA.replace(/[^-\d]/g, '')) || 0;
          valueB = parseInt(valueB.replace(/[^-\d]/g, '')) || 0;
          return ascending ? valueA - valueB : valueB - valueA;
        }
      });
  
      // Remove all existing rows
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
  
      // Add sorted rows
      rows.forEach(row => tbody.appendChild(row));
    }
  
    // Initial sort by profit (descending)
    const profitHeader = document.querySelector('th[data-sort="profit"]');
    if (profitHeader) {
      sortTable('profit', false);
      updateSortIcons(profitHeader);
    }
  });