import React, { useState, useMemo, useEffect } from 'react';
import { Table, Button, Form, Spinner } from 'react-bootstrap';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import Swal from 'sweetalert2';

const StockTable = ({ data, loading, onUpdate, onDelete, onAdd, selectedTradeCode }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [sorting, setSorting] = useState([]);
  const [isAddingNewRow, setIsAddingNewRow] = useState(false);
  const [newRowData, setNewRowData] = useState({
    date: '',
    trade_code: selectedTradeCode,
    open: '',
    high: '',
    low: '',
    close: '',
    volume: ''
  });

  useEffect(() => {
    setNewRowData(prev => ({
      ...prev,
      trade_code: selectedTradeCode
    }));
  }, [selectedTradeCode]);

  const handleInputChange = (rowIndex, columnId, value) => {
    console.log(`Editing ${columnId} for row ${rowIndex} with value ${value}`);
    console.log('Current editedValues state:', editedValues);
    
    setEditedValues(prev => {
      const newState = {
        ...prev,
        [rowIndex]: {
          ...prev[rowIndex],
          [columnId]: value
        }
      };
      console.log('New editedValues state:', newState);
      return newState;
    });
  };

  const handleNewRowInputChange = (columnId, value) => {
    console.log(`Setting ${columnId} in new row to ${value}`);
    setNewRowData(prev => ({
      ...prev,
      [columnId]: value
    }));
  };

  const startEditingRow = (rowIndex, rowData) => {
    console.log('Starting to edit row', rowIndex, rowData);
    
    // Make a clean copy of the row data for editing
    const cleanRowData = {
      id: rowData.id,
      date: rowData.date,
      trade_code: rowData.trade_code,
      open: rowData.open,
      high: rowData.high,
      low: rowData.low,
      close: rowData.close,
      volume: rowData.volume
    };
    
    console.log('Initial row data for editing:', cleanRowData);
    
    setEditingRow(rowIndex);
    setEditedValues(prev => ({
      ...prev,
      [rowIndex]: cleanRowData
    }));
  };

  const cancelEditing = () => {
    console.log('Canceling edit');
    setEditingRow(null);
  };

  const saveRow = (rowIndex, originalRow) => {
    console.log('Saving row', rowIndex, originalRow);
    console.log('Edited values state before save:', editedValues);
    console.log('Current row edited values:', editedValues[rowIndex]);
    
    Swal.fire({
      title: 'Confirm Update',
      text: 'Are you sure you want to save these changes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const rowValues = editedValues[rowIndex] || {};
        console.log('Row values to be used for update:', rowValues);
        
        // Convert numeric fields to numbers
        const updatedRow = {
          ...originalRow,
          ...rowValues,
          open: parseFloat(rowValues.open || originalRow.open),
          high: parseFloat(rowValues.high || originalRow.high),
          low: parseFloat(rowValues.low || originalRow.low),
          close: parseFloat(rowValues.close || originalRow.close),
          volume: parseInt(rowValues.volume || originalRow.volume),
        };
        
        console.log('Final row being submitted:', updatedRow);
        onUpdate(updatedRow);
        setEditingRow(null);
      }
    });
  };

  const deleteRow = (row) => {
    console.log('Deleting row', row);
    
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Confirmed deletion for row ID:', row.original.id);
        onDelete(row.original.id);
      }
    });
  };

  const startAddingRow = () => {
    console.log('Starting to add a new row');
    
    setIsAddingNewRow(true);
    setNewRowData({
      date: new Date().toISOString().split('T')[0],
      trade_code: selectedTradeCode,
      open: '',
      high: '',
      low: '',
      close: '',
      volume: ''
    });
  };

  const cancelAddingRow = () => {
    console.log('Canceling add new row');
    
    setIsAddingNewRow(false);
    setNewRowData({
      date: '',
      trade_code: selectedTradeCode,
      open: '',
      high: '',
      low: '',
      close: '',
      volume: ''
    });
  };

  const saveNewRow = () => {
    console.log('Saving new row', newRowData);
    
    if (!newRowData.date || !newRowData.trade_code) {
      Swal.fire({
        title: 'Error',
        text: 'Date and Trade Code are required fields',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: 'Confirm Add',
      text: 'Are you sure you want to add this new record?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formattedNewRow = {
          ...newRowData,
          open: parseFloat(newRowData.open) || 0,
          high: parseFloat(newRowData.high) || 0,
          low: parseFloat(newRowData.low) || 0,
          close: parseFloat(newRowData.close) || 0,
          volume: parseInt(newRowData.volume) || 0,
        };
        
        console.log('Submitting new row:', formattedNewRow);
        onAdd(formattedNewRow);
        setIsAddingNewRow(false);
      }
    });
  };

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => [
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => {
        const value = info.getValue();
        const rowIndex = info.row.index;
        
        if (editingRow === rowIndex) {
          const currentValue = editedValues[rowIndex]?.date !== undefined ? 
            editedValues[rowIndex].date : value;
          
          console.log(`Rendering date field with value ${currentValue}`);
          
          return (
            <Form.Control
              type="date"
              value={currentValue}
              onChange={e => handleInputChange(rowIndex, 'date', e.target.value)}
            />
          );
        }
        return value;
      }
    }),
    columnHelper.accessor('trade_code', {
      header: 'Trade Code',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('open', {
      header: 'Open',
      cell: info => {
        const value = info.getValue();
        const rowIndex = info.row.index;
        
        if (editingRow === rowIndex) {
          const currentValue = editedValues[rowIndex]?.open !== undefined ? 
            editedValues[rowIndex].open : value;
          
          console.log(`Rendering open field with value ${currentValue}`);
          
          return (
            <Form.Control
              type="number"
              step="0.01"
              value={currentValue}
              onChange={e => handleInputChange(rowIndex, 'open', e.target.value)}
            />
          );
        }
        return value;
      }
    }),
    columnHelper.accessor('high', {
      header: 'High',
      cell: info => {
        const value = info.getValue();
        const rowIndex = info.row.index;
        
        if (editingRow === rowIndex) {
          const currentValue = editedValues[rowIndex]?.high !== undefined ? 
            editedValues[rowIndex].high : value;
          
          console.log(`Rendering high field with value ${currentValue}`);
          
          return (
            <Form.Control
              type="number"
              step="0.01"
              value={currentValue}
              onChange={e => handleInputChange(rowIndex, 'high', e.target.value)}
            />
          );
        }
        return value;
      }
    }),
    columnHelper.accessor('low', {
      header: 'Low',
      cell: info => {
        const value = info.getValue();
        const rowIndex = info.row.index;
        
        if (editingRow === rowIndex) {
          const currentValue = editedValues[rowIndex]?.low !== undefined ? 
            editedValues[rowIndex].low : value;
          
          console.log(`Rendering low field with value ${currentValue}`);
          
          return (
            <Form.Control
              type="number"
              step="0.01"
              value={currentValue}
              onChange={e => handleInputChange(rowIndex, 'low', e.target.value)}
            />
          );
        }
        return value;
      }
    }),
    columnHelper.accessor('close', {
      header: 'Close',
      cell: info => {
        const value = info.getValue();
        const rowIndex = info.row.index;
        
        if (editingRow === rowIndex) {
          const currentValue = editedValues[rowIndex]?.close !== undefined ? 
            editedValues[rowIndex].close : value;
          
          console.log(`Rendering close field with value ${currentValue}`);
          
          return (
            <Form.Control
              type="number"
              step="0.01"
              value={currentValue}
              onChange={e => handleInputChange(rowIndex, 'close', e.target.value)}
            />
          );
        }
        return value;
      }
    }),
    columnHelper.accessor('volume', {
      header: 'Volume',
      cell: info => {
        const value = info.getValue();
        const rowIndex = info.row.index;
        
        if (editingRow === rowIndex) {
          const currentValue = editedValues[rowIndex]?.volume !== undefined ? 
            editedValues[rowIndex].volume : value;
          
          console.log(`Rendering volume field with value ${currentValue}`);
          
          return (
            <Form.Control
              type="number"
              value={currentValue}
              onChange={e => handleInputChange(rowIndex, 'volume', e.target.value)}
            />
          );
        }
        return value;
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => {
        const rowIndex = info.row.index;
        
        if (editingRow === rowIndex) {
          return (
            <>
              <Button 
                size="sm" 
                variant="success" 
                className="me-2"
                onClick={() => saveRow(rowIndex, info.row.original)}
              >
                Save
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={cancelEditing}
              >
                Cancel
              </Button>
            </>
          );
        }
        
        return (
          <>
            <Button 
              size="sm" 
              variant="primary" 
              className="me-2"
              onClick={() => startEditingRow(rowIndex, info.row.original)}
            >
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="danger"
              onClick={() => deleteRow(info.row)}
            >
              Delete
            </Button>
          </>
        );
      }
    })
  ], [editingRow, editedValues, selectedTradeCode]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3>Stock Data</h3>
        <Button 
          variant="success" 
          onClick={startAddingRow}
          disabled={isAddingNewRow}
        >
          Add New Row
        </Button>
      </div>
      
      {isAddingNewRow && (
        <div className="mb-3 p-3 border rounded">
          <h5>Add New Stock Data</h5>
          <div className="row">
            <div className="col-md-2 mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newRowData.date}
                onChange={e => handleNewRowInputChange('date', e.target.value)}
                required
              />
            </div>
            <div className="col-md-2 mb-2">
              <Form.Label>Trade Code</Form.Label>
              <Form.Control
                type="text"
                value={newRowData.trade_code}
                onChange={e => handleNewRowInputChange('trade_code', e.target.value)}
                required
                readOnly
              />
            </div>
            <div className="col-md-2 mb-2">
              <Form.Label>Open</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Open"
                value={newRowData.open}
                onChange={e => handleNewRowInputChange('open', e.target.value)}
                required
              />
            </div>
            <div className="col-md-2 mb-2">
              <Form.Label>High</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="High"
                value={newRowData.high}
                onChange={e => handleNewRowInputChange('high', e.target.value)}
                required
              />
            </div>
            <div className="col-md-2 mb-2">
              <Form.Label>Low</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Low"
                value={newRowData.low}
                onChange={e => handleNewRowInputChange('low', e.target.value)}
                required
              />
            </div>
            <div className="col-md-2 mb-2">
              <Form.Label>Close</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Close"
                value={newRowData.close}
                onChange={e => handleNewRowInputChange('close', e.target.value)}
                required
              />
            </div>
            <div className="col-md-2 mb-2">
              <Form.Label>Volume</Form.Label>
              <Form.Control
                type="number"
                placeholder="Volume"
                value={newRowData.volume}
                onChange={e => handleNewRowInputChange('volume', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-2">
            <Button 
              variant="success" 
              className="me-2"
              onClick={saveNewRow}
            >
              Save
            </Button>
            <Button 
              variant="secondary"
              onClick={cancelAddingRow}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Button 
            onClick={() => table.setPageIndex(0)} 
            disabled={!table.getCanPreviousPage()} 
            className="me-2"
          >
            {'<<'}
          </Button>
          <Button 
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()} 
            className="me-2"
          >
            {'<'}
          </Button>
          <Button 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()} 
            className="me-2"
          >
            {'>'}
          </Button>
          <Button 
            onClick={() => table.setPageIndex(table.getPageCount() - 1)} 
            disabled={!table.getCanNextPage()} 
            className="me-2"
          >
            {'>>'}
          </Button>
        </div>
        <div>
          <span>
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <Form.Control
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              style={{ width: '70px', display: 'inline-block' }}
              min={1}
              max={table.getPageCount()}
            />
          </span>{' '}
          <Form.Select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            style={{ width: '120px', display: 'inline-block' }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>
    </div>
  );
};

export default StockTable; 