document.addEventListener('DOMContentLoaded', function() {
    const statsModal = document.getElementById('statsModal');
    const statsViewBtn = document.getElementById('statsViewBtn');
  
    if (statsViewBtn) {
      statsViewBtn.addEventListener('click', showStats);
    }
  
    function showStats() {
      statsModal.classList.remove('hidden');
      renderCharts();
    }
  
    function closeStats() {
      statsModal.classList.add('hidden');
    }
  
    function renderCharts() {
      // Clear any existing charts
      const winningsChart = Chart.getChart('winningsChart');
      if (winningsChart) winningsChart.destroy();
      const placementsChart = Chart.getChart('placementsChart');
      if (placementsChart) placementsChart.destroy();
  
      // Get player data
      const rows = document.querySelectorAll('#leaderboard-body tr');
      const players = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return {
          name: cells[0].textContent.trim().replace(/[^\w\s]/g, '').trim(),
          games: parseInt(cells[1].textContent) || 0,
          rebuys: parseInt(cells[2].textContent) || 0,
          cashPlacements: parseInt(cells[3].textContent) || 0,
          wins: parseInt(cells[4].textContent) || 0,
          profit: parseInt(cells[5].textContent.replace(/[^-\d]/g, '')) || 0
        };
      });
  
      // Sort players by profit for better visualization
      players.sort((a, b) => b.profit - a.profit);
  
      // Winnings Chart
      new Chart(document.getElementById('winningsChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels: players.map(p => p.name),
          datasets: [{
            label: 'Profit (£)',
            data: players.map(p => p.profit),
            backgroundColor: players.map(p => p.profit >= 0 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'),
            borderColor: players.map(p => p.profit >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Player Profits',
              color: 'white',
              font: {
                size: 16
              }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'white'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: 'white'
              }
            }
          }
        }
      });
  
      // Placements Chart
      new Chart(document.getElementById('placementsChart').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: players.filter(p => p.cashPlacements > 0).map(p => p.name),
          datasets: [{
            data: players.filter(p => p.cashPlacements > 0).map(p => p.cashPlacements),
            backgroundColor: [
              'rgba(59, 130, 246, 0.6)',  // Blue
              'rgba(34, 197, 94, 0.6)',   // Green
              'rgba(245, 158, 11, 0.6)',  // Yellow
              'rgba(239, 68, 68, 0.6)',   // Red
              'rgba(139, 92, 246, 0.6)',  // Purple
              'rgba(236, 72, 153, 0.6)',  // Pink
              'rgba(75, 85, 99, 0.6)',    // Gray
              'rgba(14, 165, 233, 0.6)',  // Light Blue
              'rgba(168, 85, 247, 0.6)',  // Violet
              'rgba(234, 179, 8, 0.6)'    // Gold
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Cash Placements Distribution',
              color: 'white',
              font: {
                size: 16
              }
            },
            legend: {
              position: 'right',
              labels: {
                color: 'white',
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }
  
    // Close modal when clicking outside
    if (statsModal) {
      statsModal.addEventListener('click', (e) => {
        if (e.target === statsModal) {
          closeStats();
        }
      });
  
      // Add close button functionality
      const closeButton = statsModal.querySelector('button[onclick="closeStats()"]');
      if (closeButton) {
        closeButton.addEventListener('click', closeStats);
      }
    }
  
    // Make closeStats available globally
    window.closeStats = closeStats;
  });