export function getDaysLeftFromDate(dateString) {
  // Step 1: Get the current date
  const currentDate = new Date();

  // Step 2: Parse the given date
  const givenDate = new Date(dateString);

  // Step 3: Calculate the difference in milliseconds
  const differenceInMs = givenDate - currentDate;

  // Step 4: Convert milliseconds to days
  const daysLeft = differenceInMs / (1000 * 60 * 60 * 24);

  // Round the result to get whole days
  const roundedDaysLeft = Math.round(daysLeft) < 0 ? 0 : Math.round(daysLeft);

  // Convert the number of days left to a string and return it
  return `${roundedDaysLeft} d left`;
}

export function formatDateToCustomFormat(dateStr) {
  const originalDate = new Date(dateStr);
  const formattedDate = `${originalDate.toLocaleString("default", {
    month: "short",
  })} ${originalDate.getDate()}, ${originalDate.getFullYear()}`;
  return formattedDate;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { hour: "2-digit", minute: "2-digit" };
  const timeString = date.toLocaleTimeString("en-US", options);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `${timeString} . ${formattedDate}`;
}

export function pollSelect(dateString) {
  // console.log('dateString: ', dateString);
  const [number, unit] = dateString.split(" ");
  const numericValue = parseInt(number);

  const currentDate = new Date();

  // Calculate the new date using the ES6 spread operator
  let newDate;
  if (unit === "day" || unit === "days") {
    newDate = new Date(
      currentDate.getTime() + numericValue * 24 * 60 * 60 * 1000
    );
  } else if (unit === "week" || unit === "weeks") {
    newDate = new Date(
      currentDate.getTime() + numericValue * 7 * 24 * 60 * 60 * 1000
    );
  }
  // Format the new date as ISO 8601 with UTC timezone
  // const formattedDate = newDate && newDate.toISOString();
  // console.log('newDate: ', newDate);
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  const hours = String(newDate.getHours()).padStart(2, "0");
  const minutes = String(newDate.getMinutes()).padStart(2, "0");
  const seconds = String(newDate.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

export function calculateTimeDifference(created_at, poll_end_date) {
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const oneWeek = 7 * oneDay; // One week in milliseconds

  const startDate = new Date(created_at);
  const endDate = new Date(poll_end_date);
  const timeDifference = endDate - startDate;

  if (timeDifference <= oneDay) {
    return '1 day';
  } else if (timeDifference <= 3 * oneDay) {
    return '3 days';
  } else if (timeDifference <= oneWeek) {
    return '1 week';
  } else if (timeDifference <= 2 * oneWeek) {
    return '2 weeks';
  } else {
    return '2 weeks';
  }
};