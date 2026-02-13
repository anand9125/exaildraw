import  { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "../generated/prisma/client.js";

console.log("DataBase Connected")
const connectionString = "postgresql://admin:secret@localhost:5432/exaildraw"

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });

export default prisma;