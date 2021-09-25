import { EuiDataGrid, EuiImage, EuiText } from "@elastic/eui";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useRef,
} from "react";

const DataContext = createContext();

const columns = [
  {
    id: "team_name",
    displayAsText: "Nama Tim",
    defaultSortDirection: "asc",
  },
  {
    id: "team_logo",
    displayAsText: "Logo",
  },
  {
    id: "players",
    displayAsText: "Pemain",
  },
];

const GameTable = ({ data }) => {
  // ** Pagination config
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const onChangeItemsPerPage = useCallback(
    (pageSize) =>
      setPagination((pagination) => ({
        ...pagination,
        pageSize,
        pageIndex: 0,
      })),
    [setPagination]
  );
  const onChangePage = useCallback(
    (pageIndex) =>
      setPagination((pagination) => ({ ...pagination, pageIndex })),
    [setPagination]
  );

  // ** Sorting config
  const [sortingColumns, setSortingColumns] = useState([]);
  const onSort = useCallback(
    (sortingColumns) => {
      setSortingColumns(sortingColumns);
    },
    [setSortingColumns]
  );

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState(() =>
    columns.map(({ id }) => id)
  );

  const onColumnResize = useRef((eventData) => {
    // console.log(eventData);
  });

  return (
    <DataContext.Provider value={data}>
      <EuiDataGrid
        aria-label="Data grid demo"
        columns={columns}
        rowCount={data.length}
        columnVisibility={{ visibleColumns, setVisibleColumns }}
        renderCellValue={({ rowIndex, columnId }) => {
          // console.log(data[rowIndex][columnId] + " " + columnId)
          switch (columnId) {
            case "team_logo":
              return <EuiImage size={70} src={data[rowIndex][columnId]} />;
              break;
            case "players":
              let players = data[rowIndex][columnId];
              return (
                <EuiText>
                  {players.map((player, index) =>{
                    return (
                      <p key={index}>- {player.name} [{player.name_ingame}] ({player.phone_number})</p>
                    )
                  })}
                </EuiText>
              )
              break;

            default:
              return data[rowIndex][columnId];
              break;
          }
        }}
        inMemory={{ level: "sorting" }}
        sorting={{ columns: sortingColumns, onSort }}
        pagination={{
          ...pagination,
          pageSizeOptions: [5, 10, 50],
          onChangeItemsPerPage: onChangeItemsPerPage,
          onChangePage: onChangePage,
        }}
        onColumnResize={onColumnResize.current}
      />
    </DataContext.Provider>
  );
};

export default GameTable;
