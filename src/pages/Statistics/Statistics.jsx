// src/components/Statistics.js

import React, { useEffect, useState } from 'react';
import { Select, Spin, Card, Skeleton } from 'antd';
import { Line, Bar } from '@ant-design/charts';
import BorrowingServices from '../../services/BorrowingServices';

const { Option } = Select;

function Statistics() {
  const [loading, setLoading] = useState(false);
  const [timeInterval, setTimeInterval] = useState('week'); // Set default to 'week'
  const [borrowingData, setBorrowingData] = useState([]);
  const [topBooksData, setTopBooksData] = useState([]);

  useEffect(() => {
    fetchBorrowingStatistics(timeInterval);
  }, [timeInterval]);

  useEffect(() => {
    fetchTopBorrowedBooks();
  }, []);

  const fetchBorrowingStatistics = async (interval) => {
    setLoading(true);
    try {
      const res = await BorrowingServices.getStatistics(interval);
      const validData = res
        .filter(item => item.time && item.borrow_count !== null && !isNaN(item.borrow_count))
        .map(item => ({
          time: item.time,
          borrow_count: parseInt(item.borrow_count, 10),
        }));
      setBorrowingData(validData);
    } catch (err) {
      console.error(err);
      // Optionally, display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const fetchTopBorrowedBooks = async () => {
    setLoading(true);
    try {
      const res = await BorrowingServices.getTopBorrowedBooks(10);
      setTopBooksData(res.map(item => ({
        title: item.Book.title,
        total_borrowed: parseInt(item.total_borrowed),
      })));
    } catch (err) {
      console.error(err);
      // Optionally, display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const timeIntervalOptions = [
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
    { value: 'year', label: 'Năm' }, // Optionally, include 'year' if needed
  ];

  const handleTimeIntervalChange = (value) => {
    setTimeInterval(value);
  };

  const borrowingChartConfig = {
    data: borrowingData,
    xField: 'time',
    yField: 'borrow_count',
    xAxis: {
      label: {
        autoRotate: true,
      },
      title: {
        text: 'Thời gian',
      },
    },
    yAxis: {
      title: {
        text: 'Số lượt mượn sách',
      },
    },
    smooth: true,
    lineStyle: {
      stroke: '#1890ff',
      lineWidth: 2,
    },
    height: 300,
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#1890ff',
        stroke: '#fff',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: true,
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const topBooksChartConfig = {
    data: topBooksData,
    xField: 'title',
    yField: 'total_borrowed',
    xAxis: {
      label: {
        autoRotate: true,
        rotate: Math.PI / 6,
        offset: 10,
      },
      title: {
        text: 'Tên sách',
      },
    },
    yAxis: {
      title: {
        text: 'Tổng số lần mượn',
      },
    },
    height: 300,
    tooltip: {
      showMarkers: true,
    },
    label: {
      position: 'top',
      style: {
        fill: '#595959',
        fontSize: 12,
      },
      layout: [
        {
          type: 'adjust-color',
        },
      ],
    },
    barStyle: {
      radius: [2, 2, 0, 0],
    },
    animation: {
      appear: {
        animation: 'scale-in-y',
        duration: 1000,
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6">Thống kê mượn sách</h2>
      <div className="mb-6">
        <Select
          defaultValue={timeInterval}
          onChange={handleTimeIntervalChange}
          style={{ width: 200 }}
        >
          {timeIntervalOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <Card
          title={`Số lượt mượn sách theo ${timeInterval === 'week' ? 'Tuần' : timeInterval === 'month' ? 'Tháng' : 'Năm'}`}
          bordered={false}
          style={{ borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        >
          <Line {...borrowingChartConfig} />
        </Card>
      )}
      <div className="mt-10">
        <h2 className="text-3xl font-semibold mb-6">Top sách được mượn nhiều nhất</h2>
        {loading ? (
          <Skeleton active />
        ) : (
          <Card
            title="Top 10 sách được mượn nhiều nhất"
            bordered={false}
            style={{ borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <Bar {...topBooksChartConfig} />
          </Card>
        )}
      </div>
    </div>
  );
}

export default Statistics;
