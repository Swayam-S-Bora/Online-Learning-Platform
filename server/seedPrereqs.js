require('dotenv').config();
const neo4jDriver = require('./neo');
const fs = require('fs');

async function seedNeo4jCoursesAndPrereqs() {
  const session = neo4jDriver.session();
  const courseData = JSON.parse(fs.readFileSync('./data/course-data.json', 'utf-8'));
  const prereqData = JSON.parse(fs.readFileSync('./data/course-prereq.json', 'utf-8'));

  try {
    // 1. Create all Course nodes
    for (const course of courseData) {
      await session.run(
        `MERGE (c:Course {courseCode: $courseCode, title: $title})`, 
        { courseCode: course.courseCode, title: course.title }
      );
    }

    // 2. Create all prerequisite relationships
    for (const rel of prereqData) {
      await session.run(
        `MATCH (c1:Course {courseCode: $courseCode}), (c2:Course {courseCode: $prereqCode})
         MERGE (c1)-[:REQUIRES]->(c2)`, rel
      );
    }
    console.log('Neo4j courses and prerequisites seeded successfully');
  } catch (err) {
    console.error('Error seeding Neo4j:', err);
  } finally {
    await session.close();
    await neo4jDriver.close();
    process.exit(0);
  }
}

seedNeo4jCoursesAndPrereqs();