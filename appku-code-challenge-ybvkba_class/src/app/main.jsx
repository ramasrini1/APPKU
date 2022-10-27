import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./main.css";
import OrderTable from "./orderTable";

class App extends React.Component {
  
  render() {
    return <div className="orderTable mt-2">
              <OrderTable />
           </div>;
  }
}


export default App;
