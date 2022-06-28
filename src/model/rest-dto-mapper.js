function mapToErrorDTO(message, error) {
    return JSON.stringify({
        message,
        error: error.message,
    });
}

function mapToBaseDTO(message) {
    return JSON.stringify({
        message,
    });
}

module.exports = {
    mapToErrorDTO,
    mapToBaseDTO,
};
