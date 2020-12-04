module.exports.CODES = {
    SUCCESS: 200,
    INTERNAL_SERVER_ERROR: 500,
    ERROR_INVALID_PARAMS: 512, //wrong input
    ERROR_SYNC_TABLE: 520, //Common reason is connect to database fail.
    ERROR_DELETE_DENIED: 521, //Error can't delete. common reason is foreignKey Constraint
    ERROR_USER_EXISTED: 400,
    ERROR_WRONG_PASSWORD: 401,
    ERROR_USER_NOT_EXISTS: 411,
    ERROR_BAD_REQUEST: 400
};
