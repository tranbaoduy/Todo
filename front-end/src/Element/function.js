export function getFormattedDate(date) {
    date = new Date(date);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return day + '/' + month + '/' + year;
}



export function getFormattedDateTime(date) {
    date = new Date(date);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hh = date.getHours().toString().padStart(2, '0');;
    let mm = date.getMinutes().toString().padStart(2, '0');;
    return hh + " : " + mm + " | " + day + '/' + month + '/' + year;
}