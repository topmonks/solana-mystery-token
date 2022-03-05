import styled from "styled-components";
import Button from "@mui/material/Button";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

export const CTAButton = styled(Button)`
  display: block !important;
  margin: 0 auto !important;
  background-color: #fe9110 !important;
  min-width: 120px !important;
  font-size: 1em !important;
  cursor: pointer !important;
  padding: 15px 64px !important;
`;

export const PlayButton = ({
  createMystery,
  openMystery,
  claimMystery,
  boxState,
  mysteryValue,
}: {
  createMystery: () => Promise<void>;
  openMystery: () => Promise<void>;
  claimMystery: () => Promise<void>;
  boxState: string | null;
  mysteryValue: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <CircularProgress
        style={{ marginTop: "10px", width: "60px", height: "60px" }}
      />
    );
  } else {
    return (
      <CTAButton
        onClick={async () => {
          setIsLoading(true);

          if (!boxState) {
            await createMystery();
          } else if (boxState === "created") {
            await openMystery();
          } else if (boxState === "opened") {
            await claimMystery();
          }
          setIsLoading(false);
        }}
        variant="contained"
        disabled={
          (boxState === "created" || boxState === "opened") &&
          mysteryValue < 0.001
        }
      >
        {boxState === "created"
          ? "OPEN"
          : boxState === "opened"
          ? "CLAIM"
          : "CREATE"}
      </CTAButton>
    );
  }
};
