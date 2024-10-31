import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  UserIcon,
  DocumentDuplicateIcon // icon mới cho Borrowing Details
} from "@heroicons/react/24/outline";

const Sidebar = () => (
  <aside className="w-64 bg-gray-800 text-white h-screen fixed">
    <nav className="mt-10">
      <Link to="/authors" className="flex items-center py-2.5 px-4 hover:bg-gray-700">
        <UsersIcon className="h-5 w-5 mr-2" />
        Tác giả
      </Link>
      <Link to="/books" className="flex items-center py-2.5 px-4 hover:bg-gray-700">
        <BookOpenIcon className="h-5 w-5 mr-2" />
        Sách
      </Link>
      <Link to="/borrowings" className="flex items-center py-2.5 px-4 hover:bg-gray-700">
        <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
        Mượn sách
      </Link>
      <Link to="/borrowingdetails" className="flex items-center py-2.5 px-4 hover:bg-gray-700">
        <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
        Chi tiết Mượn
      </Link>
      <Link to="/employees" className="flex items-center py-2.5 px-4 hover:bg-gray-700">
        <UserGroupIcon className="h-5 w-5 mr-2" />
        Nhân viên
      </Link>
      <Link to="/genres" className="flex items-center py-2.5 px-4 hover:bg-gray-700">
        <BookOpenIcon className="h-5 w-5 mr-2" />
        Thể loại
      </Link>
      <Link to="/librarycards" className="flex items-center py-2.5 px-4 hover:bg-gray-700">
        <IdentificationIcon className="h-5 w-5 mr-2" />
        Thẻ thư viện
      </Link>
      <Link to="/publishers" className="flex items-center py-2.5 px-4 hover:bg-gray-700">
        <BuildingOfficeIcon className="h-5 w-5 mr-2" />
        Nhà xuất bản
      </Link>
      <Link to="/readers" className="flex items-center py-2.5 px-4 hover:bg-gray-700">
        <UserIcon className="h-5 w-5 mr-2" />
        Độc giả
      </Link>
    </nav>
  </aside>
);

export default Sidebar;
