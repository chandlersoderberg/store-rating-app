import React from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';

const Table = ({ columns, rows, sortBy, sortOrder, onSortChange, emptyMessage = 'No records found.' }) => {
  const handleHeaderClick = (col) => {
    if (!col.sortable || !onSortChange) return;
    const nextOrder = sortBy === col.key && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSortChange(col.key, nextOrder);
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0px 2px 12px rgba(0,0,0,0.03)' }}>
      <MuiTable>
        <TableHead sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sortDirection={sortBy === col.key ? sortOrder.toLowerCase() : false}
                sx={{ fontWeight: 'bold', color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.05)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}
              >
                {col.sortable ? (
                  <TableSortLabel
                    active={sortBy === col.key}
                    direction={sortBy === col.key ? sortOrder.toLowerCase() : 'asc'}
                    onClick={() => handleHeaderClick(col)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, idx) => (
              <TableRow 
                key={row.id ?? idx} 
                hover
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.01) !important' },
                  transition: 'background-color 0.2s ease'
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} sx={{ borderBottom: '1px solid rgba(0,0,0,0.04)', py: 2 }}>
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
