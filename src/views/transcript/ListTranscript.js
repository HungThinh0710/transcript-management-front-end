import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CFormLabel,
  CForm,
  CFormInput
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilArrowThickToBottom, cilArrowThickFromBottom } from "@coreui/icons";
import { Table, Pagination, IconButton } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import axios from "axios";
import * as API from "../../api";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import CheckDetailTransaction  from "../../api/Transaction";

const rowKey = "id";
// eslint-disable-next-line react/prop-types
const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
  <Table.Cell {...props}>
    <CIcon
      icon={
        // eslint-disable-next-line react/prop-types
        expandedRowKeys.some((key) => key === rowData[rowKey]) ? cilArrowThickFromBottom : cilArrowThickToBottom
      }
      size="sm"
      appearance="subtle"
      onClick={() => {
        onChange(rowData);
      }}
    />
  </Table.Cell>
);

const renderRowExpanded = (rowData) => {
  return (
    <div>
      <p><b>Transaction ID:</b> {rowData.trxID}</p>
      <p><b>Block number:</b> {rowData.block_number}</p>
      <p><b>Payload hash:</b> {rowData.payload_hash}</p>
    </div>
  );
};

const ListTranscript = () => {
  const [loading, setLoading] = React.useState(false);
  const [perpage, setPerpage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = useState(null);
  const [payloadTable, setPayloadTable] = useState([]);
  const [visibleNewClass, setVisibleNewClass] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);

  // Check Detail Section
  const [detailTrxID, setDetailTrxID] = useState("");
  const [detailStudentID, setDetailStudentID] = useState("");
  const [payloadResultDetail, setPayloadResultDetail] = useState(null);

  // Create & Update Class
  const [creClassId, setCreClassId] = useState("");
  const [creClassName, setCreClassName] = useState("");
  const [creCode, setCreCode] = useState("");
  const [creStartYear, setCreStartYear] = useState("");

  // Confirm Dialog
  const [visibleConfirmDialog, setVisibleConfirmDialog] = useState(false);
  const [isConfirmDialog, setIsConfirmDialog] = useState(false);
  const [idRowForDelete, setIdRowForDelete] = useState(null);

  const history = useHistory();
  const cancelTokenSource = axios.CancelToken.source();

  const handleChangePerpage = dataKey => {
    setPerpage(dataKey);
    fetchTablePayload(page, dataKey);
  };

  const onChangePage = page => {
    setPage(page);
    fetchTablePayload(page, perpage);
  };

  // eslint-disable-next-line react/prop-types
  const ActionCell = ({ rowData, dataKey, onChange, ...props }) => {
    return (
      <Table.Cell {...props} style={{ padding: "6px" }}>
        <CButton
          appearance="link"
          onClick={() => {
            handleEdit(rowData);
          }}
        >
          Edit
        </CButton>
        <CButton
          color="danger"
          style={{ marginLeft: "2px" }}
          onClick={() => {
            handleDelete(rowData);
          }}
        >
          Delete
        </CButton>
      </Table.Cell>
    );
  };

  const handleEdit = rowData => {
    setCreClassId(rowData.id.toString());
    setCreClassName(rowData.class_name);
    setCreCode(rowData.code);
    setCreStartYear((rowData.start_year.toString()));
    setIsUpdate(true);
    setVisibleNewClass(!visibleNewClass);
  };

  const handleExpanded = (rowData, dataKey) => {
    let open = false;
    const nextExpandedRowKeys = [];

    expandedRowKeys.forEach((key) => {
      if (key === rowData[rowKey]) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });

    if (!open) {
      nextExpandedRowKeys.push(rowData[rowKey]);
    }
    setExpandedRowKeys(nextExpandedRowKeys);
  };

  const handleDelete = rowData => {
    setIdRowForDelete(rowData.id);
    setVisibleConfirmDialog(!visibleConfirmDialog);
  };

  const deleteRow = (id) => new Promise((resolve, reject) => {
      axios({
        method: "DELETE",
        url: API.CLIENT_UPDATE_CLASSES, // TODO: Change to Delete
        data: {
          // class_id: null // TODO: Insert class Id here
        },
        withCredentials: true
      })
        .then(function(response) {
          console.log(response.data.success);
          if (response.data.success === true) {
            resolve(response.data.message);
          }
        })
        .catch((error) => {
          // setIsLoading(false);
          switch (error.response.data.code) {
            case 422:
              reject("The given data was invalid.");
            default:
              reject(error.response.data.message);
          }
        });
    }
  );

  const createAndEditClassAPI = () => new Promise((resolve, reject) => {
      const classAPI = API.CLIENT_UPDATE_CLASSES;
      const method = isUpdate === true ? "PATCH" : "POST";

      axios({
        method: method,
        url: classAPI,
        data: {
          class_id: creClassId,
          class_name: creClassName,
          code: creCode,
          start_year: creStartYear
        },
        withCredentials: true
      })
        .then(function(response) {
          console.log(response.data.success);
          if (response.data.success === true) {
            resolve(response.data.message);
          }
        })
        .catch((error) => {
          // setIsLoading(false);
          switch (error.response.data.code) {
            case 422:
              reject("The given data was invalid.");
            default:
              reject(error.response.data.message);
          }
        });
    }
  );

  const fetchTablePayload = (page = 1, perpage = 10) => {
    setPayloadTable([]);
    setLoading(true);
    axios.get(`${API.CLIENT_GET_TRANSCRIPT}?page=${page}&perpage=${perpage}`, {
      withCredentials: true,
      cancelToken: cancelTokenSource.token
    })
      .then(function(response) {
        if (response.status === 200) {
          const payload = response.data;
          setLoading(false);
          setPayloadTable(payload.data);
          setPagination(payload);
        }
      })
      .catch(function(error) {
        setLoading(false);
        console.log(error);
        switch (error.response.status) {
          case 401:
            toast.error("You are not logged in.", {
              theme: "colored"
            });
            history.push("/login");
            break;
          case 403:
            toast.error(error.response.data.message, {
              theme: "colored"
            });
            history.push("/dashboard");
            break;
          default:
            toast.error(error.response.data.message, {
              theme: "colored"
            });
            break;
        }
      });
  };

  const validateClassPayload = () => {
    const isValid = creCode.length > 0 && creClassName.length > 0 && creStartYear.length > 0;
    if (isUpdate && creClassId.length < 0)
      return false;
    return isValid === true && (parseInt(creStartYear) > 0);
  };

  const createClassSubmitted = () => {
    if (validateClassPayload()) {
      toast.promise(
        createAndEditClassAPI,
        {
          pending: "Please waiting...",
          success: {
            render({ data }) {
              fetchTablePayload();
              setCreClassName("");
              setCreStartYear("");
              setCreCode("");
              setIsUpdate(false);
              setVisibleNewClass(!visibleNewClass);
              return data;
            }
          },
          error: {
            render({ data }) {
              return data;
            }
          }
        }
      );
    } else
      toast.warning("You need to fill in the form!");
  };

  const handleOnRowClick = data => {
    setDetailTrxID(data.trxID)
    setDetailStudentID(data.student_code)
  }

  const onCheckDetailTransaction = () => {
    history.push({
      pathname: '/transcript/detail',
      search: `?trxID=${detailTrxID}&studentID=${detailStudentID}`,
      state: {
        trxID: detailTrxID,
        studentID: detailStudentID
      }
    })
  }

  const onCheckTraceTransaction = () => {
    history.push({
      pathname: '/transcript/trace',
      search: `?studentID=${detailStudentID}`,
      state: {
        studentID: detailStudentID
      }
    })
  }

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    if (payloadTable.length <= 0) {
      fetchTablePayload(page, perpage);
    }
    if (isConfirmDialog && idRowForDelete != null) {
      console.log("Confirm has been clicked");
      console.log("ID WILL DEL: " + idRowForDelete);
      toast.promise(
        deleteRow(idRowForDelete),
        {
          pending: "Please waiting...",
          success: {
            render({ data }) {
              console.log("Deleted");
              setIsConfirmDialog(!isConfirmDialog);
              setIdRowForDelete(null);
              setVisibleConfirmDialog(!visibleConfirmDialog);
              return data;
            }
          },
          error: {
            render({ data }) {
              console.log("Delete failed");
              setIsConfirmDialog(!isConfirmDialog);
              setIdRowForDelete(null);
              setVisibleConfirmDialog(!visibleConfirmDialog);
              return data;
            }
          }
        }
      );
    } else {
      return;
    }

    return () => cancelTokenSource.cancel();
  }, [isConfirmDialog, idRowForDelete]);

  return (
    <CRow>
      <ConfirmDialog visible={visibleConfirmDialog} onClick={setVisibleConfirmDialog} onConfirm={setIsConfirmDialog} />
      <CModal alignment="center" visible={visibleNewClass} onClose={() => setVisibleNewClass(false)}>
        <CModalHeader>
          <CModalTitle>Class Form</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Class Name</CFormLabel>
              <CFormInput
                value={creClassName}
                onChange={(e) => setCreClassName(e.target.value)}
                type="text"
                placeholder="Class name" />
            </div>
            <div className="mb-3">
              <CFormLabel>Code</CFormLabel>
              <CFormInput
                value={creCode}
                onChange={(e) => setCreCode(e.target.value)}
                type="text"
                placeholder="Code of class" />
            </div>
            <div className="mb-3">
              <CFormLabel>Start Year</CFormLabel>
              <CFormInput
                value={creStartYear}
                onChange={(e) => setCreStartYear(e.target.value)}
                type="number"
                placeholder="Start year" />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleNewClass(false)}>
            Close
          </CButton>
          <CButton
            onClick={() => {
              createClassSubmitted();
            }}
            color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
      <CCol xs={8}>
        <CCard className="mb-4">
          <div className="p-3 d-flex flex-row">
            <CButton
              variant={"outline"}
              onClick={() => {
                history.push('/transcript/new')
              }}
              color="success">New Transcript</CButton>
          </div>
          <CCardHeader>List Transcript</CCardHeader>
          <CCardBody>
            <Table
              virtualized
              loading={loading}
              height={400}
              data={payloadTable}
              rowKey={rowKey}
              expandedRowKeys={expandedRowKeys}
              renderRowExpanded={renderRowExpanded}
              onRowClick={handleOnRowClick}
            >
              <Table.Column width={70} align="center">
                <Table.HeaderCell>#</Table.HeaderCell>
                <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} />
              </Table.Column>
              <Table.Column width={50} align="center">
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.Cell dataKey="id" />
              </Table.Column>
              <Table.Column>
                <Table.HeaderCell>Transaction ID</Table.HeaderCell>
                <Table.Cell dataKey="trxID" />
              </Table.Column>
              <Table.Column>
                <Table.HeaderCell>Class Name</Table.HeaderCell>
                <Table.Cell>
                  {
                    rowData => {
                      return rowData.class_room.class_name;
                    }
                  }
                </Table.Cell>
              </Table.Column>
              <Table.Column>
                <Table.HeaderCell>Student ID</Table.HeaderCell>
                <Table.Cell dataKey="student_code" />
              </Table.Column>
              <Table.Column>
                <Table.HeaderCell>Student Name</Table.HeaderCell>
                <Table.Cell dataKey="student_name" />
              </Table.Column>
              <Table.Column width={200}>
                <Table.HeaderCell>Action</Table.HeaderCell>
                <ActionCell dataKey="id" />
              </Table.Column>
            </Table>
            <div style={{ padding: 20 }}>
              {pagination != null ? (<Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={["total", "-", "limit", "|", "pager", "skip"]}
                total={pagination.total}
                limitOptions={[1, 10, 25, 50, 100]}
                limit={perpage}
                activePage={pagination.current_page}
                onChangePage={onChangePage}
                onChangeLimit={handleChangePerpage}
              />) : null}

            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>Check detail</CCardHeader>
          <CCardBody>
            <CForm>
              <CFormLabel>Check a Transcript</CFormLabel>
              <div className="mb-3 d-flex flex-row">
                <CFormInput
                  type="text"
                  style={{ width: "70%", marginRight: "5px" }}
                  placeholder="Transaction ID"
                  value={detailTrxID}
                  onChange={(e)=>{setDetailStudentID(e.target.value)}}
                />
                <CButton
                  color="info"
                  style={{ width: "30%" }}
                  onClick={onCheckDetailTransaction}
                >Check</CButton>
              </div>
              <CFormLabel>Trace Transaction</CFormLabel>
              <div className="mb-3 d-flex flex-row">
                <CFormInput
                  type="text"
                  style={{ width: "70%", marginRight: "5px" }}
                  placeholder="Enter a StudentID for trace"
                  value={detailStudentID}
                  onChange={(e)=>{setDetailStudentID(e.target.value)}}
                />
                <CButton
                  color="success"
                  onClick={onCheckTraceTransaction}
                  style={{ width: "30%" }}>Trace</CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ListTranscript;
