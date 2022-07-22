import { toast } from "react-toastify";

export const addressShortner = (addr) => {
  return `${addr.slice(0, 6)}...${addr.slice(addr.length-4, addr.length)}`
}

export const displayToast = (message, type) => {
  toast[type](message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}