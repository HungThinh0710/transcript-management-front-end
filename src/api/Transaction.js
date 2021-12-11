import React, { useCallback, useEffect, useState } from "react";
import * as API from "./index";
import axios from "axios";

const CheckDetailTransaction = () => new Promise((resolve, reject) => {
    axios({
      method: "GET", // tmp
      url: API.CLIENT_GET_CLASSES,
      data: {

      },
      withCredentials: true
    })
      .then(function(response) {
        console.log(response.data.success);
        if (response.data.success === true) {
          resolve({
            msg: response.data.message,
            payload: response.data
          });
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

export default CheckDetailTransaction;
