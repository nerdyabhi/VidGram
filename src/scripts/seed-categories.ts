import { categories } from "@/db/schema";
import { db } from "@/db";
// TODO : Create a script to seed categories
const categoryNames = [
    "Programming Tutorials",
    "Tech Reviews",
    "Coding Challenges",
    "Developer Interviews",
    "Web Development",
    "Mobile App Development",
    "Gadget Unboxings",
    "Startup Stories",
    "Gaming & Entertainment",
    "Software Engineering",
    "Digital Art & Animation",
    "AI & Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "VR & AR Experiences"
]

async function main() {
    console.log("Seeding categories...");

    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `Videos related to ${name.toLowerCase()}`
        }))

        await db.insert(categories).values(values);
        console.log("Seeding succesfully ")
    } catch (error) {
        console.log("Error seeding categories", error);

    }

}

main();