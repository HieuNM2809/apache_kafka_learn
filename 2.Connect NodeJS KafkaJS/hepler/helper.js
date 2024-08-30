const getCurrentFormattedTime = () => {
    const currentTime  = new Date();
    const year         = currentTime.getFullYear();
    const month        = (currentTime.getMonth() + 1).toString().padStart(2, '0');
    const day          = currentTime.getDate().toString().padStart(2, '0');
    const hours        = currentTime.getHours().toString().padStart(2, '0');
    const minutes      = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds      = currentTime.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedTime;
};
module.exports = { getCurrentFormattedTime };
