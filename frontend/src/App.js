import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />}></Route>
        <Route path="add" element={<AddProduct />}></Route>
        <Route path="edit/:id" element={<EditProduct />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
