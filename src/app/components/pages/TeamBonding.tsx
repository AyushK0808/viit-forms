import InputField from "../InputField";
import RatingField from "../RatingFields";
interface TeamBonding {
  memberBonding: number;
  likelyToSeekHelp: number;
  clubEnvironment: string;
  likedCharacteristics: string;
  dislikedCharacteristics: string;
  favoriteTeammates: string;
  favoriteTeammatesTraits: string;
  improvementSuggestions: string;
}

interface ValidationErrors {
  [key: string]: string;
}

// Team Bonding Form Props
interface TeamBondingFormProps {
  formData: TeamBonding;
  errors: ValidationErrors;
  onChange: (field: keyof TeamBonding, value: string | number) => void;
}

const TeamBondingForm: React.FC<TeamBondingFormProps> = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      

      <div className="grid md:grid-cols-2 gap-6">
        <RatingField
          id="memberBonding"
          label="Rate your bonding with the club members (1-10)"
          value={formData.memberBonding}
          onChange={(value) => onChange('memberBonding', value)}
          required
        />
        <RatingField
          id="likelyToSeekHelp"
          label="How likely are you to talk to a fellow club member if you need help/advice? (1-10)"
          value={formData.likelyToSeekHelp}
          onChange={(value) => onChange('likelyToSeekHelp', value)}
          required
        />
      </div>

      <InputField
        id="clubEnvironment"
        label="How is the environment of the club according to you? Explain in short"
        type="textarea"
        value={formData.clubEnvironment}
        onChange={(value) => onChange('clubEnvironment', value)}
        required
        placeholder="Describe the overall atmosphere and culture"
        error={errors.clubEnvironment}
      />

      <InputField
        id="likedCharacteristics"
        label="What are some personal characteristics about your teammates and seniors that you like?"
        type="textarea"
        value={formData.likedCharacteristics}
        onChange={(value) => onChange('likedCharacteristics', value)}
        required
        placeholder="Positive traits you appreciate in others"
        error={errors.likedCharacteristics}
      />

      <InputField
        id="dislikedCharacteristics"
        label="What are some personal characteristics about your teammates and seniors that you do not like?"
        type="textarea"
        value={formData.dislikedCharacteristics}
        onChange={(value) => onChange('dislikedCharacteristics', value)}
        required
        placeholder="Areas where you think improvement is needed"
        error={errors.dislikedCharacteristics}
      />

      <InputField
        id="favoriteTeammates"
        label="Who have been your favourite teammates so far? Are they your friends or just teammates?"
        type="textarea"
        value={formData.favoriteTeammates}
        onChange={(value) => onChange('favoriteTeammates', value)}
        required
        placeholder="Mention names and your relationship with them"
        error={errors.favoriteTeammates}
      />

      <InputField
        id="favoriteTeammatesTraits"
        label="What are the best traits in the above people?"
        type="textarea"
        value={formData.favoriteTeammatesTraits}
        onChange={(value) => onChange('favoriteTeammatesTraits', value)}
        required
        placeholder="Specific qualities that make them stand out"
        error={errors.favoriteTeammatesTraits}
      />

      <InputField
        id="improvementSuggestions"
        label="How do you think we can improve the team bonding within the club?"
        type="textarea"
        value={formData.improvementSuggestions}
        onChange={(value) => onChange('improvementSuggestions', value)}
        required
        placeholder="Your suggestions for better team cohesion"
        error={errors.improvementSuggestions}
      />
    </div>
  );
};

export default TeamBondingForm;