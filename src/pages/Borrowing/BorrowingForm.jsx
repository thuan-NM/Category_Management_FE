import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  DatePicker,
  Button,
  Form,
  InputNumber,
  message,
  Typography,
} from "antd";
import Joi from "joi";
import BorrowingServices from "../../services/BorrowingServices";
import LibraryCardServices from "../../services/LibraryCardServices";
import BookServices from "../../services/BookServices";
import { useSelector } from "react-redux";

const { Option } = Select;

const BorrowingForm = () => {
  const userInfo = useSelector((state) => state.auth.user);
  const [borrowing, setBorrowing] = useState({
    borrow_date: "",
    card_number: "",
    employee_id: userInfo.employee_id,
    books: [],
  });
  const [libraryCards, setLibraryCards] = useState([]);
  const [books, setBooks] = useState([]);
  const [max_books_allowed, set_max_books_allowed] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  const borrowingSchema = Joi.object({
    borrow_date: Joi.string().required().messages({
      "string.empty": "Ngày mượn không được để trống.",
    }),
    card_number: Joi.string().required().messages({
      "string.empty": "Thẻ thư viện không được để trống.",
    }),
    employee_id: Joi.string().required().messages({
      "string.empty": "Nhân viên không được để trống.",
    }),
    books: Joi.array()
      .min(1)
      .max(max_books_allowed)
      .items(
        Joi.object({
          book_id: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required().messages({
            "number.base": "Số lượng phải là số nguyên.",
            "number.min": "Số lượng phải lớn hơn 0.",
          }),
        })
      )
      .messages({
        "array.min": "Phải chọn ít nhất một cuốn sách.",
        "array.max": `Không thể mượn quá ${max_books_allowed} sách.`,
      }),
  });

  useEffect(() => {
    LibraryCardServices.getAll()
      .then((res) => {
        if (Array.isArray(res.data.rows)) {
          const sortedLibraryCards = res.data.rows.sort((a, b) =>
            a.card_number.localeCompare(b.card_number)
          );
          setLibraryCards(sortedLibraryCards);
        } else {
          setLibraryCards([]);
        }
      })
      .catch((err) => console.error(err));

    BookServices.getAll()
      .then((data) => setBooks(data.rows.filter((b) => b.quantity > 0)))
      .catch((err) => console.error(err));

    if (id) {
      BorrowingServices.getById(id)
        .then((res) => setBorrowing(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const getTotalQuantity = (books) =>
    books.reduce((sum, book) => sum + book.quantity, 0);

  const handleBookChange = (selectedBooks) => {
    const updatedBooks = selectedBooks.map((bookId) => {
      const existingBook = borrowing.books.find((b) => b.book_id === bookId);
      return existingBook || { book_id: bookId, quantity: 1 };
    });

    if (getTotalQuantity(updatedBooks) > max_books_allowed) {
      message.warning(`Không thể mượn quá ${max_books_allowed} sách.`);
    } else {
      setBorrowing((prev) => ({ ...prev, books: updatedBooks }));
    }
  };

  const handleQuantityChange = (bookId, quantity) => {
    const book = books.find((b) => b.book_id === bookId);

    if (book && quantity > book.quantity) {
      message.warning(
        `Số lượng mượn cho sách "${book.title}" không thể vượt quá ${book.quantity}.`
      );
      return;
    }

    const updatedBooks = borrowing.books.map((b) =>
      b.book_id === bookId ? { ...b, quantity } : b
    );

    if (getTotalQuantity(updatedBooks) > max_books_allowed) {
      message.warning(`Không thể mượn quá ${max_books_allowed} sách.`);
    } else {
      setBorrowing((prev) => ({ ...prev, books: updatedBooks }));
    }
  };

  const handleSubmit = () => {
    const { error } = borrowingSchema.validate(borrowing, {
      abortEarly: true,
    });

    if (error) {
      error.details.forEach((err) => message.warning(err.message));
      return;
    }

    if (id) {
      BorrowingServices.update(id, borrowing)
        .then(() => navigate("/borrowings"))
        .catch((err) => console.error(err));
    } else {
      BorrowingServices.create(borrowing)
        .then(() => navigate("/borrowings"))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        {id ? "Chỉnh sửa Mượn sách" : "Thêm mới Mượn sách"}
      </h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Ngày mượn">
          <DatePicker
            onChange={(date, dateString) =>
              setBorrowing((prev) => ({ ...prev, borrow_date: dateString }))
            }
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Thẻ thư viện">
          <Select
            showSearch
            placeholder="Chọn thẻ thư viện"
            value={borrowing.card_number}
            onChange={(value) => {
              setBorrowing((prev) => ({ ...prev, card_number: value }));
              set_max_books_allowed(
                libraryCards.find((lc) => lc.card_number === value)
                  .max_books_allowed
              );
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {libraryCards.map((card) => (
              <Option key={card.card_number} value={card.card_number}>
                {card.card_number}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Typography.Text
          type="secondary"
          style={{ display: "block", marginTop: "8px", marginBottom: "8px" }}
        >
          Số lượng mượn tối đa:{" "}
          <Typography.Text strong>{max_books_allowed}</Typography.Text>
        </Typography.Text>

        <Form.Item label="Sách mượn">
          <Select
            mode="multiple"
            placeholder="Chọn sách"
            value={borrowing.books.map((b) => b.book_id)}
            onChange={handleBookChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {books.map((book) => (
              <Option key={book.book_id} value={book.book_id}>
                {book.title}
              </Option>
            ))}
          </Select>
          {borrowing.books.map((book) => (
            <div
              key={book.book_id}
              style={{ display: "flex", alignItems: "center", marginTop: 8 }}
            >
              <span style={{ flex: 1 }}>
                {books.find((b) => b.book_id === book.book_id)?.title}
              </span>
              <InputNumber
                min={1}
                value={book.quantity}
                onChange={(value) => handleQuantityChange(book.book_id, value)}
                style={{ width: 100 }}
              />
            </div>
          ))}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {id ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BorrowingForm;
