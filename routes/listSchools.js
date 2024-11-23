const express = require("express");
const router = express.Router();
const db = require("../db");

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180; //helper function to convert degrees to radians because the Haversine formula requires angles in radians
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1); //differences in latitudes and longitudes between the two points
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2); //a = square of half the chord length between two points.

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); //angular distance in radians
  return R * c; // Distance in km
};

router.get("/listSchools", (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  const sql = "SELECT * FROM schools";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const sortedSchools = results
      .map((school) => {
        const distance = haversineDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude
        );
        return { ...school, distance };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  });
});

module.exports = router;
