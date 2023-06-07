import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./About";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import MySubGreddit from "./MySubGreddit";
import NotFound from "./NotFound";
import Profile from "./Profile";
import Protected from "./Protected";
import ProtectLogin from "./ProtectLogin";
import SavedPosts from "./SavedPosts";
import SubGreddit from "./SubGreddit";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<About />} />
          <Route path='/about' element={<About />} />
          <Route path='/home' element={<Protected child={<Home />}></Protected>} />
          <Route path='/profile' element={<Protected child={<Profile />}></Protected>} />
          <Route path='/login' element={<ProtectLogin child={<Login />}></ProtectLogin>} />
          <Route path='/saved-posts' element={<Protected child={<SavedPosts />}></Protected>} />
          <Route path='/my-sub-greddit' element={<Protected child={<MySubGreddit />}></Protected>} />
          <Route path='/sub-greddit/:name' element={<Protected child={<SubGreddit />}></Protected>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
