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
                               isLoading,
                               isDeposited
                           }: {
    depositTokens: () => Promise<void>;
    withdrawTokens: () => Promise<void>;
    isLoading: boolean;
    isDeposited: boolean;
}) => {

    return (
        <CTAButton
            disabled={isLoading}
            onClick={async () => {
                if (!isDeposited) {
                    console.log('Requesting gateway token');
                    await depositTokens();
                } else {
                    console.log('Minting...');
                    await withdrawTokens();
                }
            }}
            variant="contained"
        >
            {isLoading ? (
                <CircularProgress/>
            ) : isDeposited ? (
                'WITHDRAW'
            ) : (
                "DEPOSIT"
            )}
        </CTAButton>
    );
};
