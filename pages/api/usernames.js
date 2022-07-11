import { map } from 'lodash'
import prisma from '../../lib/prisma'

export const getUsernames = (params = {}) => prisma.account.findMany(params).then(u => map(u, 'username'))

export default async (req, res) => getUsernames().then(u => res.json(u || []))
