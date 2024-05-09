import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { BASEURL } from '../Constants/api';
import { DEFAULT_API_ERROR_MSG, DEFAULT_API_SUCCESS_MSG } from '../Constants/responses';

export const makeRequest = async (
    method : string,
    endpoint : string,
    body = {},
    customHeaders = {"ngrok-skip-browser-warning": "69420"}
  ) => {
    try {
      const token = Cookies.get("_auth");
  
      const headers = {
        Authorization: token ? `${token}` : '',
        ...customHeaders,
      };
      
      let requestOptions: {
        method: string;
        headers: Record<string, string>;
        body?: string | FormData; // Use a union type
      } | null = null;

      if (method.toUpperCase() == 'GET') {
        requestOptions = {
          method: method.toUpperCase(),
          headers,
        };
      } else {
        requestOptions = {
          method: method.toUpperCase(),
          headers,
          body: '',
        };
        if (body && (body instanceof FormData)) {
          requestOptions.body = body;
        } else if (body && (typeof body === 'object' || typeof body === 'string')) {
          requestOptions.body = body ? JSON.stringify(body) : '';
          requestOptions.headers['Content-Type'] = 'application/json';
        }
      }

      const response = await fetch(`${BASEURL}${endpoint}`, requestOptions);
      const responseData = await response.json();
  
      if (!response.ok) {
        toast.error(responseData.message || DEFAULT_API_ERROR_MSG);
      } else {
        if (method.toUpperCase() != 'GET') {
          toast.success(responseData.message || DEFAULT_API_SUCCESS_MSG);
        }
      }
  
      return responseData;
    } catch (error) {
      toast.error(`${DEFAULT_API_ERROR_MSG} - ${error}`)
      throw error;
    }
  };