import styled from "styled-components";
import Button from "@mui/material/Button";

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
  openCube,
}: {
  createMystery: () => Promise<void>;
  openMystery: () => Promise<void>;
  claimMystery: () => Promise<void>;
  boxState: string | null;
  mysteryValue: number;
  openCube: () => {};
}) => {
  return (
    <CTAButton
      onClick={async () => {
        if (!boxState) {
          await createMystery();
        } else if (boxState === "created") {
          await openMystery();
          openCube();
        } else if (boxState === "opened") {
          await claimMystery();
        }
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
};
