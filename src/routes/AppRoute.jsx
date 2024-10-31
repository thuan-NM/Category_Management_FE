import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthorList from '../pages/Author/AuthorList';
import AuthorForm from '../pages/Author/AuthorForm';
import BookList from '../pages/Book/BookList';
import BookForm from '../pages/Book/BookForm';
import BorrowingList from '../pages/Borrowing/BorrowingList';
import BorrowingForm from '../pages/Borrowing/BorrowingForm';
import EmployeeList from '../pages/Employee/EmployeeList';
import EmployeeForm from '../pages/Employee/EmployeeForm';
import GenreList from '../pages/Genre/GenreList';
import GenreForm from '../pages/Genre/GenreForm';
import LibraryCardList from '../pages/LibraryCard/LibraryCardList';
import LibraryCardForm from '../pages/LibraryCard/LibraryCardForm';
import PublisherList from '../pages/Publisher/PublisherList';
import PublisherForm from '../pages/Publisher/PublisherForm';
import ReaderList from '../pages/Reader/ReaderList';
import ReaderForm from '../pages/Reader/ReaderForm';
import BorrowingDetailsList from '../pages/BorrowingDetail/BorrowingDetailList';
import BorrowingDetailsForm from '../pages/BorrowingDetail/BorrowingDetailForm';

const AppRoutes = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Navigate to="/authors" replace />} />

      <Route path="/authors" element={<AuthorList />} />
      <Route path="/authors/new" element={<AuthorForm />} />
      <Route path="/authors/edit/:id" element={<AuthorForm />} />
      <Route path="/books" element={<BookList />} />
      <Route path="/books/new" element={<BookForm />} />
      <Route path="/books/edit/:id" element={<BookForm />} />
      <Route path="/borrowings" element={<BorrowingList />} />
      <Route path="/borrowings/new" element={<BorrowingForm />} />
      <Route path="/borrowings/edit/:id" element={<BorrowingForm />} />

      <Route path="/borrowingdetails" element={<BorrowingDetailsList />} />
      <Route path="/borrowingdetails/new" element={<BorrowingDetailsForm />} />
      <Route path="/borrowingdetails/edit/:id" element={<BorrowingDetailsForm />} />

      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/employees/new" element={<EmployeeForm />} />
      <Route path="/employees/edit/:id" element={<EmployeeForm />} />

      <Route path="/genres" element={<GenreList />} />
      <Route path="/genres/new" element={<GenreForm />} />
      <Route path="/genres/edit/:id" element={<GenreForm />} />

      <Route path="/librarycards" element={<LibraryCardList />} />
      <Route path="/librarycards/new" element={<LibraryCardForm />} />
      <Route path="/librarycards/edit/:number" element={<LibraryCardForm />} />

      <Route path="/publishers" element={<PublisherList />} />
      <Route path="/publishers/new" element={<PublisherForm />} />
      <Route path="/publishers/edit/:id" element={<PublisherForm />} />

      <Route path="/readers" element={<ReaderList />} />
      <Route path="/readers/new" element={<ReaderForm />} />
      <Route path="/readers/edit/:id" element={<ReaderForm />} />

      {/* ... các route khác */}
    </Routes>
  </MainLayout>
);

export default AppRoutes;
