import express from "express";
import bodyParser from "body-parser";
import { SelfBackendVerifier } from "@selfxyz/core";

const app = express();
app.use(bodyParser.json());

const allowedIds = 3;

const selfBackendVerifier = new SelfBackendVerifier(
  "docs",
  "https://docs.self.xyz/api/verify",
  false,
  allowedIds,
  {
    minimumAge: 18,
    excludedCountries: ["IRN", "PRK", "RUS", "SYR"],
    ofac: true,
  },
  "uuid"
);

// Helper function to determine age group
function getAgeGroup(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age >= 18 && age <= 25) return "18-25";
  if (age > 25 && age <= 40) return "25-40";
  return "40+";
}

app.post("/api/verify", async (req, res) => {
  try {
    const { attestationId, proof, publicSignals, userContextData } = req.body;
    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return res.status(200).json({
        status: "error",
        result: false,
        reason:
          "Proof, publicSignals, attestationId and userContextData are required",
      });
    }

    const result = await selfBackendVerifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    const { isValid, isMinimumAgeValid, isOfacValid } = result.isValidDetails;
    if (!isValid || !isMinimumAgeValid || !isOfacValid) {
      let reason = "Verification failed";
      if (!isMinimumAgeValid) reason = "Minimum age verification failed";
      if (!isOfacValid) reason = "OFAC verification failed";
      return res.status(200).json({
        status: "error",
        result: false,
        reason,
      });
    }

    const ageGroup = getAgeGroup(result.discloseOutput.dateOfBirth);
    const gender = result.discloseOutput.gender;

    return res.status(200).json({
      status: "success",
      result: true,
      ageGroup,
      gender,
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      result: false,
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
