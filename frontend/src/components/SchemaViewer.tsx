import React from 'react';

interface SchemaViewerProps {
  schema: any;
  sampleData: any;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ schema, sampleData }) => {
  if (!schema || !schema.tables) {
    return (
      <div className="schema-viewer__empty">
        No schema information available
      </div>
    );
  }

  const getConstraintClass = (constraint: string) => {
    switch (constraint.toLowerCase()) {
      case 'primary key':
        return 'schema-viewer__constraint--primary-key';
      case 'foreign key':
        return 'schema-viewer__constraint--foreign-key';
      case 'unique':
        return 'schema-viewer__constraint--unique';
      case 'not null':
        return 'schema-viewer__constraint--not-null';
      default:
        return '';
    }
  };

  return (
    <div className="schema-viewer">
      <div className="schema-viewer__content">
        <div className="schema-viewer__tables">
          {schema.tables.map((table: any, tableIndex: number) => (
            <div key={tableIndex} className="schema-viewer__table">
              <div className="schema-viewer__table-header">
                <h3 className="schema-viewer__table-name">{table.name}</h3>
                <div className="schema-viewer__table-info">
                  <div className="schema-viewer__table-stat">
                    <span>📊</span>
                    <span>{table.columns?.length || 0} columns</span>
                  </div>
                  {sampleData && sampleData[table.name] && (
                    <div className="schema-viewer__table-stat">
                      <span>📄</span>
                      <span>{sampleData[table.name].length} rows</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="schema-viewer__table-content">
                <table className="schema-viewer__columns">
                  <thead>
                    <tr>
                      <th className="schema-viewer__column-header">Column</th>
                      <th className="schema-viewer__column-header">Type</th>
                      <th className="schema-viewer__column-header">Constraints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns?.map((column: any, columnIndex: number) => (
                      <tr key={columnIndex}>
                        <td className="schema-viewer__column">
                          <span className="schema-viewer__column-name">{column.name}</span>
                        </td>
                        <td className="schema-viewer__column">
                          <span className="schema-viewer__column-type">{column.type}</span>
                        </td>
                        <td className="schema-viewer__column">
                          <div className="schema-viewer__column-constraints">
                            {column.constraints?.map((constraint: string, constraintIndex: number) => (
                              <span
                                key={constraintIndex}
                                className={`schema-viewer__constraint ${getConstraintClass(constraint)}`}
                              >
                                {constraint}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {sampleData && sampleData[table.name] && sampleData[table.name].length > 0 && (
                  <div className="schema-viewer__sample-data">
                    <h4 className="schema-viewer__sample-title">Sample Data</h4>
                    <table className="schema-viewer__sample-table">
                      <thead>
                        <tr>
                          {Object.keys(sampleData[table.name][0]).map((key) => (
                            <th key={key} className="schema-viewer__sample-th">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sampleData[table.name].slice(0, 3).map((row: any, rowIndex: number) => (
                          <tr key={rowIndex}>
                            {Object.values(row).map((value, valueIndex) => (
                              <td key={valueIndex} className="schema-viewer__sample-td">
                                {value === null ? 'NULL' : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchemaViewer;
