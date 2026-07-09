export const formatOrdinalDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleDateString([], { month: "long" }); // Returns "July"

  // Figure out the right suffix (st, nd, rd, th)
  let suffix = "th";
  if (day < 11 || day > 13) {
    switch (day % 10) {
      case 1:
        suffix = "st";
        break;
      case 2:
        suffix = "nd";
        break;
      case 3:
        suffix = "rd";
        break;
    }
  }

  return `${day}${suffix} ${month}`;
};
