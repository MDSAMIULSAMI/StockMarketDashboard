import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import StockTable from './components/StockTable';
import StockChart from './components/StockChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';
import Swal from 'sweetalert2';

function App() {
  const [stockData, setStockData] = useState([]);
  const [tradeCodes, setTradeCodes] = useState([]);
  const [selectedTradeCode, setSelectedTradeCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageSize: 30,
    pageIndex: 0
  });

  // Fetch trade codes for dropdown
  useEffect(() => {
    const fetchTradeCodes = async () => {
      try {
        const response = await axios.get('https://stockmarket-dashboard-api.onrender.com/api/stocks/unique_trade_codes/');
        setTradeCodes(response.data);
        if (response.data.length > 0) {
          setSelectedTradeCode(response.data[0]);
        }
      } catch (err) {
        setError('Failed to fetch trade codes');
        console.error('Error fetching trade codes:', err);
      }
    };

    fetchTradeCodes();
  }, []);

  // Fetch stock data based on selected trade code
  useEffect(() => {
    const fetchStockData = async () => {
      if (!selectedTradeCode) return;
      
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/stocks/?trade_code=${selectedTradeCode}&page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`
        );
        // Sort data by date
        const sortedData = response.data.results.sort((a, b) => new Date(a.date) - new Date(b.date));
        setStockData(sortedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error('Error fetching stock data:', err);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedTradeCode, pagination.pageIndex, pagination.pageSize]);

  // Handle trade code selection change
  const handleTradeCodeChange = (tradeCode) => {
    setSelectedTradeCode(tradeCode);
    // Reset pagination when trade code changes
    setPagination({
      ...pagination,
      pageIndex: 0
    });
  };

  // Handle pagination change
  const handlePaginationChange = (newPagination) => {
    setPagination(newPagination);
  };

  // Handle stock data update (for CRUD operations)
  const handleStockUpdate = async (updatedStock) => {
    try {
      console.log('handleStockUpdate called with data:', updatedStock);
      console.log('Update URL:', `https://stockmarket-dashboard-api.onrender.com/api/stocks/${updatedStock.id}/`);
      
      // Ensure data types are correct before sending
      const formattedData = {
        ...updatedStock,
        open: parseFloat(updatedStock.open),
        high: parseFloat(updatedStock.high),
        low: parseFloat(updatedStock.low),
        close: parseFloat(updatedStock.close),
        volume: parseInt(updatedStock.volume),
      };
      
      console.log('Formatted data for API:', formattedData);
      
      // Make the API call to update the stock
      const response = await axios.put(
        `http://localhost:8000/api/stocks/${updatedStock.id}/`, 
        formattedData
      );
      
      console.log('Update response:', response.data);
      
      // Refresh data after update
      const refreshResponse = await axios.get(
        `http://localhost:8000/api/stocks/?trade_code=${selectedTradeCode}&page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`
      );
      const sortedData = refreshResponse.data.results.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log('Refreshed data after update:', sortedData);
      
      setStockData(sortedData);
      
      // Show success message
      Swal.fire(
        'Updated!',
        'The stock data has been updated.',
        'success'
      );
    } catch (err) {
      console.error('Error updating stock data:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      Swal.fire(
        'Error!',
        `Failed to update stock data: ${err.response?.data?.detail || err.message}`,
        'error'
      );
    }
  };
  
  // Handle stock data deletion
  const handleStockDelete = async (stockId) => {
    try {
      console.log('Deleting stock with ID:', stockId);
      
      // Make the API call to delete the stock
      const response = await axios.delete(`https://stockmarket-dashboard-api.onrender.com/api/stocks/${stockId}/`);
      console.log('Delete response:', response.data);
      
      // Refresh data after deletion
      const refreshResponse = await axios.get(
        `https://stockmarket-dashboard-api.onrender.com/api/stocks/?trade_code=${selectedTradeCode}&page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`
      );
      const sortedData = refreshResponse.data.results.sort((a, b) => new Date(a.date) - new Date(b.date));
      setStockData(sortedData);
      
      // Show success message
      Swal.fire(
        'Deleted!',
        'The stock data has been deleted.',
        'success'
      );
    } catch (err) {
      console.error('Error deleting stock data:', err.response || err);
      Swal.fire(
        'Error!',
        `Failed to delete stock data: ${err.response?.data?.detail || err.message}`,
        'error'
      );
    }
  };
  
  // Handle adding new stock data
  const handleStockAdd = async (newStock) => {
    try {
      console.log('Adding new stock with data:', newStock);
      
      // Add trade_code if not present
      if (!newStock.trade_code) {
        newStock.trade_code = selectedTradeCode;
      }
      
      // Make the API call to add the stock
      const response = await axios.post('http://localhost:8000//api/stocks/', newStock);
      console.log('Add response:', response.data);
      
      // Refresh data after adding
      const refreshResponse = await axios.get(
        `http://localhost:8000/api/stocks/?trade_code=${selectedTradeCode}&page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`
      );
      const sortedData = refreshResponse.data.results.sort((a, b) => new Date(a.date) - new Date(b.date));
      setStockData(sortedData);
      
      // Show success message
      Swal.fire(
        'Added!',
        'The stock data has been added.',
        'success'
      );
    } catch (err) {
      console.error('Error adding stock data:', err.response || err);
      Swal.fire(
        'Error!',
        `Failed to add stock data: ${err.response?.data?.detail || err.message}`,
        'error'
      );
    }
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Stock Market Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <Row className="mb-4">
          <Col>
            <h2>Stock Market Data Visualization</h2>
            <p>Select a stock code to view its historical data</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StockChart 
              data={stockData} 
              tradeCodes={tradeCodes} 
              selectedTradeCode={selectedTradeCode} 
              onTradeCodeChange={handleTradeCodeChange} 
              loading={loading}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <StockTable 
              data={stockData} 
              loading={loading} 
              onUpdate={handleStockUpdate}
              onDelete={handleStockDelete}
              onAdd={handleStockAdd}
              tradeCodes={tradeCodes}
              selectedTradeCode={selectedTradeCode}
              pagination={pagination}
              onPaginationChange={handlePaginationChange}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App; 