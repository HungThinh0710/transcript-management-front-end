import React, { useCallback, useEffect, useState } from "react";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CFormLabel,
  CForm,
} from "@coreui/react";

// eslint-disable-next-line react/prop-types
export const ConfirmDialog = ({ visible, onClick, onConfirm }) => {

  const handleClick = useCallback(() => {
    console.log("Clicked");
    onClick(visible);
  }, [onClick]);

  const handleConfirm = useCallback(() => {
    console.log("Confirm");
    onConfirm(true);
  }, [onConfirm]);

  return (
    <CModal alignment="center" visible={visible} onClose={handleClick}>
      <CModalHeader>
        <CModalTitle>Confirmation Dialog</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel>Class Name</CFormLabel>

          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={()=> {onClick(!visible)}}>
          Close
        </CButton>
        <CButton
          onClick={handleConfirm}
          color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ConfirmDialog;
