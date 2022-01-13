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
    let hh = date.getHours().toString().padStart(2, '0');
    let mm = date.getMinutes().toString().padStart(2, '0');
    return hh + " : " + mm + " | " + day + '/' + month + '/' + year;
}

export function convertIso(date)
{
    date = new Date(date);
   
    var day = date.getDate().toString().padStart(2, '0');      
    var month = (1 + date.getMonth()).toString().padStart(2, '0');  
    var year = date.getFullYear();  
    var hour = date.getHours().toString().padStart(2, '0');    
    var minute = date.getMinutes().toString().padStart(2, '0'); 
    var second = "00.000"; // yields seconds
    if(hour === "24"){
        hour = "00"
    }
    // After this construct a string with the above results as below
    return year + "-" + month + "-" + day + "T" + hour + ':' + minute + ':' + second + "Z";
}