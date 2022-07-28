import prisma from '../../../lib/prisma'

const restrictedUsernames = [
    'api',
    'judging',
    'post',
    'board'
];

const usernameRegex = /^[0-9A-Za-z\-\_\.]{2,20}$/;

const verifyUsername = async username => usernameRegex.test(username) && !restrictedUsernames.includes(username);

export default async function updateUserData (req, res) {
    try {
        const newUser = req.body;
        if (!verifyUsername(newUser.username)) return res.json({success:false, reason: 'Invalid username. 2-20, alphanumeric, -_. allowed'});
        const updateUser = await prisma.account.update({
            where: {
                id: newUser.id
            },
            data: {
                ...newUser
            },
        });
        console.log(updateUser)
        res.json({success:true,reload:false});
    } catch (err) {
        if (alphanumeric(err?.message) == alphanumeric('Invalid `prisma.account.update()` invocation: Unique constraint failed on the fields: (`username`)')) return res.json({success:false, reason: 'Username taken.'});
        return res.json({success:false,reason:err?.message})
    }
}

function alphanumeric (data) {
    return data.split().filter(c => ('abcdefghijklmnopqrstuvwxyz0123456789').includes(c.toLowerCase())).join('');
}