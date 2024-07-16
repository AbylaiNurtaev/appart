import { Route, Routes } from 'react-router-dom';
import './index.css';
import Layout from './Layout';
import AdminLayout from './AdminLayout';
import HomePage from './pages/HomePage/HomePage';
import AboutUsPage from './pages/AboutUsPage/AboutUsPage';
import ContactsPage from './pages/ContactsPage/ContactsPage';
import ArticlesPage from './pages/ArticlesPage/ArticlesPage';
import AppartmentsPage from './pages/AppartmentsPage/AppartmentsPage';
import FullItemPage from './pages/FullItemPage/FullItemPage';
import AdminPage from './pages/AdminPage/AdminPage';
import FullArticle from './pages/FullArticle/FullArticle';
import PoliticalPage from './pages/PoliticalPage/PoliticalPage';
import AdminAppartments from './components/adminPages/AdminAppartments/AdminAppartments';
import BasicAppartments from './components/adminPages/BasicAppartments/BasicAppartments';
import BasicArticles from './components/adminPages/BasicArticles/BasicArticles';
import AArticles from './components/adminPages/AArticles/AArticles';
import QuestionsPage from './components/adminPages/QuestionsPage/QuestionsPage';
import OrdersPage from './components/adminPages/OrdersPage/OrdersPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<HomePage />} />
          <Route path='/about-us' element={<AboutUsPage />} />
          <Route path='/contacts' element={<ContactsPage />} />
          <Route path='/articles' element={<ArticlesPage />} />
          <Route path='/articles/:id' element={<FullArticle />} />
          <Route path='/appartments' element={<AppartmentsPage />} />
          <Route path='/policy' element={<PoliticalPage />} />
          <Route path='/appartments/:lot' element={<FullItemPage />} />
        </Route>

        <Route path='/admin' element={<AdminLayout />} >
          <Route index element={<AdminPage/>}></Route>
          <Route element={<AdminAppartments/>} path='/admin/Appartments'></Route>
          <Route element={<AdminAppartments/>} path='/admin/Appartments/:lot'></Route>
          <Route element={<BasicAppartments/>} path='/admin/basicAppartments'></Route>
          <Route element={<BasicArticles/>} path='/admin/basicArticles'></Route>
          <Route element={<AArticles/>} path='/admin/AArticles'></Route>
          <Route element={<AArticles/>} path='/admin/AArticles/:title'></Route>
          <Route element={<QuestionsPage/>} path='/admin/questions'></Route>
          <Route element={<OrdersPage/>} path='/admin/orders'></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
