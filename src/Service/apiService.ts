import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import { useSignOut } from "react-auth-kit";
import { BASEURL } from "../Constants/api";
import { Headers } from 'form-data';

export const fetchData = async (endpoint: string) => {
  const token = Cookies.get("_auth");

  const response = await fetch(
    `${BASEURL}${endpoint}`,
    {
      headers: {
        "Authorization": token,
        "ngrok-skip-browser-warning": "69420",
      } as HeadersInit
    }
  )
  // .then((response) => {
  //   if (response.ok) {
  //     return response.json();
  //   } else {
  //     if (response.status == 401) {
  //       console.log(token);
  //       return null;
  //     }
  //   }
  // }).then((data) => {
  //   if (data.result) {
  //     return data;
  //   } else if (data.data) {
  //     return data
  //   } else {
  //     return data;
  //   }
  // }).catch((error) => {
  //   toast.error(error ? error : 'Something went wrong!');
  //   console.log(error);
  // })

  const data = await response.json();

  if (!response.ok) {
    console.log(token);
    if (response.status == 401) {
      console.log(token);
    }
    // Handle Error Statuses
    toast.error(data.message ? data.message : 'Something went wrong!');
  } else {
    if (data.result) {
      return data;
    } else if(data.data) {
      return data;
    }
    toast.error(data.message ? data.message : 'Something went wrong!');
  }

  return data;
};

export const postJSONData = async (endpoint: string, payload: object) => {
  const token = Cookies.get("_auth")
  
  const response = await fetch(
    `${BASEURL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      } as Headers,
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (response.ok) {
    toast.success(data.message ? data.message : 'Success!');
  } else {
    toast.error(data.message ? data.message : 'Something went wrong!');
  }

  return data.result;
}

export const postFormData = async (endpoint: string, payload: FormData) => {
  const token = Cookies.get("_auth")

  const response = await fetch(
    `${BASEURL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Authorization": token,
        "ngrok-skip-browser-warning": "69420",
      } as Headers,
      body: payload as unknown as BodyInit,
    }
  );

  const data = await response.json();

  if (response.ok) {
    toast.success(data.message ? data.message : 'Success!');
  } else {
    toast.error(data.message ? data.message : 'Something went wrong!');
  }

  return data.result;
}

export const putJSONData = async (endpoint: string, payload: object) => {
  const token = Cookies.get("_auth")

  const response = await fetch(
    `${BASEURL}${endpoint}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
        "ngrok-skip-browser-warning": "69420",
      } as Headers,
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (response.ok) {
    toast.success(data.message ? data.message : 'Success!');
  } else {
    toast.error(data.message ? data.message : 'Something went wrong!');
  }

  return data.result;
}

export const putFormData = async (endpoint: string, payload: object) => {
  const token = Cookies.get("_auth");

  const response = await fetch(
    `${BASEURL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Authorization": token,
        "ngrok-skip-browser-warning": "69420",
      } as Headers,
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (response.ok) {
    toast.success(data.message ? data.message : 'Success!');
    return data.data;
  } else {
    toast.error(data.message ? data.message : 'Something went wrong!');
  }

  return data.result;
}

export const deleteData = async (endpoint: string) => {
  const token = Cookies.get("_auth");

  const response = await fetch(
    `${BASEURL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Authorization": token,
        "ngrok-skip-browser-warning": "69420",
      } as Headers
    }
  );

  const data = await response.json();

  if (response.ok) {
    toast.success(data.message ? data.message : 'Success!');
  } else {
    toast.error(data.message ? data.message : 'Something went wrong!');
  }

  return data.result;
}
