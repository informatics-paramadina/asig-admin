import { EuiDataGrid } from "@elastic/eui";
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
    id: "name",
    displayAsText: "Nama",
    defaultSortDirection: "asc",
  },
  {
    id: "email",
    displayAsText: "Email",
  },
  {
    id: "instansi",
    displayAsText: "Instansi",
  },
];

const Table = ({ data }) => {
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
            return data[rowIndex][columnId]
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

export default Table;
