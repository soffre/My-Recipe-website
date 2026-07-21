import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Account from './pages/Account';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetail from './pages/RecipeDetail';
import ExploreRecipes from './pages/Explore';
import QuickAndEasy from './pages/QuickAndEasy';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import WriteGuide from './pages/Writeguide';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminConsole from './pages/admin/AdminConsole';

function AuthRoute({ children }) {
  const { user } = useAuth();

  if (user.role !== 'anonymous') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Account />} />
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path='/create-recipe' element={<CreateRecipe/>} />
        </Route>
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/explore" element={<ExploreRecipes />} />
        <Route path="/quick-and-easy" element={<QuickAndEasy />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/:id" element={<GuideDetail />} />
        <Route path="/guides/write" element={<WriteGuide />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

        <Route path="/admin" element={<AdminConsole />} />
       <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignUp />
            </AuthRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthRoute>
              <VerifyEmail />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          }
        />
    </Routes>
  );
}
