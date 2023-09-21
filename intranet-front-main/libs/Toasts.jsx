
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toastify = (type, msg) => {
  toast(msg, {
    type: type,
    theme: 'colored',
    autoClose: 3000,
    pauseOnHover: false,
    draggable: false,
  })
}