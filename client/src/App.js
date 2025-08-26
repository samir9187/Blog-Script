
import { Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './Components/login.js';
import Register from './Components/register.js';
import Layout from './Components/layout.js';
import IndexPage from './Components/IndexPage.js';
import CreatePost from './Components/CreatePost.js';
import ViewPost from './Components/ViewPost.js';
import UserPosts from './Components/UserPosts.js';
import EditPost from './Components/EditPost.js';
function App() {
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element = {<IndexPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/create' element={<CreatePost />} />
        <Route path='/:id' element={<div><ViewPost /></div>} />
        <Route path='/userposts/:username' element={<UserPosts />} />
        <Route path='/editPost/:id' element={<EditPost />} />
      </Route>
    </Routes>
    </div>
  );
}

export default App;


// import { useState } from 'react'; // Add this import
// import { Route, Routes } from 'react-router-dom';
// import './App.css'
// import Login from './Components/login.js';
// import Register from './Components/register.js';
// import Layout from './Components/layout.js';
// import IndexPage from './Components/IndexPage.js';
// import CreatePost from './Components/CreatePost.js';
// import ViewPost from './Components/ViewPost.js';
// import UserPosts from './Components/UserPosts.js';
// import EditPost from './Components/EditPost.js';

// function App() {
//   const [darkMode, setDarkMode] = useState(false);

//   return (
//     <div className={darkMode ? "App dark-mode" : "App"}>
//       <button
//         style={{
//           position: 'fixed',
//           top: 15,
//           right: 15,
//           zIndex: 9999,
//           borderRadius: '20px',
//           padding: '8px 16px',
//           cursor: 'pointer'
//         }}
//         onClick={() => setDarkMode(!darkMode)}
//       >
//         {darkMode ? '☀️' : '🌙'}
//       </button>
//       <Routes>
//         <Route path='/' element={<Layout />}>
//           <Route index element={<IndexPage />} />
//           <Route path='/login' element={<Login />} />
//           <Route path='/register' element={<Register />} />
//           <Route path='/create' element={<CreatePost />} />
//           <Route path='/:id' element={<div><ViewPost /></div>} />
//           <Route path='/userposts/:username' element={<UserPosts />} />
//           <Route path='/editPost/:id' element={<EditPost />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// }

// export default App;