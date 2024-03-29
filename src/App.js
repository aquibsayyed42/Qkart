import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
import { ThemeProvider } from "@mui/system";
import theme from "./theme";

export const config = {
  endpoint: `qkart.aquibsayyad.com/api/v1`,
};

function App() {
  return (
    <ThemeProvider theme={theme} >
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      
        <Switch>
          <Route exact path="/" component={Products} />
          <Route path="/products" component={Products} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/thanks" component={Thanks} />
        </Switch>
  
    </div>
    </ThemeProvider>
  );
}

export default App;
