import prisma from '../../../lib/prisma'

export default async function updateUserData (req, res) {
    const newUser = req.body;
    console.log({newUser})
    const updateUser = await prisma.account.update({
        where: {
            id: newUser.id
        },
        data: {
            ...newUser
        },
    })
    res.json({success:true});
}