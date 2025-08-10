import InputField from "../InputField";
import RatingField from "../RatingFields";

interface GeneralFeedback {
  overallClubExperience: number;
  recommendToOthers: number;
  additionalComments: string;
  anonymousFeedback: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface GeneralFeedbackFormProps {
  formData: GeneralFeedback;
  errors: ValidationErrors;
  onChange: (field: keyof GeneralFeedback, value: string | number) => void;
}

// General Feedback Form
const GeneralFeedbackForm: React.FC<GeneralFeedbackFormProps> = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      

      <div className="grid md:grid-cols-2 gap-6">
        <RatingField
          id="overallClubExperience"
          label="Rate your overall experience in the club (1-10)"
          value={formData.overallClubExperience}
          onChange={(value) => onChange('overallClubExperience', value)}
          required
        />
        <RatingField
          id="recommendToOthers"
          label="How likely are you to recommend VinnovateIT to others? (1-10)"
          value={formData.recommendToOthers}
          onChange={(value) => onChange('recommendToOthers', value)}
          required
        />
      </div>

      <InputField
        id="additionalComments"
        label="Any additional comments or suggestions for the club?"
        type="textarea"
        value={formData.additionalComments}
        onChange={(value) => onChange('additionalComments', value)}
        placeholder="Share any other thoughts, ideas, or feedback"
        error={errors.additionalComments}
      />

      <InputField
        id="anonymousFeedback"
        label="Anonymous feedback (anything you want to share confidentially)"
        type="textarea"
        value={formData.anonymousFeedback}
        onChange={(value) => onChange('anonymousFeedback', value)}
        placeholder="This section is for sensitive feedback that you want to remain anonymous"
        error={errors.anonymousFeedback}
      />
    </div>
  );
};

export default GeneralFeedbackForm;