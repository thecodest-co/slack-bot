const stringSimilarity = require('string-similarity');
const anniversaryService = require('../../helpers/google-anniversary-spreadsheet-service');
const userService = require('../../helpers/user-service');

const SIMILARITY_THRESHOLD = 0.7;

exports.func = async () => {
    const anniversaryUsers = await anniversaryService.getValidAnniversaryUsers();
    const slackUsers = await userService.getSlackUsers();

    let offset = 0;
    anniversaryUsers.forEach((user) => {
        const slackUser = slackUsers.find(
            (item) => stringSimilarity.compareTwoStrings(user.name, item.real_name) > SIMILARITY_THRESHOLD,
        );

        if (slackUser) {
            anniversaryService.scheduleAnniversaryMessageForUser(slackUser, offset);
            offset += 1;
        }
    });

    return 'success';
};
