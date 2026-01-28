import  { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "../generated/prisma/client.js";

console.log("DataBase Connected")
const connectionString = "postgresql://postgres:postgres@localhost:5432/app_db?schema=public"

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });

export default prisma;