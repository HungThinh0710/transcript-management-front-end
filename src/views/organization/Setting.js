import React, { useEffect, useRef, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow, CFormSwitch, CSpinner
} from "@coreui/react";
import * as API from "../../api";
import { Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { FetchAPI } from "../../api/FetchAPI";

const Setting = () => {
  const [payloadSetting, setPayloadSetting] = useState({
    is_direct_submit_transcript: false,
    is_activate_email_domain: false
  });
  const [isLoading, setIsLoading] = useState(true);

  const convertSettingToNumber = (status) => {
    if (status === 0)
      return 1;
    else
      return 0;
  };

  const onChangeSwitch = (e) => {
    let settingChange;
    switch (e.target.id) {
      case "directSubmit":
        settingChange = ({
          ...payloadSetting,
          is_direct_submit_transcript: convertSettingToNumber(payloadSetting.is_direct_submit_transcript)
        });
        fetchChangeSetting(settingChange);
        break;
      case "activeEmailDomain":
        settingChange = ({
          ...payloadSetting,
          is_activate_email_domain: convertSettingToNumber(payloadSetting.is_activate_email_domain)
        });
        fetchChangeSetting(settingChange);
        break;
    }
  };

  const fetchChangeSetting = (payload) => {
    toast.promise(
      FetchAPI("POST", API.CLIENT_CHANGE_ORG_SETTING, payload),
      {
        pending: "Please waiting...",
        success: {
          render({ data }) {
            setPayloadSetting(payload);
            return data.message;
          }
        },
        error: {
          render({ data }) {
            return data.data.message;
          }
        }
      }
    );
  };


  const fetchSetting = () => {
    FetchAPI("GET", API.CLIENT_GET_ORG_SETTING)
      .then(payload => {
        const settings = payload.setting;
        setPayloadSetting({
          is_direct_submit_transcript: settings.is_direct_submit_transcript,
          is_activate_email_domain: settings.is_activate_email_domain
        });
        setIsLoading(false);

      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
        toast.error(error.data.message);
      });
  };
  useEffect(() => {
    fetchSetting();
  }, []);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Setting</CCardHeader>
          <CCardBody>
            {
              isLoading ? (
                <>
                  <div className="text-center">
                    <CSpinner
                      color="info"
                    /> <p>Loading Setting...</p>
                  </div>
                </>) :
                (<>
                  <CFormSwitch
                    id="directSubmit"
                    checked={payloadSetting.is_direct_submit_transcript}
                    onChange={onChangeSwitch}
                    label="Direct submit Transcript to Blockchain" />
                  <CFormSwitch
                    id="activeEmailDomain"
                    checked={payloadSetting.is_activate_email_domain}
                    onChange={onChangeSwitch}
                    label="Activate email domain" />
                </>)
            }

          </CCardBody>
        </CCard>


      </CCol>
    </CRow>
  );
};
export default Setting;
