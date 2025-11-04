const express = require('express');
const router = express.Router();
const neo4jDriver = require('../neo');

// Create a course node
router.post('/courses', async (req, res) => {
  const session = neo4jDriver.session();
  const { courseCode, title } = req.body;
  try {
    await session.run(
      'MERGE (c:Course {courseCode: $courseCode, title: $title}) RETURN c',
      { courseCode, title }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

// Add a prerequisite relationship
router.post('/courses/prerequisite', async (req, res) => {
  const session = neo4jDriver.session();
  const { courseCode, prereqCode } = req.body;
  try {
    await session.run(
      `MATCH (c1:Course {courseCode: $courseCode}),
             (c2:Course {courseCode: $prereqCode})
       MERGE (c1)-[:REQUIRES]->(c2)`,
      { courseCode, prereqCode }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

// Query prerequisites for a course
router.get('/courses/:courseCode/prerequisites', async (req, res) => {
  const session = neo4jDriver.session();
  const { courseCode } = req.params;
  try {
    const result = await session.run(
      `MATCH (c:Course {courseCode: $courseCode})-[:REQUIRES*]->(prereq:Course)
       RETURN prereq`,
      { courseCode }
    );
    const prerequisites = result.records.map(r => r.get('prereq').properties);
    res.json({ prerequisites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

module.exports = router;