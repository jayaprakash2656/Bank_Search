import React from "react";
// import { Input } from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";

export default class GlobalSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredData: [],
      columnSearch: "",
      searchInput: ""
    };
  }

  handleChange = event => {
    const val = event.target.value;
    this.setState({ searchInput: val }, () => this.globalSearch());
    this.props.handleSetSearchInput(val);
  };

  globalSearch = () => {
    const { searchInput, columnSearch } = this.state;
    let filteredData = this.props.data.filter(value => {
      if (columnSearch) {
        return value[columnSearch]
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      }
      return (
        value.bank_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.district.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.ifsc
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        value.branch.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.city.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.state.toLowerCase().includes(searchInput.toLowerCase())
      );

    });

    this.props.handleSetFilteredData(filteredData);
  };

  setColumnSearch = e => {
    this.setState({ columnSearch: e.target.value }, () => this.globalSearch());
  };

  render() {
    return (
      <>
        <br />
        <TextField
          size="large"
          name="searchInput"
          value={this.state.searchInput || ""}
          onChange={this.handleChange}
          label="Search"
          fullWidth
        />
        <br />
        <br />
      </>
    );
  }
}
