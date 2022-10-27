import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn, GridDetailRow, GridToolbar } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { IntlProvider, load, LocalizationProvider, loadMessages, IntlService } from '@progress/kendo-react-intl';
import likelySubtags from 'cldr-core/supplemental/likelySubtags';
import currencyData from 'cldr-core/supplemental/currencyData';
import weekData from 'cldr-core/supplemental/weekData';
import numbers from 'cldr-numbers-full/main/es/numbers';
import currencies from 'cldr-numbers-full/main/es/currencies';
import caGregorian from 'cldr-dates-full/main/es/ca-gregorian';
import dateFields from 'cldr-dates-full/main/es/dateFields';
import timeZoneNames from 'cldr-dates-full/main/es/timeZoneNames';
load(likelySubtags, currencyData, weekData, numbers, currencies, caGregorian, dateFields, timeZoneNames);
import { process } from '@progress/kendo-data-query';
import orders from './orders.json';
import "./main.css";

const DATE_FORMAT = 'yyyy-mm-dd hh:mm:ss.SSS';
const intl = new IntlService('es-ES');
orders.forEach(o => {
  //console.log(o.orderDate);
  o.orderDate = intl.parseDate(o.orderDate ? o.orderDate.toString() : '20/20/2020', DATE_FORMAT);
  o.shippedDate = intl.parseDate(o.shippedDate ? o.shippedDate.toString() : '20/20/2002', DATE_FORMAT);
  //console.log("after format " + o.orderDate)
});
class DetailComponent extends GridDetailRow {
  render() {
    const dataItem = this.props.dataItem;
    return <div>
            <section style={{
        width: "200px",
        float: "left"
      }}>
              <p><strong>Street:</strong> {dataItem.shipAddress.street}</p>
              <p><strong>City:</strong> {dataItem.shipAddress.city}</p>
              <p><strong>Country:</strong> {dataItem.shipAddress.country}</p>
              <p><strong>Postal Code:</strong> {dataItem.shipAddress.postalCode}</p>
            </section>
            <Grid style={{
        width: "500px"
      }} data={dataItem.details} />
          </div>;
  }
}
const dataState = {
  skip: 0,
  take: 15,
  sort: [{
    field: 'orderDate',
    dir: 'desc'
  }],
  group: [{
    field: 'customerID'
  }]
};
class OrderTable extends React.Component {
  state = {
    dataResult: process(orders, dataState),
    dataState: dataState,
  };
  dataStateChange = event => {
    this.setState({
      dataResult: process(orders, event.dataState),
      dataState: event.dataState
    });
  };
  expandChange = event => {
    const isExpanded = event.dataItem.expanded === undefined ? event.dataItem.aggregates : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    this.setState({
      ...this.state
    });
  };
  exportExcel = () => {
    if (this._export !== null) {
      this._export.save();
    }
  };
  exportPDF = () => {
    if (this._pdfExport !== null) {
      this._pdfExport.save();
    }
  };
  render() {
    return <div className="orderTable mt-2">
           
                <ExcelExport data={orders} ref={exporter => {
            this._export = exporter;
          }}>
                  <Grid style={{
              height: '700px'
            }} sortable={true} filterable={true} groupable={true} reorderable={true} pageable={{
              buttonCount: 4,
              pageSizes: true
            }} data={this.state.dataResult} {...this.state.dataState} onDataStateChange={this.dataStateChange} detail={DetailComponent} expandField="expanded" onExpandChange={this.expandChange}>
                    <GridToolbar>
                      <button title="Export to Excel" className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" onClick={this.exportExcel}>
                        Export to Excel
                      </button>&nbsp;
                      <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" onClick={this.exportPDF}>Export to PDF</button>
                    </GridToolbar>
                    <GridColumn field="customerID" width="200px" />
                    <GridColumn field="orderDate" filter="date" format="{0:D}" width="300px" />
                    <GridColumn field="shipName" width="280px" />
                    <GridColumn field="freight" filter="numeric" width="200px" />
                    <GridColumn field="shippedDate" filter="date" format="{0:D}" width="300px" />
                    <GridColumn field="employeeID" filter="numeric" width="200px" />
                    <GridColumn locked={true} field="orderID" filterable={false} title="ID" width="90px" />
                  </Grid>
                </ExcelExport>
                <GridPDFExport ref={element => {
            this._pdfExport = element;
          }} margin="1cm">
                  {<Grid data={process(orders, {
              skip: this.state.dataState.skip,
              take: this.state.dataState.take
            })}>
                    <GridColumn field="customerID" width="200px" />
                    <GridColumn field="orderDate" filter="date" format="{0:D}" width="300px" />
                    <GridColumn field="shipName" width="280px" />
                    <GridColumn field="freight" filter="numeric" width="200px" />
                    <GridColumn field="shippedDate" filter="date" format="{0:D}" width="300px" />
                    <GridColumn field="employeeID" filter="numeric" width="200px" />
                    <GridColumn locked={true} field="orderID" filterable={false} title="ID" width="90px" />
                  </Grid>}
                </GridPDFExport>
          </div>;
  }
}


export default OrderTable;
