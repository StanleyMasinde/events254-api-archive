// This script will generate a username based on the first and last name for all users.
// It will also check to see if the username is already in use.
// when the username is in use, it will add a number to the end of the username.
// The number will start at 1 and increment until the username is available.
// The username will be saved in the user's profile.

const User = require('./app/models/user');

(async () => {
    try {
        const users = await User.all();
        users.forEach(async (user) => {
            if (!user.username) {
                console.log(`${user.name} has no username`)
                let username = user.name.split(' ').join('').toLowerCase();
                let usernameExists = await User.where({ username }).first();
                if (usernameExists) {
                    console.log(`${username} is already in use`);
                    let i = 1;
                    while (usernameExists) {
                        username = username + i;
                        usernameExists = await User.where({ username }).first();
                        i++;
                    }
                }
                console.log(`${user.name}'s username is ${username}`)
                await user.update({ username });
            }
        })
    } catch (err) {
        console.log(err);
    }
})();