import type { ChartOptions } from 'chart.js';

export const doughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgb(107, 114, 128)',
        padding: 20,
        font: {
          size: 12
        }
      }
    }
  }
};

export const barOptions: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 7,
      grid: {
        color: 'rgba(107, 114, 128, 0.1)'
      },
      ticks: {
        color: 'rgb(107, 114, 128)',
        callback: (value) => value.toFixed(1)
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        color: 'rgb(107, 114, 128)',
        font: {
          size: 12
        }
      }
    }
  }
};