import InputField from "../InputField";
import RatingField from "../RatingFields";

interface Journey {
  contribution: string;
  projects: string;
  events: string;
  skillsLearned: string;
  overallContribution: number;
  techContribution: number;
  managementContribution: number;
  designContribution: number;
  challenges: string;
  howChanged: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface JourneyFormProps {
  formData: Journey;
  errors: ValidationErrors;
  onChange: (field: keyof Journey, value: string | number) => void;
}

const JourneyForm: React.FC<JourneyFormProps> = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <InputField
        id="contribution"
        label="Mention your contribution in VinnovateIT in brief"
        type="textarea"
        value={formData.contribution}
        onChange={(value) => onChange('contribution', value)}
        required
        placeholder="Describe your overall contribution to the club"
        error={errors.contribution}
      />

      <InputField
        id="projects"
        label="Mention the projects you've been a part of (with your role)"
        type="textarea"
        value={formData.projects}
        onChange={(value) => onChange('projects', value)}
        required
        placeholder="List projects and your specific roles in each"
        error={errors.projects}
      />

      <InputField
        id="events"
        label="Mention the events you've been a part of (with your role)"
        type="textarea"
        value={formData.events}
        onChange={(value) => onChange('events', value)}
        required
        placeholder="List events and your specific roles in each"
        error={errors.events}
      />

      <InputField
        id="skillsLearned"
        label="What are some skills you've learnt/improved in this club?"
        type="textarea"
        value={formData.skillsLearned}
        onChange={(value) => onChange('skillsLearned', value)}
        required
        placeholder="Technical and soft skills you've developed"
        error={errors.skillsLearned}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <RatingField
          id="overallContribution"
          label="Rate your overall contribution to the club (1-10)"
          value={formData.overallContribution}
          onChange={(value) => onChange('overallContribution', value)}
          required
        />
        <RatingField
          id="techContribution"
          label="Rate your contribution to the tech team (1-10)"
          value={formData.techContribution}
          onChange={(value) => onChange('techContribution', value)}
          required
        />
        <RatingField
          id="managementContribution"
          label="Rate your contribution to the management team (1-10)"
          value={formData.managementContribution}
          onChange={(value) => onChange('managementContribution', value)}
          required
        />
        <RatingField
          id="designContribution"
          label="Rate your contribution to the design team (1-10)"
          value={formData.designContribution}
          onChange={(value) => onChange('designContribution', value)}
          required
        />
      </div>

      <InputField
        id="challenges"
        label="Mention any challenges you've faced in the club"
        type="textarea"
        value={formData.challenges}
        onChange={(value) => onChange('challenges', value)}
        required
        placeholder="Describe challenges and how you overcame them"
        error={errors.challenges}
      />

      <InputField
        id="howChanged"
        label="Mention how VinnovateIT has changed you (both positive and negative ways)"
        type="textarea"
        value={formData.howChanged}
        onChange={(value) => onChange('howChanged', value)}
        required
        placeholder="Reflect on your personal and professional growth"
        error={errors.howChanged}
      />
    </div>
  );
};

export default JourneyForm;