import {
  EuiFieldSearch,
  EuiFormRow,
  EuiPageTemplate,
  EuiSelect,
  EuiSpacer,
} from "@elastic/eui";
import axios from "axios";
import React, { useState } from "react";
import Header from "../Utils/Header";
import SearchTable from "../Utils/SearchTable";

const Search = () => {
  const [searchVal, setSearchVal] = useState("");
  const [selectVal, setSelectVal] = useState("");
  const [searchLoad, setSearchLoad] = useState(false);
  const [data, setData] = useState([]);

  function selectChange(e) {
    let val = e.target.value;
    setSearchVal(val);
  }

  function searchChange(e) {
    let val = e.target.value;
    setSearchVal(val);
    if(val !== "")
    {
        setSearchLoad(searchLoad => setSearchLoad(true));
        axios
      .get(
        `https://api.himti.my.id/data/player/talkshow?id_pendaftaran=${val}`,
        {
          headers: {
            Authorization: "asigasigasig",
          },
        }
      )
      .then((res) => {
          setData(res.data)
          setSearchLoad(searchLoad => setSearchLoad(false));
        })
      .catch((err) => console.log(err));
    }
  }

  return (
    <EuiPageTemplate
      style={{ width: "100%", marginTop: 60 }}
      pageHeader={{
        pageTitle: "Data Management",
      }}
    >
      <Header />
      <EuiFormRow label="Tipe data">
        <EuiSelect
          options={[
            {
              value: "Talkshow",
              text: "talkshow",
            },
          ]}
          value={selectVal}
          onChange={selectChange}
        />
      </EuiFormRow>
      <EuiSpacer size={'s'}/>
      <EuiFieldSearch
        placeholder="Cari Data"
        value={searchVal}
        onChange={searchChange}
        isLoading={searchLoad}
      />
      <SearchTable data={data}/>
    </EuiPageTemplate>
  );
};

export default Search;
