import prisma from '../../../lib/prisma'
import markdownIt from 'markdown-it';
import md5 from 'md5';

const md = markdownIt({
    html: false, 
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true
});

 export const emailToPfp = email => {
     if (email == "") return "";

    console.log('emailtopfp', email);
    if (!email) return '';
     return "https://www.gravatar.com/avatar/" + md5(email?.toLowerCase()?.trim()) + '?d=identicon&r=pg';
 }

export default async (req, res) => {
    const { number } = req.query
    try {
        const prismaOutput = await prisma.updates.findMany({ 
        where: {
            postNumber: +number
        },
        include: {
            Accounts: true,
            collaborators: {
                include: {
                    Accounts: true
                }
            }
        }
        });
        if (!prismaOutput || !prismaOutput?.length || !prismaOutput[0]) {
            return res.json({});
        }
        prismaOutput[0].users = [
            emailToPfp(prismaOutput[0].Accounts.email)
        ];
        prismaOutput[0].collaborators?.forEach(collaborator => {
            prismaOutput[0].users.push(emailToPfp(collaborator.Accounts.email));
        });
        prismaOutput[0].parsedText = md.renderInline(prismaOutput[0].text);
        res.json(prismaOutput[0]);
    } catch (err) {
        console.error(err);
        return res.json({});
    }
}
