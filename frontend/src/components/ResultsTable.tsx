interface ResultsTableProps {
  results: any;
  loading: boolean;
}

function ResultsTable({ results, loading }: ResultsTableProps) {
  // TODO: Add better error handling for malformed results
  if (loading) {
    return (
      <div className="results-table__container">
        <div className="results-table__loading">
          <div className="results-table__loading-spinner"></div>
          <p>Executing query...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-table__container">
        <div className="results-table__empty">
          <div className="results-table__empty-icon">📊</div>
          <h3 className="results-table__empty-title">No Results</h3>
          <p className="results-table__empty-description">
            Write and run a SQL query to see results here.
          </p>
        </div>
      </div>
    );
  }

  // Handle error case
  if (results.error) {
    return (
      <div className="results-table__container">
        <div className="results-table__error">
          <div className="results-table__error-title">
            <span>❌</span>
            Query Error
          </div>
          <div className="results-table__error-message">
            {results.error}
          </div>
        </div>
      </div>
    );
  }

  if (!results.columns || results.columns.length === 0) {
    return (
      <div className="results-table__container">
        <div className="results-table__empty">
          <div className="results-table__empty-icon">✅</div>
          <h3 className="results-table__empty-title">Query Executed Successfully</h3>
          <p className="results-table__empty-description">
            Query executed successfully but returned no results.
          </p>
        </div>
      </div>
    );
  }

  const getDataTypeClass = (value: any) => {
    if (value === null) return 'results-table__td--null';
    if (typeof value === 'number') return 'results-table__td--number';
    if (typeof value === 'boolean') return 'results-table__td--boolean';
    if (typeof value === 'string') {
      // Check if it's a date
      if (!isNaN(Date.parse(value)) && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        return 'results-table__td--date';
      }
      // Check if it's a long string that should be truncated
      if (value.length > 50) return 'results-table__td--truncate';
      return 'results-table__td--string';
    }
    return 'results-table__td--string';
  };

  const formatValue = (value: any) => {
    if (value === null) return 'NULL';
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  const exportToCSV = () => {
    if (!results.columns || !results.rows) return;

    const headers = results.columns.join(',');
    const rows = results.rows.map((row: any[]) => 
      row.map(cell => {
        const value = formatValue(cell);
        // Escape quotes and wrap in quotes if contains comma or quote
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ).join('\n');

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_results_${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!results.columns || !results.rows) return;

    const headers = results.columns.join('\t');
    const rows = results.rows.map((row: any[]) => 
      row.map(cell => formatValue(cell)).join('\t')
    ).join('\n');

    const text = [headers, ...rows].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      // Could show a toast notification here
      console.log('Results copied to clipboard');
    });
  };

  return (
    <div className="results-table__container">
      <div className="results-table__header">
        <h3 className="results-table__title">Query Results</h3>
        <div className="results-table__stats">
          <div className="results-table__stat">
            <span>📊</span>
            <span>{results.rowCount} rows</span>
          </div>
          <div className="results-table__stat">
            <span>⏱️</span>
            <span>{results.executionTime || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="results-table__content">
        <table className="results-table__table">
          <thead className="results-table__thead">
            <tr>
              {results.columns.map((column: string, index: number) => (
                <th key={index} className="results-table__th">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="results-table__tbody">
            {results.rows.map((row: any[], rowIndex: number) => (
              <tr key={rowIndex} className="results-table__tr">
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className={`results-table__td ${getDataTypeClass(cell)}`}
                  >
                    {formatValue(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="results-table__actions">
        <button 
          className="results-table__action-button"
          onClick={copyToClipboard}
        >
          📋 Copy Results
        </button>
        <button 
          className="results-table__export-button"
          onClick={exportToCSV}
        >
          📥 Export CSV
        </button>
      </div>
    </div>
  );
};

export default ResultsTable;
