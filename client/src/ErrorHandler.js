export const handleError = (err) => {
  let stIndex = err.indexOf("reason") + 9;
  let temp = err.substring(stIndex, err.length);
  let endIndex = temp.indexOf("}") - 1;
  return temp.substring(0, endIndex);
}