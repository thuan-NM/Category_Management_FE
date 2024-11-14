// src/components/Statistics.jsx

import React, { useEffect, useState, useRef } from 'react';
import { Select, Card, Skeleton, message, Button } from 'antd';
import { Line, Bar } from '@ant-design/charts';
import BorrowingServices from '../../services/BorrowingServices';
import html2canvas from 'html2canvas';

const { Option } = Select;

function Statistics() {
  const [loadingBorrowing, setLoadingBorrowing] = useState(false);
  const [loadingTopBooks, setLoadingTopBooks] = useState(false);
  const [timeInterval, setTimeInterval] = useState('week'); // Set default to 'week'
  const [borrowingData, setBorrowingData] = useState([]);
  const [topBooksData, setTopBooksData] = useState([]);

  // Thêm các ref để tham chiếu đến các container div
  const borrowingChartContainerRef = useRef(null);
  const topBooksChartContainerRef = useRef(null);

  useEffect(() => {
    fetchBorrowingStatistics(timeInterval);
  }, [timeInterval]);

  useEffect(() => {
    fetchTopBorrowedBooks();
  }, []);

  const fetchBorrowingStatistics = async (interval) => {
    setLoadingBorrowing(true);
    try {
      const res = await BorrowingServices.getStatistics(interval);
      console.log('Borrowing Statistics:', res);
      const validData = res
        .filter(
          (item) =>
            item.time &&
            typeof item.borrow_count === 'number' &&
            !isNaN(item.borrow_count)
        )
        .map((item) => ({
          time: item.time,
          borrow_count: parseInt(item.borrow_count, 10),
        }));
      console.log('Borrowing Data:', validData); // Kiểm tra dữ liệu
      setBorrowingData(validData);
    } catch (err) {
      console.error('Error fetching borrowing statistics:', err);
      message.error('Đã xảy ra lỗi khi tải thống kê mượn sách.');
    } finally {
      setLoadingBorrowing(false);
    }
  };

  const fetchTopBorrowedBooks = async () => {
    setLoadingTopBooks(true);
    try {
      const res = await BorrowingServices.getTopBorrowedBooks(10);
      console.log('Top Borrowed Books:', res);
      const processedData = res.map((item) => ({
        title: item.Book?.title || 'Không rõ', // Sử dụng Optional Chaining để tránh lỗi
        total_borrowed: parseInt(item.total_borrowed, 10),
      }));
      console.log('Top Books Data:', processedData); // Kiểm tra dữ liệu
      setTopBooksData(processedData);
    } catch (err) {
      console.error('Error fetching top borrowed books:', err);
      message.error('Đã xảy ra lỗi khi tải top sách được mượn.');
    } finally {
      setLoadingTopBooks(false);
    }
  };

  const timeIntervalOptions = [
    { value: 'week', label: 'Tuần' },
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
      background: {
        fill: '#ffffff',
        stroke: '#d9d9d9',
        radius: 4,
      },
      titleStyle: {
        fill: '#000000',
        fontSize: 14,
        fontWeight: 'bold',
      },
      itemTpl: `
        <div style="padding: 4px 8px;">
          <strong>{name}</strong>: {value}
        </div>
      `,
      formatter: (datum) => ({
        name: 'Số lượt mượn',
        value: datum.borrow_count,
      }),
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    background: {
      fill: '#ffffff', // Đặt màu nền cho biểu đồ
    },
    onReady: (plot) => {
      // Không cần lưu plot vào ref khi sử dụng html2canvas
      console.log('Borrowing Chart Instance:', plot); // Kiểm tra đối tượng chart
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
      background: {
        fill: '#ffffff',
        stroke: '#d9d9d9',
        radius: 4,
      },
      titleStyle: {
        fill: '#000000',
        fontSize: 14,
        fontWeight: 'bold',
      },
      itemTpl: `
        <div style="padding: 4px 8px;">
          <strong>{name}</strong>: {value}
        </div>
      `,
      formatter: (datum) => ({
        name: 'Tổng số lần mượn',
        value: datum.total_borrowed,
      }),
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
      fill: '#1890ff', // Đặt màu sắc cho các cột
      radius: [4, 4, 0, 0], // Bo góc cho các cột
    },
    animation: {
      appear: {
        animation: 'scale-in-y',
        duration: 1000,
      },
    },
    background: {
      fill: '#ffffff', // Đặt màu nền cho biểu đồ
    },
    onReady: (plot) => {
      // Không cần lưu plot vào ref khi sử dụng html2canvas
      console.log('Top Books Chart Instance:', plot); // Kiểm tra đối tượng chart
    },
  };

  const handleExport = async () => {
    try {
      // Sử dụng html2canvas để xuất hình ảnh
      await handleExportWithHtml2Canvas();
    } catch (error) {
      console.error('Error exporting charts:', error);
      message.error('Đã xảy ra lỗi khi xuất biểu đồ.');
    }
  };

  const handleExportWithHtml2Canvas = async () => {
    try {
      // Xuất Line Chart
      if (borrowingChartContainerRef.current) {
        const canvas = await html2canvas(borrowingChartContainerRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff', // Đặt màu nền cho canvas
        });
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'borrowing_chart.png';
        link.click();
      } else {
        console.warn('Không tìm thấy borrowingChartContainerRef.current');
      }

      // Xuất Bar Chart
      if (topBooksChartContainerRef.current) {
        const canvas = await html2canvas(topBooksChartContainerRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff', // Đặt màu nền cho canvas
        });
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'top_books_chart.png';
        link.click();
      } else {
        console.warn('Không tìm thấy topBooksChartContainerRef.current');
      }

      message.success('Đã xuất thành công các biểu đồ!');
    } catch (error) {
      console.error('Error exporting charts with html2canvas:', error);
      message.error('Đã xảy ra lỗi khi xuất biểu đồ.');
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6">Thống kê mượn sách</h2>
      <div className="mb-6 flex justify-between items-center">
        <Select
          value={timeInterval}
          onChange={handleTimeIntervalChange}
          style={{ width: 200 }}
        >
          {timeIntervalOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleExport}>
          Xuất Hình Ảnh Biểu Đồ
        </Button>
      </div>
      <Card
        title={`Số lượt mượn sách theo ${
          timeInterval === 'week'
            ? 'Tuần'
            : timeInterval === 'month'
            ? 'Tháng'
            : 'Năm'
        }`}
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px',
          backgroundColor: '#ffffff', // Đặt màu nền cho Card
        }}
      >
        <div ref={borrowingChartContainerRef}>
          {loadingBorrowing ? (
            <Skeleton active />
          ) : borrowingData.length === 0 ? (
            <p>Không có dữ liệu để hiển thị.</p>
          ) : (
            <Line {...borrowingChartConfig} />
          )}
        </div>
      </Card>
      <div className="mt-10">
        <h2 className="text-3xl font-semibold mb-6">Top sách được mượn nhiều nhất</h2>
        <Card
          title="Top 10 sách được mượn nhiều nhất"
          bordered={false}
          style={{
            borderRadius: 8,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff', // Đặt màu nền cho Card
          }}
        >
          <div ref={topBooksChartContainerRef}>
            {loadingTopBooks ? (
              <Skeleton active />
            ) : topBooksData.length === 0 ? (
              <p>Không có dữ liệu để hiển thị.</p>
            ) : (
              <Bar {...topBooksChartConfig} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Statistics;
