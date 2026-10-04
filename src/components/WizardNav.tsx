"use client";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
};

export function WizardNav({ onBack, onNext, nextLabel = "Next" }: Props) {
  return (
    <div className="wizard-nav">
      {onBack ? (
        <button type="button" className="button reset" onClick={onBack}>
          Back
        </button>
      ) : (
        <span />
      )}
      {onNext && (
        <button type="button" className="button secondary" onClick={onNext}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}
