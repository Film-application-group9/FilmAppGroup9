const parseDate = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('en-GB'); // dd/mm/yyyy
    const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // hh:mm
    return `${formattedDate.replace(/\//g, '.')} ${formattedTime}`;
};

export {parseDate}