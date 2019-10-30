import React, { Component } from 'react';
import ReactTable from 'react-table'
import {
  NotificationContainer,
  NotificationManager
} from 'react-notifications';
import CardBox from '../component/CardBox/index'
import SearchComponent from "./searchComponent";
import { Card, CardBody, Row, Col } from 'reactstrap';
import AutoComplete from './autoColmplete'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Checkbox from '@material-ui/core/Checkbox';

//Import links for Api
import links from '../apiLink.json'

//Import style
import '../asset/style/table.css'

const suggestions = [
  { value: 'MUMBAI', label: 'Mumbai' },
  { value: 'CHENNAI', label: 'Chennai' },
  { value: 'BENGALURU', label: 'Bengaluru'},
  { value: 'DELHI', label: 'Delhi' },
  { value: 'PUNE', label: 'Pune' },
].map(suggestion => ({
  value: suggestion.value,
  label: suggestion.label,
}));
var localStor = require('local-storage');


class JobTemplateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paginat: false,
      defaultPage: 0,
      bankDetails: [],
      searchInput: "",
      filteredData: [],
      selectedEnd: [suggestions[0]],
      selected: {},
      selectAll: 0,
    }
    this.toggleRow = this.toggleRow.bind(this);
  }


  toggleRow(ifsc) {
    const newSelected = Object.assign({}, this.state.selected);
    newSelected[ifsc] = !this.state.selected[ifsc];
    this.setState({
      selected: newSelected,
      selectAll: 2
    }, () => {
      if (this.state.selected[ifsc] === true) {
        localStor('selectedbank', this.state.selected)
        localStor('selected', this.state.selectAll)
      }
      else if (this.state.selected[ifsc] === false) {
        localStor.remove('selectedbank');
        localStor.remove('selected');
      }
    });

  }



  toggleSelectAll() {
    let newSelected = {};

    if (this.state.selectAll === 0) {
      this.state.bankDetails.forEach(x => {
        newSelected[x.ifsc] = true;
      });
    }

    this.setState({
      selected: newSelected,
      selectAll: this.state.selectAll === 0 ? 1 : 0
    }, () => {
      localStor('selectall', this.state.selectAll)
      localStor('selectedall', this.state.selected)
      if (this.state.selectAll === 0) {
        localStor.remove('selectedbank');
        localStor.remove('selected');
      }
    });
  }

  //Displaying details of all the bank
  AllBank() {
    // console.log(selectedEnd)
    fetch(links.bankDetailsApi + `?city=${this.state.selectedEnd.value ? this.state.selectedEnd.value : suggestions[0].value}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(json => {
        if (json[0] === 200) {
          this.setState({ bankDetails: json[1] }, () => {

          });
        }
      })
      .catch(error =>
        this.setState(
          {
            error,
            isLoading: false
          },
          NotificationManager.error("Server unexpectedly lost the connection. Please try after some time."),

        ),
      );
  }

  handleSetFilteredData = filteredData => {
    this.setState({ filteredData });
  };

  handleSetSearchInput = searchInput => {
    this.setState({ searchInput });
  };
  handleChange = selectedEnd => {
    this.setState({ selectedEnd },()=>{
      // console.log(`List Value`,this.state.selectedEnd.value)
      this.AllBank()
    });
  };

  componentDidMount() {
    this.AllBank()
    if (localStor.get('selectall')) {
      localStor.get('selectall') && this.setState({ selectAll: localStor.get('selectall') });
      localStor.get('selectedall') && this.setState({ selected: localStor.get('selectedall') });
      localStor.remove('selectedbank');
      localStor.remove('selected');
    }
    else if (localStor.get('selected')) {
      localStor.get('selectedbank') && this.setState({ selected: localStor.get('selectedbank') });
      localStor.get('selected') && this.setState({ selectAll: localStor.get('selected') });
      localStor.remove('selectall');
      localStor.remove('selectedall');
    }
    else {
      localStor.remove('selectedbank');
      localStor.remove('selected');
      localStor.remove('selectall');
      localStor.remove('selectedall');
    }
  }
  render() {
    const dataToDisplay = this.state.searchInput.length ? this.state.filteredData : this.state.bankDetails;
    return (
      <Row
        style={{
          margin: "0px"
        }}>
        <Col md="1" />
        <Col md="10">
          <CardBox>
            <Card
              style={{ border: "none" }}>
              <CardBody>
                <h3>Bank Branches</h3>
                <br />
                <Row>
                  <Col md="4">
                    <AutoComplete
                      label="City"
                      options={suggestions}
                      value={this.state.selectedEnd}
                      onChange={this.handleChange}
                    />
                  </Col>
                  <Col md="4" />
                  <Col md="4">
                    <SearchComponent
                      data={this.state.bankDetails}
                      //columns={this.state.columns}
                      handleSetFilteredData={this.handleSetFilteredData}
                      handleSetSearchInput={this.handleSetSearchInput}
                    />
                  </Col>
                </Row>
                <ReactTable
                  data={dataToDisplay}
                  columns={
                    [
                      {
                        Header: "Action",
                        Cell: ({ original }) => {
                          return (
                          <FormControlLabel
                              control={<Checkbox icon={<FavoriteBorder />} 
                              checkedIcon={<Favorite />}
                              className="checkbox"
                              color="primary"
                              checked={this.state.selected[original.ifsc] === true}
                              onChange={() => this.toggleRow(original.ifsc)}
                           />
                          );
                        //},Remove all
                        // Header: x => {
                        //   return (
                        //     <Checkbox
                        //       // type="checkbox"
                        //       className="checkbox"
                        //       checked={this.state.selectAll === 1}
                        //       indeterminate
                        //       inputRef={input => {
                        //         if (input) {
                        //           input.indeterminate = this.state.selectAll === 2;
                        //                    }
                        //       }}
                        //       onChange={() => this.toggleSelectAll()}
                        //     />
                        //   );
                        // },
                        width: 100,
                        foldable: true,
                      },

                      {
                        Header: "Bank Name",
                        accessor: "bank_name",
                        width: 200,
                        foldable: true,
                      },
                      {
                        Header: "Ifsc Code",
                        accessor: "ifsc",
                        width: 150,
                        foldable: true
                      },
                      {
                        Header: "Branch",
                        accessor: "branch",
                        width: 150,
                        foldable: true
                      },
                      {
                        Header: "city",
                        accessor: "city",
                        width: 150,
                        foldable: true
                      },
                      {
                        Header: "District",
                        accessor: "district",
                        width: 150,
                        foldable: true
                      },

                      {
                        Header: "state",
                        accessor: "state",
                        width: 150,
                        foldable: true
                      },
                    ]}

                  defaultPageSize={10}
                  style={{
                    height: "500px"
                  }}
                  showPaginationBottom={true}
                  className="-highlight"
                  defaultFilterMethod={(filter, row, column) => {
                    const id = filter.pivotId || filter.id;
                    return row[id] !== undefined
                      ? String(row[id])
                        .toLowerCase()
                        .indexOf(filter.value.toLowerCase()) !== -1
                      : true;
                  }}
                  // pivotBy={["bank_name"]}

                />

              </CardBody>
              <NotificationContainer />
            </Card>
          </CardBox>
        </Col>
        <Col md="1" />
      </Row>
    );
  }
}
export default JobTemplateTable;
