import React, { useEffect, useState } from 'react';
import { Select, Spin, Card } from 'antd';
import { Line, Bar } from '@ant-design/charts';
import BorrowingServices from '../../services/BorrowingServices';

const { Option } = Select;

function Statistics() {
  const [loading, setLoading] = useState(false);
  const [timeInterval, setTimeInterval] = useState('month');
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
      setBorrowingData(res.map(item => ({
        time: item.time,
        borrow_count: parseInt(item.borrow_count),
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopBorrowedBooks = async () => {
    setLoading(true);
    try {
      const res = await BorrowingServices.getTopBorrowedBooks(10);
      console.log(res);
      setTopBooksData(res.map(item => ({
        title: item.Book.title,
        total_borrowed: parseInt(item.total_borrowed),
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const timeIntervalOptions = [
    { value: 'month', label: 'Tháng' },
    { value: 'year', label: 'Năm' },
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
    },
    smooth: true,
    lineStyle: {
      stroke: '#1890ff',
    },
    height: 300,
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      showMarkers: true,
    },
  };

  const topBooksChartConfig = {
    data: topBooksData,
    xField: 'title',
    yField: 'total_borrowed',
    xAxis: {
      label: {
        autoRotate: true,
        rotate: Math.PI / 4,
        offset: 10,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`,
      },
    },
    height: 300,
    tooltip: {
      showMarkers: true,
    },
    label: {
      position: 'top',
      layout: [
        {
          type: 'adjust-color',
        },
      ],
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Thống kê mượn sách</h2>
      <div className="mb-4">
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
        <Spin />
      ) : (
        <Card title={`Số lượt mượn sách theo ${timeInterval}`}>
          <Line {...borrowingChartConfig} />
        </Card>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Top sách được mượn nhiều nhất</h2>
        {loading ? (
          <Spin />
        ) : (
          <Card title="Top 10 sách được mượn nhiều nhất">
            <Bar {...topBooksChartConfig} />
          </Card>
        )}
      </div>
    </div>
  );
}

export default Statistics;