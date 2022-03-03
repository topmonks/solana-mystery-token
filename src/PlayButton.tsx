import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import {CircularProgress} from '@material-ui/core';

export const CTAButton = styled(Button)`
  display: block !important;
  margin: 0 auto !important;
  background-color: var(--first-accent) !important;
  min-width: 120px !important;
  font-size: 1em !important;
`;

export const PlayButton = ({
                               depositTokens,
                               withdrawTokens,
                               claimTokens,
                                boxState
                           }: {
    depositTokens: () => Promise<void>;
    withdrawTokens: () => Promise<void>;
    claimTokens: () => Promise<void>;
    boxState: string | null;
}) => {

    return (
        <CTAButton
            onClick={async () => {
                if (!boxState) {
                    console.log('Creating...');
                    await depositTokens();
                } else if (boxState === "created") {
                    console.log('Opening...');
                    await withdrawTokens();
                } else if (boxState === "opened") {
                    console.log('Claiming...');
                    await claimTokens();
                }
            }}
            variant="contained"
        >
            {(boxState === "created") ? (
                'OPEN'
            ) : (boxState === "opened") ? (
                "CLAIM"
            ) : (
                "CREATE"
            )}
        </CTAButton>
    );
};
