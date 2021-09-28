import { EuiButton, EuiDataGrid, EuiImage, EuiText } from "@elastic/eui";
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

const gameColumns = [
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

const miniColumns = [
  {
    id: "name",
    displayAsText: "Nama",
    defaultSortDirection: "asc",
  },
  {
    id: "name_ingame",
    displayAsText: "Nama Ingame",
  },
  {
    id: "phone_number",
    displayAsText: "Whatsapp",
  },
];

const talkshowColumns = [
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

const DataContext = createContext();

const SearchTable = ({ data, typeData }) => {
  // ** Pagination config
  const [columns, setColumns] = useState([]);
  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState([]);
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

  const onColumnResize = useRef((eventData) => {
    // console.log(eventData);
  });

  const trailingControlColumns = [
    {
      id: 'actions',
      width: 100,
      headerCellRender: () => null,
      rowCellRender: ({rowIndex})=>{
        console.log(data[rowIndex]['id_pendaftaran'])
        return <EuiButton size={'s'}>hello</EuiButton>
      }
    }
  ];

  useEffect(() => {
    //console.log(typeData);
    if (typeData == "talkshow") {
      setColumns(talkshowColumns);
    } else if (typeData == "game") {
      setColumns(gameColumns);
    } else if (typeData == "mini") {
      setColumns(miniColumns);
    }
  }, [typeData]);

  useEffect(() => {
    console.log(columns);
    let arr = [];
    columns.map((col) => {
      console.log(col);
      arr.push(col.id);
    });
    setVisibleColumns(arr);
  }, [columns]);

  return (
    <DataContext.Provider value={data}>
      <EuiDataGrid
        aria-label="Data grid demo"
        columns={columns}
        rowCount={data.length}
        trailingControlColumns={trailingControlColumns}
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
                  {players.map((player, index) => {
                    return (
                      <p key={index}>
                        - {player.name} [{player.name_ingame}] (
                        {player.phone_number})
                      </p>
                    );
                  })}
                </EuiText>
              );
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

export default SearchTable;
