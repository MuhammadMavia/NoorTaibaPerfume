import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Collections from "./pages/Collections";
import Layout from "./components/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/collections" component={Collections} />
      <Route path="/collections/:id" component={Collections} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
