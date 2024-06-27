'use client';

import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import {Chip} from "@nextui-org/chip";
import Mermaid from "./mermaid";

interface Step {
  id: string;
  label: string;
  defaultValue: number;
}

const steps: Step[] = [
  { id: 'targetCommission', label: 'Target $', defaultValue: 1000000 },
  { id: 'commissionRate', label: 'Your Commission Rate (%)', defaultValue: 40 },
  { id: 'caseSize', label: 'Average Case Size $', defaultValue: 5000 },
  { id: 'closingRatio', label: 'Deal-Closing Ratio N:1 (1 Successful Deal per N Appointments)', defaultValue: 3 },
  { id: 'openingRatio', label: 'Appointment-Opening Ratio M:1 (1 Appointment per M Interested Prospects)', defaultValue: 3 },
  { id: 'approachRatio', label: 'Approach Ratio K:1 (1 Interested Prospect per K Initial Contacts)', defaultValue: 10 },
];

interface Inputs {
  targetCommission: number;
  commissionRate: number;
  caseSize: number;
  closingRatio: number;
  openingRatio: number;
  approachRatio: number;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<Inputs>({
    targetCommission: steps[0].defaultValue,
    commissionRate: steps[1].defaultValue,
    caseSize: steps[2].defaultValue,
    closingRatio: steps[3].defaultValue,
    openingRatio: steps[4].defaultValue,
    approachRatio: steps[5].defaultValue,
  });

  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totals, setTotals] = useState({
    totalPremium: 0,
    casesNeeded: 0,
    appointmentsNeeded: 0,
    prospectsNeeded: 0,
    initialContactsNeeded: 0,
  });
  const [mermaidDiagram, setMermaidDiagram] = useState('');

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
    const { targetCommission, commissionRate, caseSize, closingRatio, openingRatio, approachRatio } = inputs;
    const totalPremium = targetCommission / (commissionRate / 100);
    const casesNeeded = totalPremium / caseSize;
    const appointmentsNeeded = casesNeeded * closingRatio;
    const prospectsNeeded = appointmentsNeeded * openingRatio;
    const initialContactsNeeded = prospectsNeeded * approachRatio;
    const averagePremiumPerInitialContact = targetCommission / initialContactsNeeded;

    setTotals({
      totalPremium: parseFloat(totalPremium.toFixed(2)),
      casesNeeded: parseFloat(casesNeeded.toFixed(2)),
      appointmentsNeeded: parseFloat(appointmentsNeeded.toFixed(2)),
      prospectsNeeded: parseFloat(prospectsNeeded.toFixed(2)),
      initialContactsNeeded: parseFloat(initialContactsNeeded.toFixed(2)),
    });

    setResult(parseFloat(averagePremiumPerInitialContact.toFixed(2)));
    setShowResult(true);

    const mermaidString = `
      graph TD
        A[Target: $${targetCommission.toFixed(2)}]
        B[Commission Rate: ${commissionRate}%]
        C[Total Premium Needed: $${totalPremium.toFixed(2)}]
        D[Average Deal Size: $${caseSize.toFixed(2)}]
        E[Number of Deals Needed: ${casesNeeded.toFixed(2)}]
        F[Deal Closing Ratio: ${closingRatio}:1]
        G[Appointments Needed: ${appointmentsNeeded.toFixed(2)}]
        H[Appt Opening Ratio: ${openingRatio}:1]
        I[Interested Prospects: ${prospectsNeeded.toFixed(2)}]
        J[Approach to Prospect Ratio: ${approachRatio}:1]
        K[Initial Contacts Needed: ${initialContactsNeeded.toFixed(2)}]
        L[Avg Premium per Initial Contact: $${averagePremiumPerInitialContact.toFixed(2)}]

        A --> C
        B --> C
        C --> E
        D --> E
        E -->|${casesNeeded.toFixed(2)} * ${closingRatio}| G
        F --> G
        G -->|${appointmentsNeeded.toFixed(2)} * ${openingRatio}| I
        H --> I
        I -->|${prospectsNeeded.toFixed(2)} * ${approachRatio}| K
        J --> K
        A --> L
        K -->|$${targetCommission.toFixed(2)} / ${initialContactsNeeded.toFixed(2)}| L
    `;

    setMermaidDiagram(mermaidString);

  };

  return (
    <div className="flex flex-col justify-between px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Sales Calculator</h1>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {currentStep < steps.length ? (
          <div className="space-y-4">
            <h3 className="text-2xl">{steps[currentStep].label}</h3>
            <Input
              id={steps[currentStep].id}
              type="number"
              value={inputs[steps[currentStep].id as keyof Inputs].toString()}
              onChange={handleChange}
              fullWidth
            />
            <div className="flex justify-center space-x-4">
              {currentStep > 0 && <Button onClick={handlePrev}>Previous</Button>}
              <Button onClick={handleNext}>{currentStep < steps.length - 1 ? 'Next' : 'Calculate'}</Button>
            </div>
          </div>
        ) : (
          <>
          <div className={`transition-opacity duration-1000 w-2/3 ${showResult ? 'opacity-100' : 'opacity-0'}`}>
            <p>Total Revenue or Premium Needed: <Chip color="success" variant="bordered">${totals.totalPremium}</Chip></p>
            <p>Closing Cases Needed: <Chip color="success" variant="bordered">{totals.casesNeeded}</Chip></p>
            <p>Opening Appointments Needed: <Chip color="success" variant="bordered">{totals.appointmentsNeeded}</Chip></p>
            <p>Prospects to Contact: <Chip color="success" variant="bordered">{totals.prospectsNeeded}</Chip></p>
            <p>Initial Contacts Needed: <Chip color="success" variant="bordered">{totals.initialContactsNeeded}</Chip></p>

            <h2 className="text-2xl mb-4">
              Average Value per Initial Contact: <Chip color="success" variant="shadow">${result}</Chip>
            </h2>
            <Mermaid chart={mermaidDiagram} />
          </div>

          </>
        )}
      </div>
    </div>
  );

}
