import React, { useState } from 'react';
import { Card, Form, Spinner } from 'react-bootstrap';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';

const StockChart = ({ data, tradeCodes, selectedTradeCode, onTradeCodeChange, loading }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('all');

  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === 'all' || !data.length) return data;

    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1m':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6m':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return data;
    }

    return data.filter(item => new Date(item.date) >= startDate);
  };

  const filteredData = getFilteredData();

  // Format data for charts
  const chartData = filteredData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(),
  }));

  if (loading) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h4 className="mb-0">Stock Price Chart</h4>
          <div className="d-flex align-items-center">
            <Form.Group className="me-3">
              <Form.Label>Stock Code</Form.Label>
              <Form.Select
                value={selectedTradeCode}
                onChange={(e) => onTradeCodeChange(e.target.value)}
              >
                {tradeCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="me-3">
              <Form.Label>Chart Type</Form.Label>
              <Form.Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="area">Area Chart</option>
                <option value="composed">Multi-Axis Chart</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Time Range</Form.Label>
              <Form.Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="1y">1 Year</option>
              </Form.Select>
            </Form.Group>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {chartData.length === 0 ? (
          <div className="text-center py-5">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'line' && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Close Price"
                />
                <Line
                  type="monotone"
                  dataKey="open"
                  stroke="#82ca9d"
                  name="Open Price"
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#ff7300"
                  name="High Price"
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#0088FE"
                  name="Low Price"
                />
              </LineChart>
            )}
            {chartType === 'bar' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volume" fill="#8884d8" name="Volume" />
              </BarChart>
            )}
            {chartType === 'area' && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  name="Close Price"
                />
              </LineChart>
            )}
            {chartType === 'composed' && (
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="close"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Close Price"
                />
                <Bar
                  yAxisId="right"
                  dataKey="volume"
                  fill="#82ca9d"
                  name="Volume"
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

export default StockChart; 