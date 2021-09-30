import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiDataGrid,
  EuiFieldText,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormRow,
  EuiImage,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiPopover,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import axios from "axios";
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
  {
    id: "nim",
    displayAsText: "NIM",
  },
];

const DataContext = createContext();

const FormEdit = ({
  data,
  rowIndex,
  typeData,
  setModalVisible,
  setModalSuccessVisible,
}) => {
  const [dataForm, setDataForm] = useState(data[rowIndex]);

  function onChangeForm(e) {
    setDataForm((dataForm) => ({
      ...dataForm,
      [e.target.ariaLabel]: e.target.value,
    }));
  }

  function onSubmitEdit() {
    axios
      .put(`https://api.himti.my.id/data/edit/${typeData}`, dataForm, {
        headers: {
          Authorization: "asigasigasig",
        },
      })
      .then((res) => {
        //console.log(res.data);
        setModalVisible(false);
        setModalSuccessVisible(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      {data[rowIndex].id_pendaftaran ? (
        <EuiFormRow label="ID Pendaftaran">
          <EuiFieldText
            fullWidth
            value={dataForm.id_pendaftaran}
            readOnly
          />
        </EuiFormRow>
      ) : (
        ""
      )}
      <EuiFormRow label="Nama">
        <EuiFieldText
          aria-label="name"
          fullWidth
          value={dataForm.name}
          onChange={onChangeForm}
        />
      </EuiFormRow>
      <EuiSpacer />
      <EuiFormRow label="Email">
        <EuiFieldText
          aria-label="email"
          fullWidth
          value={dataForm.email}
          onChange={onChangeForm}
        />
      </EuiFormRow>
      {data[rowIndex].nim ? (
        <EuiFormRow label="NIM">
          <EuiFieldText
            aria-label="nim"
            fullWidth
            value={dataForm.nim}
            onChange={onChangeForm}
          />
        </EuiFormRow>
      ) : (
        ""
      )}
      <EuiFormRow label="No HP">
        <EuiFieldText
          aria-label="phone_number"
          fullWidth
          value={dataForm.phone_number}
          onChange={onChangeForm}
        />
      </EuiFormRow>
      {data[rowIndex].name_ingame ? (
        <EuiFormRow label="Name in game">
          <EuiFieldText
            aria-label="name_ingame"
            fullWidth
            value={dataForm.name_ingame}
            onChange={onChangeForm}
          />
        </EuiFormRow>
      ) : (
        ""
      )}
      <EuiSpacer />
      <EuiButton onClick={onSubmitEdit}>Ubah</EuiButton>
    </div>
  );
};

const SearchTable = ({ data, typeData, setData }) => {
  // ** Pagination config
  const [columns, setColumns] = useState([]);
  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const closePopover = () => setIsPopoverVisible(false);
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

  const actions = [
    <EuiContextMenuItem icon="apmTrace" key="modal">
      hello
    </EuiContextMenuItem>,
  ];

  const trailingControlColumns = [
    {
      id: "actions",
      width: 40,
      headerCellRender: () => null,
      rowCellRender: function RowCellRender({ rowIndex }) {
        // console.log(data[rowIndex].id ?? data[rowIndex].team_id);
        const [isPopoverVisible, setIsPopoverVisible] = useState(false);
        const closePopover = () => setIsPopoverVisible(false);

        const [isModalVisible, setIsModalVisible] = useState(false);
        const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
        const [modalSuccessVisible, setModalSuccessVisible] = useState(false);

        const closeModal = () => setIsModalVisible(false);
        const closeModalDelete = () => setIsModalDeleteVisible(false);
        const closeModalSuccess = () => {
          setData([]);
          setModalSuccessVisible(false);
        };

        const showModal = () => {
          closePopover();
          setIsModalVisible(true);
        };
        const showModalDelete = () => {
          closePopover();
          setIsModalDeleteVisible(true);
        };

        const deleteItem = (userId) => {
          //console.log("user id = " + userId);
          //console.log("tipe data = " + typeData);
          axios
            .delete(`https://api.himti.my.id/data/delete/${typeData}`, {
              headers: {
                Authorization: "asigasigasig",
              },
              data: {
                id: userId,
              },
            })
            .then((res) => {
              //console.log(res.data);
              setIsModalDeleteVisible(false);
              setModalSuccessVisible(true);
            })
            .catch((err) => {
              console.log(err);
            });
        };

        let modal, modalSuccess;

        if (modalSuccessVisible) {
          modalSuccess = (
            <EuiModal
              key="success"
              onClose={closeModalSuccess}
              style={{ width: 500, backgroundColor: "green" }}
            >
              <EuiModalHeader>
                <EuiModalHeaderTitle>
                  <h2>Data berhasil dihapus atau diubah</h2>
                </EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>
                <EuiText>
                  <p>Aksi berhasil dilakukan.</p>
                </EuiText>
              </EuiModalBody>

              <EuiModalFooter>
                <EuiButton onClick={closeModalSuccess} fill>
                  Tutup
                </EuiButton>
              </EuiModalFooter>
            </EuiModal>
          );
        }

        if (isModalDeleteVisible) {
          modal = (
            <EuiModal
              key="delete"
              onClose={closeModalDelete}
              style={{ width: 500, backgroundColor: "red" }}
            >
              <EuiModalHeader>
                <EuiModalHeaderTitle>
                  <h2>
                    Anda yakin ingin menghapus{" "}
                    {data[rowIndex].name ?? data[rowIndex].team_name}?
                  </h2>
                </EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>
                <EuiText>
                  <p>
                    Jika Anda menghapus data ini, maka data tersebut{" "}
                    <strong>tidak dapat dikembalikan.</strong>
                  </p>
                </EuiText>
              </EuiModalBody>

              <EuiModalFooter>
                <EuiButton
                  onClick={() =>
                    deleteItem(data[rowIndex].id ?? data[rowIndex].team_id)
                  }
                  fill
                >
                  Hapus
                </EuiButton>
                <EuiButton onClick={closeModalDelete} fill>
                  Tutup
                </EuiButton>
              </EuiModalFooter>
            </EuiModal>
          );
        }

        if (isModalVisible) {
          modal = (
            <EuiModal key="edit" onClose={closeModal} style={{ width: 500 }}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>
                  <h2>Edit data untuk {data[rowIndex].name}</h2>
                </EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>
                <FormEdit
                  data={data}
                  rowIndex={rowIndex}
                  typeData={typeData}
                  setModalVisible={setIsModalVisible}
                  setModalSuccessVisible={setModalSuccessVisible}
                />
              </EuiModalBody>

              <EuiModalFooter>
                <EuiButton onClick={closeModal} fill>
                  Close
                </EuiButton>
              </EuiModalFooter>
            </EuiModal>
          );
        }

        const actions = [
          <EuiContextMenuItem icon="apmTrace" key="modal" onClick={showModal}>
            Edit data
          </EuiContextMenuItem>,
          <EuiContextMenuItem
            icon="apmTrace"
            key="delete"
            onClick={showModalDelete}
          >
            Delete
          </EuiContextMenuItem>,
        ];

        return (
          <>
            <EuiPopover
              isOpen={isPopoverVisible}
              panelPaddingSize="none"
              anchorPosition="upCenter"
              button={
                <EuiButtonIcon
                  aria-label="Show actions"
                  iconType="boxesHorizontal"
                  color="text"
                  onClick={() => setIsPopoverVisible(!isPopoverVisible)}
                />
              }
              closePopover={closePopover}
            >
              <EuiContextMenuPanel items={actions} size="s" title="Actions" />
            </EuiPopover>

            {modal}
            {modalSuccess}
          </>
        );
      },
    },
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
    //console.log(columns);
    let arr = [];
    columns.map((col) => {
      //console.log(col);
      arr.push(col.id);
    });
    setVisibleColumns(arr);
  }, [columns]);

  const RenderCellValue = useMemo(() => {
    return ({ rowIndex, columnId }) => {
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
    };
  });

  return (
    <DataContext.Provider value={data}>
      <EuiDataGrid
        aria-label="Data grid demo"
        columns={columns}
        rowCount={data.length}
        trailingControlColumns={trailingControlColumns}
        columnVisibility={{ visibleColumns, setVisibleColumns }}
        renderCellValue={RenderCellValue}
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
