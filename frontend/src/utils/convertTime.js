function convertTime(myDateTime) {
    let myDate = new Date(myDateTime).toLocaleDateString('en-GB');
    let myTime = new Date(myDateTime).toLocaleTimeString('en-GB');
    console.log(myDateTime)
    return `${myDate} | ${myTime}`;
}

export default convertTime;