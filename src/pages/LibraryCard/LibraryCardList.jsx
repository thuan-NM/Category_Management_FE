// src/components/LibraryCardList.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import LibraryCardServices from "../../services/LibraryCardServices";
import { toast } from "react-toastify";
import GenericExport from "../../components/GenericExport";

const LibraryCardList = () => {
  const [cards, setCards] = useState([]);
  const [totalCards, setTotalCards] = useState(0);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchLibraryCards();
    // eslint-disable-next-line
  }, [pagination]);

  const fetchLibraryCards = async (search = "") => {
    try {
      const params = {
        search,
        page: pagination.page,
        limit: pagination.limit,
      };
      if (search) {
        params.search = search;
        toast.info("Đang tìm kiếm...");
      }
      const res = await LibraryCardServices.getAll(params);
      setCards(res.data.rows);
      setTotalCards(res.data.count);
      setError(null);

      if (search) {
        toast.success("Tìm kiếm thành công!");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu thẻ thư viện.");
      toast.error("Không thể tải dữ liệu thẻ thư viện.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (newPage - 1) * pagination.limit >= totalCards) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    toast.info(`Đang chuyển đến trang ${newPage}...`);
  };

  const handleDelete = async (cardNumber) => {
    if (window.confirm("Bạn có chắc muốn xóa thẻ thư viện này?")) {
      try {
        toast.info("Đang xóa thẻ thư viện...");
        await LibraryCardServices.delete(cardNumber);
        setCards(cards.filter((card) => card.card_number !== cardNumber));
        setTotalCards((prev) => prev - 1);
        toast.success("Xóa thẻ thư viện thành công!");
      } catch (err) {
        console.error(err);
        setError("Xóa thẻ thư viện thất bại.");
        toast.error("Xóa thẻ thư viện thất bại.");
      }
    }
  };

  const handleUnlock = async (cardNumber) => {
    if (window.confirm("Bạn có chắc muốn mở khóa thẻ thư viện này?")) {
      try {
        toast.info("Đang mở khóa thẻ thư viện...");
        const updatedCard = await LibraryCardServices.unlock(cardNumber);
        setCards(
          cards.map((card) =>
            card.card_number === cardNumber ? updatedCard : card
          )
        );
        toast.success("Mở khóa thẻ thư viện thành công!");
      } catch (err) {
        console.error(err);
        setError("Không thể mở khóa thẻ thư viện.");
        toast.error("Không thể mở khóa thẻ thư viện.");
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await fetchLibraryCards();
    } else {
      await fetchLibraryCards(searchQuery.trim());
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Thẻ thư viện</h2>
        <div className="flex space-x-2">
          <Link
            to="/librarycards/new"
            className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm Thẻ thư viện
          </Link>
          <GenericExport collectionname={"LibraryCard"} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          placeholder="Tìm kiếm theo số thẻ hoặc tên người đọc..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
          Tìm kiếm
        </button>
      </div>

      {/* Library Card Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">
                Số thẻ
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">
                Bắt đầu
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">
                Hết hạn
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">
                Tên người đọc
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">
                Địa chỉ
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">
                Số sách tối đa
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center border-r border-gray-500">
                Ghi chú
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center">
                Trạng thái
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {Array.isArray(cards) && cards.length > 0 ? (
              cards.map((card) => (
                <tr
                  key={card.card_number}
                  className="hover:bg-gray-100 transition duration-150"
                >
                  <td className="py-3 px-4 text-center">{card.card_number}</td>
                  <td className="py-3 px-4 text-center">
                    {card.start_date
                      ? new Date(card.start_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {card.expiry_date
                      ? new Date(card.expiry_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-center">{card.reader_name}</td>
                  <td className="py-3 px-4 text-center">
                    {card.address || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {card.max_books_allowed}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {card.notes || "N/A"}
                  </td>
                  <td
                    className={`py-3 px-4 text-center font-semibold ${
                      card.is_locked ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {card.is_locked ? (
                      <span className="flex items-center justify-center">
                        <LockClosedIcon className="h-5 w-5 mr-1" />
                        Đã khóa
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <LockOpenIcon className="h-5 w-5 mr-1" />
                        Đang hoạt động
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex space-x-2 justify-center">
                    <Link
                      to={`/librarycards/edit/${card.card_number}`}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(card.card_number)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    {card.is_locked && (
                      <button
                        onClick={() => handleUnlock(card.card_number)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <LockOpenIcon className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-4 px-4 text-center">
                  Không tìm thấy thẻ thư viện nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        <div>
          <span className="text-sm text-gray-700">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến{" "}
            {Math.min(pagination.page * pagination.limit, totalCards)} trong
            tổng số {totalCards} thẻ thư viện
          </span>
        </div>

        <div className="flex space-x-2 mt-2 md:mt-0">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-3 py-1 rounded ${
              pagination.page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            }`}
          >
            Trước
          </button>
          <span className="px-3 py-1">{pagination.page}</span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page * pagination.limit >= totalCards}
            className={`px-3 py-1 rounded ${
              pagination.page * pagination.limit >= totalCards
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            }`}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryCardList;
