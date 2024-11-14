import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, message, Modal, Tag } from "antd";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import BorrowingServices from "../../services/BorrowingServices";
import { Link } from "react-router-dom";
import GenericExport from "../../components/GenericExport";
const { Search } = Input;

const BorrowingList = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [filteredBorrowings, setFilteredBorrowings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReturnedFilter, setIsReturnedFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  console.log({ borrowings });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    BorrowingServices.getAll()
      .then((res) => {
        const sortedBorrowings = res.data.rows.sort(
          (a, b) => new Date(b.borrow_date) - new Date(a.borrow_date)
        );
        setBorrowings(sortedBorrowings);
        setFilteredBorrowings(sortedBorrowings);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleReturnAllBook = (borrowId) => {
    Modal.confirm({
      title: "Xác nhận trả tất cả sách",
      content:
        "Bạn có chắc muốn đánh dấu tất cả sách trong mượn sách này là đã trả?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        BorrowingServices.returnAllBooks(borrowId)
          .then(() => {
            message.success("Tất cả sách đã được đánh dấu là đã trả.");
            checkAllBooksReturned(borrowId);
          })
          .catch((err) => {
            console.error(err);
            message.error("Có lỗi xảy ra khi đánh dấu sách đã trả.");
          });
      },
    });
  };

  const handleReturnBook = (borrowId, borrowDetailId) => {
    Modal.confirm({
      title: "Xác nhận trả sách",
      content: "Bạn có chắc muốn đánh dấu sách này là đã trả?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        BorrowingServices.returnSingleBook(borrowDetailId)
          .then(() => {
            message.success("Sách đã được đánh dấu là đã trả.");
            checkAllBooksReturned(borrowId);
          })
          .catch((err) => {
            console.error(err);
            message.error("Có lỗi xảy ra khi đánh dấu sách đã trả.");
          });
      },
    });
  };

  const checkAllBooksReturned = (borrowId) => {
    BorrowingServices.getById(borrowId).then((res) => {
      const allReturned = res.data.BorrowingDetails.every(
        (detail) => detail.return_date !== null
      );
      if (allReturned) {
        BorrowingServices.updateStatus(borrowId, true).then(() => fetchData());
      } else {
        fetchData();
      }
    });
  };

  const handleSearch = (value) => {
    const filtered = borrowings.filter((item) =>
      item.card_number.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBorrowings(filtered);
  };

  const handleFilter = (isReturned) => {
    setIsReturnedFilter(isReturned);
    const filtered = borrowings.filter(
      (item) => item.is_returned === isReturned
    );
    setFilteredBorrowings(isReturned === null ? borrowings : filtered);
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },    
    {
      title: "Ngày mượn",
      dataIndex: "borrow_date",
      key: "borrow_date",
      render: (borrow_date) => new Date(borrow_date).toLocaleDateString(),
    },
    {
      title: "Thẻ thư viện",
      dataIndex: "card_number",
      key: "card_number",
      render: (_, record) => record.LibraryCard.card_number,
    },
    {
      title: "Nhân viên",
      dataIndex: "employee_id",
      key: "employee_id",
      render: (_, record) => record?.Employee?.full_name,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_returned",
      key: "is_returned",
      render: (is_returned) =>
        is_returned ? (
          <Tag color="green">Đã trả</Tag>
        ) : (
          <Tag color="red">Chưa trả</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {!record.is_returned && (
            <Button
              icon={<CheckOutlined />}
              onClick={() => handleReturnAllBook(record.borrow_id)}
            >
              Trả hết sách
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const bookColumns = [
      {
        title: "Tên sách",
        dataIndex: "title",
        key: "title",
        render: (_, detail) => detail.Book.title,
      },
      {
        title: "Trạng thái",
        dataIndex: "return_date",
        key: "return_date",
        render: (return_date) =>
          return_date ? (
            <Tag color="green">Đã trả</Tag>
          ) : (
            <Tag color="red">Chưa trả</Tag>
          ),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, detail) =>
          !detail.return_date && (
            <Button
              icon={<CheckOutlined />}
              onClick={() =>
                handleReturnBook(record.borrow_id, detail.borrow_detail_id)
              }
            >
              Trả sách này
            </Button>
          ),
      },
    ];

    return (
      <Table
        columns={bookColumns}
        dataSource={record.BorrowingDetails}
        pagination={false}
        rowKey="borrow_detail_id"
        
      />
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Danh sách Mượn sách</h2>
        <div className="flex space-x-2">
          <Link to="/borrowings/new">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Thêm Mượn sách
            </Button>
          </Link>
          <GenericExport collectionname={"BorrowingDetails"} />
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <Search
          placeholder="Tìm kiếm theo thẻ thư viện"
          onSearch={handleSearch}
          enterButton
        />
        <Button onClick={() => handleFilter(null)}>Tất cả</Button>
        <Button onClick={() => handleFilter(false)}>Chưa trả</Button>
        <Button onClick={() => handleFilter(true)}>Đã trả</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredBorrowings}
        rowKey="borrow_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        bordered
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.BorrowingDetails.length > 0,
        }}
        className="custom-ant-table"
      />
    </div>
  );
};

export default BorrowingList;
