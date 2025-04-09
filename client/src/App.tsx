import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Collections from "./pages/Collections";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from './pages/About';
import { CartProvider } from "./context/CartContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/collections" component={Collections} />
      <Route path="/collections/:id" component={Collections} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/account" component={Account} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <CartProvider>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </CartProvider>
  );
}

export default App;