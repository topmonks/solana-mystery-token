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
}: {
  createMystery: () => Promise<void>;
  openMystery: () => Promise<void>;
  claimMystery: () => Promise<void>;
  boxState: string | null;
}) => {
  return (
    <CTAButton
      onClick={async () => {
        if (!boxState) {
          await createMystery();
        } else if (boxState === "created") {
          await openMystery();
        } else if (boxState === "opened") {
          await claimMystery();
        }
      }}
      variant="contained"
    >
      {boxState === "created"
        ? "OPEN"
        : boxState === "opened"
        ? "CLAIM"
        : "CREATE"}
    </CTAButton>
  );
};
