'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, Input } from '@nextui-org/react';
import Fade from '@mui/material/Fade';

interface Step {
  id: string;
  label: string;
  defaultValue: number;
}

const steps: Step[] = [
  { id: 'targetCommission', label: 'Target $', defaultValue: 100000 },
  { id: 'commissionRate', label: 'Commission Rate (%)', defaultValue: 40 },
  { id: 'caseSize', label: 'Average Case Size $', defaultValue: 5000 },
  { id: 'closingRatio', label: 'Average Closing Ratio N:1', defaultValue: 3 },
  { id: 'openingRatio', label: 'Average Opening Ratio M:1', defaultValue: 3 },
  { id: 'approvalRatio', label: 'Average Approval Ratio K:1', defaultValue: 10 },
];

interface Inputs {
  targetCommission: number;
  commissionRate: number;
  caseSize: number;
  closingRatio: number;
  openingRatio: number;
  approvalRatio: number;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<Inputs>({
    targetCommission: steps[0].defaultValue,
    commissionRate: steps[1].defaultValue,
    caseSize: steps[2].defaultValue,
    closingRatio: steps[3].defaultValue,
    openingRatio: steps[4].defaultValue,
    approvalRatio: steps[5].defaultValue,
  });

  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setResult(null);
    }
  };

  const calculateResult = () => {
    const { targetCommission, commissionRate, caseSize, closingRatio, openingRatio, approvalRatio } = inputs;
    const totalPremium = targetCommission / (commissionRate / 100);
    const casesNeeded = totalPremium / caseSize;
    const appointmentsNeeded = casesNeeded * closingRatio;
    const prospectsNeeded = appointmentsNeeded * openingRatio;
    const initialContactsNeeded = prospectsNeeded * approvalRatio;
    const averagePremiumPerInitialContact = targetCommission / initialContactsNeeded;
    setResult(parseFloat(averagePremiumPerInitialContact.toFixed(2)));
    setShowResult(true); // Show the result
  };

  return (
    <Container>
      <Typography variant="h1">Sales Calculator</Typography>
      {currentStep < steps.length ? (
        <>
          <Typography variant="h3">{steps[currentStep].label}</Typography>
          <Input
            id={steps[currentStep].id}
            type="number"
            value={inputs[steps[currentStep].id as keyof Inputs].toString()}
            onChange={handleChange}
            fullWidth
          />
          <div>
            {currentStep > 0 && <Button onClick={handlePrev}>Previous</Button>}
            <Button onClick={handleNext}>{currentStep < steps.length - 1 ? 'Next' : 'Calculate'}</Button>
          </div>
        </>
      ) : (
        <Fade in={showResult} timeout={1500}>
          <Typography variant="h2">Average Premium per Initial Contact: ${result}</Typography>          
        </Fade>
      )}
    </Container>
  );
}
