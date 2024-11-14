import React, { useEffect, useState, useRef } from 'react';
import { Select, Card, Skeleton, message, Button } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import BorrowingServices from '../../services/BorrowingServices';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const { Option } = Select;

function Statistics() {
  const [loadingBorrowing, setLoadingBorrowing] = useState(false);
  const [loadingTopBooks, setLoadingTopBooks] = useState(false);
  const [timeInterval, setTimeInterval] = useState('week');
  const [borrowingData, setBorrowingData] = useState([]);
  const [topBooksData, setTopBooksData] = useState([]);

  // Tham chiếu đến các thẻ chứa biểu đồ để xuất hình
  const borrowingChartRef = useRef(null);
  const topBooksChartRef = useRef(null);

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
      const validData = res
        .filter(item => item && item.time && typeof item.borrow_count === 'number' && !isNaN(item.borrow_count))
        .map(item => ({
          time: item.time,
          borrow_count: item.borrow_count !== null ? parseInt(item.borrow_count, 10) : 0,
        }));
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
      const processedData = res.map((item) => ({
        title: item.Book?.title || 'Không rõ',
        total_borrowed: parseInt(item.total_borrowed, 10),
      }));
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

  const handleExportCharts = async () => {
    try {
      const borrowingCanvas = await html2canvas(borrowingChartRef.current, { useCORS: true });
      const topBooksCanvas = await html2canvas(topBooksChartRef.current, { useCORS: true });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const borrowingImgData = borrowingCanvas.toDataURL('image/png');
      const topBooksImgData = topBooksCanvas.toDataURL('image/png');

      // Thêm biểu đồ dòng vào PDF
      pdf.addImage(borrowingImgData, 'PNG', 10, 10, 190, 80);

      // Thêm biểu đồ cột vào PDF, kiểm tra nếu cần thêm trang mới
      pdf.addPage();
      pdf.addImage(topBooksImgData, 'PNG', 10, 10, 190, 80);

      // Xuất PDF
      pdf.save('thong_ke_muon_sach.pdf');

      message.success('Đã xuất thành công biểu đồ thành PDF!');
    } catch (error) {
      console.error('Error exporting charts:', error);
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
        <Button type="primary" onClick={handleExportCharts}>
          Xuất Biểu Đồ Thành PDF
        </Button>
      </div>

      {/* Line Chart for Borrowing Statistics */}
      <Card
        title={`Số lượt mượn sách theo ${timeInterval === 'week' ? 'Tuần' : timeInterval === 'month' ? 'Tháng' : 'Năm'}`}
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px',
          backgroundColor: '#ffffff',
          width: '100%',
        }}
      >
        <div ref={borrowingChartRef} style={{ width: '100%', height: 500 }}>
          {loadingBorrowing ? (
            <Skeleton active />
          ) : borrowingData.length === 0 ? (
            <p>Không có dữ liệu để hiển thị.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={borrowingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => (value !== null ? value : 'Không có dữ liệu')} />
                <Legend />
                <Line type="monotone" dataKey="borrow_count" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Bar Chart for Top Borrowed Books */}
      <div className="mt-10">
        <h2 className="text-3xl font-semibold mb-6">Top sách được mượn nhiều nhất</h2>
        <Card
          title="Top 10 sách được mượn nhiều nhất"
          bordered={false}
          style={{
            borderRadius: 8,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff',
            width: '100%',
          }}
        >
          <div ref={topBooksChartRef} style={{ width: '100%', height: 500 }}>
            {loadingTopBooks ? (
              <Skeleton active />
            ) : topBooksData.length === 0 ? (
              <p>Không có dữ liệu để hiển thị.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topBooksData}
                  margin={{ top: 20, right: 30, left: 20, bottom:100 }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis
                    dataKey="title"
                    tick={{ fontSize: 10 }} // Điều chỉnh kích thước chữ
                    interval={0} // Hiển thị tất cả các nhãn
                    angle={-30} // Xoay nhãn để vừa với chiều rộng
                    textAnchor="end" // Đặt góc xoay ở cuối nhãn
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => (value !== null ? value : 'Không có dữ liệu')} />
                  <Legend />
                  <Bar dataKey="total_borrowed" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>

            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Statistics;
