export const complaintCategories = ["water", "electricity", "road", "drainage", "garbage", "streetlight", "other"];
export const priorities = ["low", "medium", "high", "urgent"];
export const workerCategories = ["plumber", "electrician", "carpenter", "mason", "cleaner", "painter", "mechanic", "gardener"];
export const certificateTypes = ["income", "residence", "caste", "birth-forwarding", "death-forwarding"];

export const titleCase = (value = "") =>
  value
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
