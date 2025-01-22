// import { BrowserRouter as Route, Router, Routes } from 'react-router-dom';
import { Router, Route, Routes } from 'react-router-dom';
import ClaimForm from './component/ClaimForm';
import Home from './component/Home';
import ViewData from './component/ViewData';
// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <div>
       <h1>Claim Management System</h1>
       <Routes>
            <Route exact path="/" element={<Home />} />  {/* Home Route */}
            <Route path="/view-data" element={<ViewData />} />
            <Route path="/claim-form" element={<ClaimForm />} />
       </Routes>
       
    </div>
  );
}

export default App;
