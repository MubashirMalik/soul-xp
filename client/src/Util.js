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

export const dateFormater = (day, month, year) => {
  let dateString = "";
  if (day < 9) {
    dateString += "0";
  } 
  dateString += day;
  dateString += "-";
  if (month < 9) {
    dateString += "0"
  }
  dateString += month;
  dateString += "-";
  dateString += year;

  return dateString
}

export const decodeDifficultly = (d) => {
  d = parseInt(d);
  if (d === 1) {
    return "Beginner";
  } else if (d === 2) {
    return "Intermediate"
  } else if (d === 3) {
    return "Advanced"
  } else if (d === 4) {
    return "Expert"
  } else {
    return "Unknown"
  }
}

export const decodeTestType = (tt) => {
  tt = parseInt(tt)
  if (tt === 1) {
    return "MCQs";
  } else if (tt === 2) {
    return "Problem Solving"
  } else {
    return "Unknown"
  }
}