import prisma from '../../../lib/prisma'
import markdownIt from 'markdown-it';

const md = markdownIt({
    html: false, 
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true
});

export default async (req, res) => {
    const { number } = req.query
    try {
        const prismaOutput = await prisma.updates.findMany({ 
        where: {
            postNumber: +number
        },
        include: {
            Accounts: true
        }
        });
        if (!prismaOutput || !prismaOutput?.length || !prismaOutput[0]) {
            return res.json({});
        }
        prismaOutput[0].parsedText = md.renderInline(prismaOutput[0].text);
        res.json(prismaOutput[0]);
    } catch (err) {
        console.error(err);
        return res.json({});
    }
}
