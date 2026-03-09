import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useToast } from '../hooks/useToast';
import { useProgress } from '../contexts/ProgressContext';
import { useLocation } from 'react-router-dom';

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onClear: () => void;
  onReset: () => void;
  executing: boolean;
}

const SQLEditor: React.FC<SQLEditorProps> = ({
  value,
  onChange,
  onRun,
  onClear,
  onReset,
  executing
}) => {
  const editorRef = useRef<any>(null);
  const { showSuccess, showError } = useToast();
  const { markAssignmentCompleted } = useProgress();
  const location = useLocation();

  // Get assignment ID from URL
  const getAssignmentId = () => {
    const match = location.pathname.match(/\/assignment\/(.+)/);
    return match ? match[1] : null;
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure SQL language features
    monaco.languages.setMonarchTokensProvider('sql', {
      tokenizer: {
        root: [
          [/\b(SELECT|FROM|WHERE|AND|OR|NOT|IN|LIKE|BETWEEN|IS|NULL|TRUE|FALSE)\b/, 'keyword'],
          [/\b(INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|VIEW)\b/, 'keyword'],
          [/\b(JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|AS|USING)\b/, 'keyword'],
          [/\b(GROUP|BY|HAVING|ORDER|ASC|DESC|LIMIT|OFFSET)\b/, 'keyword'],
          [/\b(COUNT|SUM|AVG|MIN|MAX|FIRST|LAST|UCASE|LCASE|MID|LEN|ROUND|NOW)\b/, 'function'],
          [/\b(INT|INTEGER|VARCHAR|CHAR|TEXT|DATE|DATETIME|DECIMAL|FLOAT|DOUBLE|BOOLEAN)\b/, 'type'],
          [/\b(PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|DEFAULT|AUTO_INCREMENT)\b/, 'keyword'],
          [/[0-9]+/, 'number'],
          [/[.,;()]/, 'delimiter'],
          [/'[^']*'/, 'string'],
          [/--.*$/, 'comment'],
          [/\/\*[\s\S]*?\*\//, 'comment']
        ]
      }
    });

    // Set editor options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: 'Fira Code, Monaco, Consolas, monospace',
      lineNumbers: 'on',
      renderLineHighlight: 'line',
      selectOnLineNumbers: true,
      automaticLayout: true,
      wordWrap: 'on',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      }
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      onClear();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
      onReset();
    });
  };

  const handleRunQuery = () => {
    if (!value.trim()) {
      showError('Please enter a SQL query');
      return;
    }
    
    if (!executing) {
      onRun();
      
      // Simulate success for demo (in real app, this would come from API response)
      setTimeout(() => {
        const assignmentId = getAssignmentId();
        if (assignmentId) {
          markAssignmentCompleted(assignmentId);
          showSuccess('Correct! Progress Saved');
        } else {
          showSuccess('Query executed successfully!');
        }
      }, 1000);
    }
  };

  return (
    <div className="editor-panel">
      <div className="editor-panel__controls">
        <div className="editor-panel__actions">
          <button
            className="editor-panel__run-button"
            onClick={handleRunQuery}
            disabled={executing || !value.trim()}
          >
            {executing ? (
              <>
                <div className="editor-panel__status-indicator editor-panel__status-indicator--loading"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Run Query</span>
              </>
            )}
          </button>
          
          <button
            className="editor-panel__clear-button"
            onClick={onClear}
            disabled={executing}
            title="Clear Editor (Ctrl+K)"
          >
            🗑️
          </button>
          
          <button
            className="editor-panel__reset-button"
            onClick={onReset}
            disabled={executing}
            title="Reset Editor (Ctrl+R)"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="editor-panel__editor-container">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: 'Fira Code, Monaco, Consolas, monospace',
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            automaticLayout: true,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            suggest: {
              showKeywords: true,
              showSnippets: true
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true
            }
          }}
        />
      </div>

      <div className="editor-panel__status">
        <div className={`editor-panel__status-indicator ${
          executing ? 'editor-panel__status-indicator--loading' : 
          value.trim() ? 'editor-panel__status-indicator--success' : ''
        }`}></div>
        <span>
          {executing ? 'Executing query...' : 
           value.trim() ? 'Ready to run' : 
           'Enter SQL query...'}
        </span>
        <span style={{ marginLeft: 'auto' }}>
          Lines: {value.split('\n').length} | 
          Characters: {value.length}
        </span>
      </div>
    </div>
  );
};

export default SQLEditor;
