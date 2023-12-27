export const LoginStart = (userCredentials) => ({
    type:"LOGIN_START",
});

export const LoginSucces = (user) =>({
   type:"LOGIN_SUCCESS",
   payload:user
});

export const LoginFailure = (error) => ({
    type : "LOGIN_FAILURE",
    payload:error
});

export const Follow = (userId) =>({
    type : "FOLLOW",
    payload : userId
});

export const Unfollow = (userId) =>({
    type : "UNFOLLOW",
    payload : userId
});

export const coverPic = (fileName) => ({
    type : "coverPic",
    payload : fileName
});

export const profilePic = (fileName) => ({
    type : "profilePic",
    payload : fileName
});

export const infoage = (age) => ({
    type : "INFOAGE",
    payload : age
});

export const inforel = (relationship) => ({
    type : "INFOREL",
    payload : relationship
});

export const infowork = (workat) => ({
    type : "INFOWORK",
    payload : workat
});