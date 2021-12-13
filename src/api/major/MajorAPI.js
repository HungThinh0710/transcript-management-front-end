import axios from "axios";

const MajorAPI = (method = "UNKNOWN", endpoint = "", dataPayload = {}, page = 1, perpage = 10) => new Promise((resolve, reject) => {
    if (method === "GET") endpoint += `?page=${page}&perpage=${perpage}`;
    axios({
      method: method,
      url: endpoint,
      data: dataPayload,
      withCredentials: true
    })
      .then(function(response) {
        if (response.data.success === true) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        if(typeof error === "undefined"){
          reject(error.message)
        }
        reject(error.response);
      });
  }
);

export default MajorAPI;
