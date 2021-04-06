export const getExpirationTime = ({expires}) => {
    const now = new Date();
    const expireDate = new Date(expires);
    return Math.ceil((expireDate - now) / 1000);
};

export const arrayToEnum = (arr) => {
    const obj = {};
    arr.forEach((value, index) => {
        obj[value] = index + 1;
        obj[index + 1] = value;
    });
    return obj;
};
