'use client';

import React, { useState } from 'react';
import { Eye, Calculator } from 'lucide-react';

export type ColumnDef<T> = {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
  type?: 'text' | 'select' | 'number' | 'date';
  options?: { value: string; label: string }[];
  placeholder?: string;
  formula?: string;
  format?: (val: any) => string;
};

export type SpreadsheetGridProps<T extends Record<string, any>> = {
  title?: string;
  data: T[];
  columns: ColumnDef<T>[];
  onChange?: (rowIndex: number, columnKey: string, value: any) => void;
  showFormulaToggle?: boolean;
  readOnly?: boolean;
  highlightRow?: (row: T, index: number) => string | undefined;
  summaryRow?: React.ReactNode;
};

export function SpreadsheetGrid<T extends Record<string, any>>({
  title,
  data,
  columns,
  onChange,
  showFormulaToggle = true,
  readOnly = false,
  highlightRow,
  summaryRow,
}: SpreadsheetGridProps<T>) {
  const [showFormulas, setShowFormulas] = useState(false);

  return (
    <div className="vcep-spreadsheet-container">
      {(title || showFormulaToggle) && (
        <div className="vcep-spreadsheet-toolbar">
          <div className="vcep-spreadsheet-title">
            <Calculator size={16} aria-hidden="true" />
            <span>{title || 'Worksheet Grid'}</span>
          </div>
          {showFormulaToggle && (
            <button
              type="button"
              className={`vcep-formula-toggle ${showFormulas ? 'is-active' : ''}`}
              onClick={() => setShowFormulas(!showFormulas)}
              title="Toggle Formula View (Ctrl + `)"
              aria-pressed={showFormulas}
            >
              <Eye size={13} aria-hidden="true" />
              <span>{showFormulas ? 'Show Values' : 'Show Formulas ( = )'}</span>
            </button>
          )}
        </div>
      )}

      <div className="vcep-spreadsheet-scroll" tabIndex={0} role="region" aria-label={title || 'Spreadsheet'}>
        <table className="vcep-spreadsheet-table">
          <thead>
            <tr>
              <th className="vcep-col-idx" scope="col">#</th>
              {columns.map((col, idx) => (
                <th
                  key={String(col.key) + idx}
                  scope="col"
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rIdx) => {
              const rowHighlight = highlightRow ? highlightRow(row, rIdx) : undefined;
              return (
                <tr key={rIdx} className={rowHighlight}>
                  <td className="vcep-col-idx">{rIdx + 1}</td>
                  {columns.map((col, cIdx) => {
                    const rawVal = row[col.key as string];
                    const isEditable = !readOnly && col.editable;

                    return (
                      <td
                        key={String(col.key) + cIdx}
                        style={{ textAlign: col.align || 'left' }}
                        className={isEditable ? 'vcep-cell-editable' : ''}
                      >
                        {showFormulas && col.formula ? (
                          <span className="vcep-formula-code">{col.formula}</span>
                        ) : isEditable && col.type === 'select' ? (
                          <select
                            aria-label={`${col.header}, row ${rIdx + 1}`}
                            value={rawVal || ''}
                            onChange={(e) => onChange?.(rIdx, String(col.key), e.target.value)}
                            className="vcep-cell-select"
                          >
                            <option value="">{col.placeholder || 'Select...'}</option>
                            {col.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : isEditable ? (
                          <input
                            type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                            aria-label={`${col.header}, row ${rIdx + 1}`}
                            value={rawVal ?? ''}
                            onChange={(e) => onChange?.(rIdx, String(col.key), e.target.value)}
                            placeholder={col.placeholder || ''}
                            className="vcep-cell-input"
                          />
                        ) : (
                          <span className="vcep-cell-static">
                            {col.format ? col.format(rawVal) : String(rawVal ?? '—')}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {summaryRow}
          </tbody>
        </table>
      </div>
    </div>
  );
}
