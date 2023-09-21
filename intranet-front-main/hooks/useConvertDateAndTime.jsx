const useConvertDateAndTime = (schdulePost, hour, minute, sunTime) => {
  const date = new Date(schdulePost);
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "short" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const formattedDate = `${dayOfWeek}, ${month} ${day}, ${hour}:${minute} ${sunTime}`;
  return formattedDate;
};

export default useConvertDateAndTime;
