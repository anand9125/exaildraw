import  { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "../generated/prisma/client.js";

console.log("DataBase Connected")
const connectionString = "postgresql://neondb_owner:npg_ED3NkSTaur0Q@ep-little-night-ai1tg66f-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });

export default prisma;