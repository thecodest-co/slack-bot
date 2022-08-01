const R = require('ramda');
const stringSimilarity = require('string-similarity');
const anniversaryService = require('../../helpers/google-anniversary-spreadsheet-service');
const userService = require('../../helpers/user-service');

const SIMILARITY_THRESHOLD = 0.7;

exports.func = async () => {
    const anniversaryUsers = await anniversaryService.getValidAnniversaryUsers();
    const slackUsers = await userService.getSlackUsers();

    let offset = 0;
    R.forEach((user) => {
        const slackUser = R.find(
            (item) => stringSimilarity.compareTwoStrings(user.name, item.real_name) > SIMILARITY_THRESHOLD,
            slackUsers,
        );

        if (R.not(R.isNil(slackUser))) {
            anniversaryService.scheduleAnniversaryMessageForUser(slackUser, offset);
            offset += 1;
        }
    }, anniversaryUsers);

    return 'success';
};
