const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function getDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Converts the string date from getDate() to a formatted date string
 * @returns {string} formatted date string {Month Day, Year}
 */
export function getFormattedDate() {
    const dateStr = getDate();
    const [day, month, year] = dateStr.split('/');
    const monthName = monthNames[parseInt(month) - 1];

    return `${monthName} ${day}, ${year}`;
}